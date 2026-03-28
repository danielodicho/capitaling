"use client";

import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";

import {
	type RegionFilter,
	allCountryCards,
	countryCardsByCode,
	getCardsForRegion,
	getRegionLabel,
	regionFilterOptions,
} from "@/lib/game-data";
import {
	type PromptState,
	type RunState,
	advanceAfterReveal,
	applyAnswerResolution,
	createRun,
	evaluateAnswer,
	expandPrompt,
} from "@/lib/game-engine";
import {
	type BadgeDefinition,
	type PlayerProgress,
	createEmptyProgress,
	getAccuracy,
	getLevelProgress,
	getMasteryLabel,
	getRecentMissCards,
	getRegionProgressSummary,
	getUnlockedBadges,
	loadProgress,
	recordAnswerOnProfile,
	recordRunStart,
	saveProgress,
} from "@/lib/game-storage";

const REVEAL_DURATION_MS = 1600;

type SummarySnapshot = {
	run: RunState;
	newBadges: BadgeDefinition[];
};

export default function GameShell() {
	const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("all");
	const [profile, setProfile] = useState<PlayerProgress>(createEmptyProgress);
	const [hydrated, setHydrated] = useState(false);
	const [run, setRun] = useState<RunState | null>(null);
	const [summary, setSummary] = useState<SummarySnapshot | null>(null);
	const [soundEnabled, setSoundEnabled] = useState(true);
	const revealTimerRef = useRef<number | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const profileRef = useRef(profile);
	const runRef = useRef<RunState | null>(run);
	const runBadgeIdsRef = useRef<string[]>([]);
	const handleAnswerRef = useRef<(choice: string) => void>(() => {});

	useEffect(() => {
		const loaded = loadProgress();
		setProfile(loaded);
		setHydrated(true);
	}, []);

	useEffect(() => {
		if (!hydrated) {
			return;
		}

		saveProgress(profile);
	}, [hydrated, profile]);

	useEffect(() => {
		profileRef.current = profile;
	}, [profile]);

	useEffect(() => {
		runRef.current = run;
	}, [run]);

	useEffect(() => {
		return () => {
			if (revealTimerRef.current) {
				window.clearTimeout(revealTimerRef.current);
			}
		};
	}, []);

	useEffect(() => {
		if (run?.phase !== "active" || !run.currentPrompt) {
			return;
		}

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.metaKey || event.ctrlKey || event.altKey) {
				return;
			}

			const prompt = run.currentPrompt;
			if (!prompt) {
				return;
			}

			const key = event.key.toLowerCase();

			if (!prompt.isExpanded && (key === "arrowleft" || key === "a")) {
				event.preventDefault();
				handleAnswerRef.current(prompt.collapsedOptions[0]);
				return;
			}

			if (!prompt.isExpanded && (key === "arrowright" || key === "d")) {
				event.preventDefault();
				handleAnswerRef.current(prompt.collapsedOptions[1]);
				return;
			}

			if (prompt.isExpanded && ["1", "2", "3", "4"].includes(key)) {
				event.preventDefault();
				const option = prompt.expandedOptions[Number(key) - 1];
				if (option) {
					handleAnswerRef.current(option);
				}
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [run]);

	const selectedCards = useMemo(() => getCardsForRegion(selectedRegion), [selectedRegion]);
	const selectedRegionSummary = useMemo(
		() => getRegionProgressSummary(selectedCards, profile),
		[profile, selectedCards],
	);
	const levelProgress = useMemo(() => getLevelProgress(profile.totalXp), [profile.totalXp]);
	const unlockedBadges = useMemo(() => getUnlockedBadges(profile), [profile]);
	const recentMissCards = useMemo(() => getRecentMissCards(allCountryCards, profile), [profile]);
	const totalAccuracy = getAccuracy(profile.totalCorrect, profile.totalIncorrect);

	function startStandardRun(regionFilter: RegionFilter) {
		clearRevealTimer();
		setSummary(null);
		const nextProfile = recordRunStart(profile);
		const pool = getCardsForRegion(regionFilter);
		runBadgeIdsRef.current = getUnlockedBadges(nextProfile).map((badge) => badge.id);

		setProfile(nextProfile);
		startTransition(() => {
			setRun(
				createRun({
					pool,
					optionPool: pool.length >= 4 ? pool : allCountryCards,
					regionFilter,
					label: getRegionLabel(regionFilter),
				}),
			);
		});
	}

	function startReviewRun(codes: string[]) {
		const reviewPool = dedupeCards(
			codes.map((code) => countryCardsByCode[code]).filter((card): card is NonNullable<typeof card> => Boolean(card)),
		);

		if (!reviewPool.length) {
			return;
		}

		clearRevealTimer();
		setSummary(null);
		const nextProfile = recordRunStart(profile);
		runBadgeIdsRef.current = getUnlockedBadges(nextProfile).map((badge) => badge.id);
		setProfile(nextProfile);

		startTransition(() => {
			setRun(
				createRun({
					pool: reviewPool,
					optionPool: allCountryCards,
					regionFilter: "review",
					mode: "review",
					label: "Review Replay",
				}),
			);
		});
	}

	function handleAnswer(choice: string) {
		if (!run || run.phase !== "active" || !run.currentPrompt) {
			return;
		}

		const resolution = evaluateAnswer(run, choice);
		const nextProfile = recordAnswerOnProfile(profile, {
			card: run.currentPrompt.card,
			correct: resolution.correct,
			xpAwarded: resolution.xpAwarded,
			runBestStreak: resolution.nextBestStreak,
		});
		const masteryTier = getMasteryLabel(nextProfile, run.currentPrompt.card.code);
		const nextRun = applyAnswerResolution(run, resolution, masteryTier);

		setProfile(nextProfile);
		setRun(nextRun);
		playFeedback(resolution.correct);

		if (typeof window !== "undefined" && "vibrate" in navigator) {
			navigator.vibrate(resolution.correct ? 18 : 45);
		}

		scheduleAdvance(nextRun, nextProfile);
	}

	handleAnswerRef.current = handleAnswer;

	function handleExpandChoices() {
		if (!run || run.phase !== "active") {
			return;
		}

		setRun(expandPrompt(run));
	}

	function handleAdvance(profileSnapshot = profileRef.current) {
		const currentRun = runRef.current;
		if (!currentRun) {
			return;
		}

		clearRevealTimer();
		const nextRun = advanceAfterReveal(currentRun);

		if (nextRun.phase === "summary") {
			const badgesAfterAdvance = getUnlockedBadges(profileSnapshot);
			setSummary({
				run: nextRun,
				newBadges: badgesAfterAdvance.filter((badge) => !runBadgeIdsRef.current.includes(badge.id)),
			});
			setRun(null);
			return;
		}

		setRun(nextRun);
	}

	function handleReturnToLobby() {
		clearRevealTimer();
		setRun(null);
		setSummary(null);
	}

	function scheduleAdvance(nextRun: RunState, nextProfile: PlayerProgress) {
		clearRevealTimer();
		revealTimerRef.current = window.setTimeout(() => {
			handleAdvance(nextProfile);
		}, REVEAL_DURATION_MS);

		if (nextRun.phase === "summary") {
			clearRevealTimer();
		}
	}

	function clearRevealTimer() {
		if (revealTimerRef.current) {
			window.clearTimeout(revealTimerRef.current);
			revealTimerRef.current = null;
		}
	}

	async function playFeedback(correct: boolean) {
		if (!soundEnabled || typeof window === "undefined") {
			return;
		}

		const AudioContextClass =
			window.AudioContext ||
			(
				window as Window &
					typeof globalThis & {
						webkitAudioContext?: typeof AudioContext;
					}
			).webkitAudioContext;
		if (!AudioContextClass) {
			return;
		}

		if (!audioContextRef.current) {
			audioContextRef.current = new AudioContextClass();
		}

		const audioContext = audioContextRef.current;
		if (audioContext.state === "suspended") {
			await audioContext.resume();
		}

		const oscillator = audioContext.createOscillator();
		const gain = audioContext.createGain();
		oscillator.connect(gain);
		gain.connect(audioContext.destination);

		const now = audioContext.currentTime;
		oscillator.type = correct ? "triangle" : "square";
		oscillator.frequency.setValueAtTime(correct ? 560 : 190, now);
		oscillator.frequency.exponentialRampToValueAtTime(correct ? 720 : 150, now + 0.18);

		gain.gain.setValueAtTime(0.001, now);
		gain.gain.exponentialRampToValueAtTime(correct ? 0.08 : 0.05, now + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.001, now + (correct ? 0.24 : 0.18));

		oscillator.start(now);
		oscillator.stop(now + (correct ? 0.24 : 0.18));
		oscillator.onended = () => {
			oscillator.disconnect();
			gain.disconnect();
		};
	}

	return (
		<main className="relative min-h-screen overflow-hidden px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute left-[-8rem] top-[-6rem] h-64 w-64 rounded-full bg-cyan-300/45 blur-3xl" />
				<div className="absolute right-[-4rem] top-20 h-72 w-72 rounded-full bg-amber-200/60 blur-3xl" />
				<div className="absolute bottom-[-8rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-rose-200/55 blur-3xl" />
			</div>

			<div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-7xl flex-col gap-5">
				<header className="glass-panel flex flex-wrap items-center justify-between gap-4 px-5 py-4">
					<div>
						<p className="text-xs uppercase tracking-[0.3em] text-slate-500">Capitals by flag</p>
						<h1 className="display-type text-3xl font-semibold text-slate-950 sm:text-4xl">Capitaling</h1>
					</div>

					<div className="flex flex-wrap items-center gap-2 text-sm">
						<MetricPill label="Level" value={String(levelProgress.level)} accent="bg-slate-950 text-white" />
						<MetricPill label="XP" value={String(profile.totalXp)} />
						<MetricPill label="Best streak" value={String(profile.bestStreak)} />
						<button
							type="button"
							className="rounded-full border border-white/60 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
							onClick={() => setSoundEnabled((enabled) => !enabled)}
						>
							Sound {soundEnabled ? "on" : "off"}
						</button>
					</div>
				</header>

				<AnimatePresence mode="wait">
					{run ? (
						<motion.section
							key="run"
							initial={{ opacity: 0, y: 18 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -18 }}
							transition={{ duration: 0.22, ease: "easeOut" }}
							className="grid flex-1 gap-5 lg:grid-cols-[1.35fr_0.85fr]"
						>
							<RunStage
								profile={profile}
								run={run}
								selectedRegion={selectedRegion}
								onAnswer={handleAnswer}
								onExpandChoices={handleExpandChoices}
								onAdvance={() => handleAdvance()}
							/>
							<RunSidebar onExit={handleReturnToLobby} profile={profile} run={run} />
						</motion.section>
					) : summary ? (
						<motion.section
							key="summary"
							initial={{ opacity: 0, y: 18 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -18 }}
							transition={{ duration: 0.22, ease: "easeOut" }}
							className="grid flex-1 gap-5 lg:grid-cols-[1.25fr_0.95fr]"
						>
							<SummaryStage
								profile={profile}
								summary={summary}
								onBack={handleReturnToLobby}
								onReplayMisses={() => startReviewRun(summary.run.missedCodes)}
								onRunAgain={() => startStandardRun(selectedRegion)}
							/>
							<LobbySidebar
								profile={profile}
								selectedCards={selectedCards}
								selectedRegion={selectedRegion}
								selectedRegionSummary={selectedRegionSummary}
								recentMissCards={recentMissCards}
								unlockedBadges={unlockedBadges}
								totalAccuracy={totalAccuracy}
							/>
						</motion.section>
					) : (
						<motion.section
							key="lobby"
							initial={{ opacity: 0, y: 18 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -18 }}
							transition={{ duration: 0.22, ease: "easeOut" }}
							className="grid flex-1 gap-5 lg:grid-cols-[1.35fr_0.85fr]"
						>
							<LobbyStage
								hydrated={hydrated}
								levelProgress={levelProgress}
								profile={profile}
								selectedRegion={selectedRegion}
								selectedRegionSummary={selectedRegionSummary}
								onSelectRegion={setSelectedRegion}
								onStart={() => startStandardRun(selectedRegion)}
							/>
							<LobbySidebar
								profile={profile}
								selectedCards={selectedCards}
								selectedRegion={selectedRegion}
								selectedRegionSummary={selectedRegionSummary}
								recentMissCards={recentMissCards}
								unlockedBadges={unlockedBadges}
								totalAccuracy={totalAccuracy}
							/>
						</motion.section>
					)}
				</AnimatePresence>
			</div>
		</main>
	);
}

function LobbyStage({
	hydrated,
	levelProgress,
	profile,
	selectedRegion,
	selectedRegionSummary,
	onSelectRegion,
	onStart,
}: {
	hydrated: boolean;
	levelProgress: ReturnType<typeof getLevelProgress>;
	profile: PlayerProgress;
	selectedRegion: RegionFilter;
	selectedRegionSummary: ReturnType<typeof getRegionProgressSummary>;
	onSelectRegion: (region: RegionFilter) => void;
	onStart: () => void;
}) {
	return (
		<section className="glass-panel relative overflow-hidden px-5 py-6 sm:px-7 sm:py-7">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.75),_transparent_60%)]" />
			<div className="relative flex h-full flex-col gap-8">
				<div className="space-y-4">
					<div className="flex flex-wrap items-center gap-2">
						<span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
							Swipe-first trainer
						</span>
						<span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
							Learn after every guess
						</span>
					</div>

					<div className="space-y-3">
						<h2 className="display-type max-w-2xl text-4xl font-semibold leading-none tracking-tight text-slate-950 sm:text-6xl">
							Train capitals like an arcade run, not a worksheet.
						</h2>
						<p className="max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
							Swipe left or right when you trust your instinct. Expand to four choices when you want help. Every miss
							comes back in review so the game teaches, not just scores.
						</p>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
					<div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.12)]">
						<div className="mb-4 flex items-center justify-between">
							<div>
								<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Run setup</p>
								<h3 className="text-xl font-semibold text-slate-950">Choose your region</h3>
							</div>
							<span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
								3 lives, endless streak
							</span>
						</div>

						<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
							{regionFilterOptions.map((option) => {
								const active = option.value === selectedRegion;
								return (
									<button
										key={option.value}
										type="button"
										onClick={() => onSelectRegion(option.value)}
										className={`rounded-[1.4rem] border px-4 py-4 text-left transition ${
											active
												? "border-slate-950 bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.22)]"
												: "border-slate-200 bg-slate-50/85 text-slate-700 hover:border-slate-400 hover:bg-white"
										}`}
									>
										<p className="text-sm font-semibold">{option.label}</p>
										<p className={`text-xs ${active ? "text-white/75" : "text-slate-500"}`}>
											{option.count} playable cards
										</p>
									</button>
								);
							})}
						</div>
					</div>

					<div className="rounded-[2rem] border border-slate-900/5 bg-[linear-gradient(160deg,_rgba(10,18,37,0.92),_rgba(35,52,89,0.82))] p-5 text-white shadow-[0_24px_56px_rgba(15,23,42,0.2)]">
						<p className="text-xs uppercase tracking-[0.24em] text-white/60">Your current arc</p>
						<div className="mt-3 space-y-4">
							<div>
								<div className="flex items-end justify-between gap-4">
									<p className="display-type text-5xl font-semibold">{levelProgress.level}</p>
									<div className="text-right text-sm text-white/75">
										<p>{profile.totalXp} XP banked</p>
										<p>{profile.runsPlayed} runs played</p>
									</div>
								</div>
								<div className="mt-3 h-3 overflow-hidden rounded-full bg-white/15">
									<div
										className="h-full rounded-full bg-[linear-gradient(90deg,_#f9d423,_#ff4e50)]"
										style={{ width: `${Math.round(levelProgress.progress * 100)}%` }}
									/>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-3 text-sm">
								<StatTile label="Practiced" value={String(selectedRegionSummary.practicedCards)} />
								<StatTile
									label="Solid+"
									value={String(selectedRegionSummary.solidCards + selectedRegionSummary.masteredCards)}
								/>
								<StatTile label="Mastered" value={String(selectedRegionSummary.masteredCards)} />
							</div>

							<button
								type="button"
								onClick={onStart}
								disabled={!hydrated}
								className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-4 text-base font-semibold text-slate-950 shadow-[0_14px_30px_rgba(255,255,255,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(255,255,255,0.26)]"
							>
								{hydrated ? `Start ${getRegionLabel(selectedRegion)}` : "Loading profile..."}
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function LobbySidebar({
	profile,
	selectedCards,
	selectedRegion,
	selectedRegionSummary,
	recentMissCards,
	unlockedBadges,
	totalAccuracy,
}: {
	profile: PlayerProgress;
	selectedCards: ReturnType<typeof getCardsForRegion>;
	selectedRegion: RegionFilter;
	selectedRegionSummary: ReturnType<typeof getRegionProgressSummary>;
	recentMissCards: ReturnType<typeof getRecentMissCards>;
	unlockedBadges: BadgeDefinition[];
	totalAccuracy: number;
}) {
	const regionRows = useMemo(
		() =>
			regionFilterOptions
				.filter((option) => option.value !== "all")
				.map((option) => ({
					...option,
					summary: getRegionProgressSummary(getCardsForRegion(option.value as RegionFilter), profile),
				})),
		[profile],
	);

	return (
		<aside className="flex flex-col gap-5">
			<section className="glass-panel px-5 py-5">
				<div className="flex items-center justify-between gap-3">
					<div>
						<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Profile pulse</p>
						<h3 className="text-xl font-semibold text-slate-950">What you are building</h3>
					</div>
					<span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
						{Math.round(totalAccuracy * 100)}% accuracy
					</span>
				</div>

				<div className="mt-4 grid grid-cols-2 gap-3 text-sm">
					<StatTile label="Correct" value={String(profile.totalCorrect)} />
					<StatTile label="Best streak" value={String(profile.bestStreak)} />
					<StatTile label="Current pack" value={selectedRegion === "all" ? "World" : selectedRegion} />
					<StatTile label="In pack" value={String(selectedCards.length)} />
				</div>

				<div className="mt-5 rounded-[1.6rem] bg-slate-950 px-4 py-4 text-white">
					<p className="text-xs uppercase tracking-[0.2em] text-white/60">Selected region snapshot</p>
					<div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
						<TinyCounter label="Learning" value={selectedRegionSummary.learningCards} />
						<TinyCounter label="Solid" value={selectedRegionSummary.solidCards} />
						<TinyCounter label="Mastered" value={selectedRegionSummary.masteredCards} />
					</div>
				</div>
			</section>

			<section className="glass-panel px-5 py-5">
				<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Badges</p>
				<h3 className="mt-1 text-xl font-semibold text-slate-950">Milestones</h3>
				<div className="mt-4 flex flex-wrap gap-3">
					{unlockedBadges.length ? (
						unlockedBadges.map((badge) => (
							<div key={badge.id} className="rounded-[1.2rem] border border-amber-200 bg-amber-50 px-3 py-3">
								<p className="text-sm font-semibold text-amber-900">{badge.label}</p>
								<p className="text-xs text-amber-700">{badge.kicker}</p>
							</div>
						))
					) : (
						<p className="text-sm text-slate-600">Your first badges unlock as soon as you start stacking streaks.</p>
					)}
				</div>
			</section>

			<section className="glass-panel px-5 py-5">
				<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Region mastery</p>
				<div className="mt-4 space-y-3">
					{regionRows.map((row) => (
						<div key={row.value} className="rounded-[1.4rem] border border-white/60 bg-white/80 px-4 py-3">
							<div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
								<span>{row.label}</span>
								<span>
									{row.summary.masteredCards}/{row.count} mastered
								</span>
							</div>
							<div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
								<div
									className="h-full rounded-full bg-[linear-gradient(90deg,_#00c6ff,_#0072ff)]"
									style={{
										width: `${
											row.summary.totalCards ? (row.summary.masteredCards / row.summary.totalCards) * 100 : 0
										}%`,
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="glass-panel px-5 py-5">
				<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Recently missed</p>
				<div className="mt-4 space-y-3">
					{recentMissCards.length ? (
						recentMissCards.slice(0, 5).map((card) => (
							<div
								key={card.code}
								className="flex items-center justify-between gap-3 rounded-[1.3rem] bg-white/85 px-4 py-3"
							>
								<div>
									<p className="text-sm font-semibold text-slate-800">{card.country}</p>
									<p className="text-xs text-slate-500">{card.capital}</p>
								</div>
								<span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">Review me</span>
							</div>
						))
					) : (
						<p className="text-sm text-slate-600">Your missed cards will queue up here for quick replay sessions.</p>
					)}
				</div>
			</section>
		</aside>
	);
}

function RunStage({
	profile,
	run,
	selectedRegion,
	onAnswer,
	onAdvance,
	onExpandChoices,
}: {
	profile: PlayerProgress;
	run: RunState;
	selectedRegion: RegionFilter;
	onAnswer: (choice: string) => void;
	onAdvance: () => void;
	onExpandChoices: () => void;
}) {
	const prompt = run.currentPrompt;

	if (!prompt) {
		return null;
	}

	const options = prompt.isExpanded ? prompt.expandedOptions : prompt.collapsedOptions;
	const masteryTier = getMasteryLabel(profile, prompt.card.code);

	return (
		<section className="glass-panel flex flex-col gap-4 px-4 py-5 sm:px-6 sm:py-6">
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<MetricPill label="Mode" value={run.label} accent="bg-slate-950 text-white" />
				<MetricPill label="Lives" value={`${run.lives}/3`} />
				<MetricPill label="Streak" value={String(run.streak)} />
				<MetricPill label="XP this run" value={String(run.xpEarned)} />
			</div>

			<div className="grid flex-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
				<FlagPromptCard prompt={prompt} run={run} onAnswer={onAnswer} />

				<section className="rounded-[2rem] border border-white/65 bg-white/75 p-5 shadow-[0_14px_38px_rgba(15,23,42,0.1)]">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Prompt status</p>
							<h3 className="text-2xl font-semibold text-slate-950">{prompt.card.country}</h3>
						</div>
						<span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
							{prompt.source === "review" ? "Review card" : "Fresh card"}
						</span>
					</div>

					<div className="mt-4 grid gap-3 sm:grid-cols-2">
						<StatTile label="Region" value={prompt.card.region} />
						<StatTile label="Subregion" value={prompt.card.subregion} />
						<StatTile label="Mastery" value={masteryTier} />
						<StatTile label="Review queue" value={String(run.reviewQueue.length)} />
					</div>

					<div className="mt-5">
						<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Controls</p>
						<div className="mt-3 grid gap-3">
							<button
								type="button"
								onClick={onExpandChoices}
								disabled={prompt.isExpanded || run.phase !== "active"}
								className="rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-white"
							>
								<p className="text-sm font-semibold text-slate-800">
									{prompt.isExpanded ? "Expanded to four choices" : "Need help? Expand to four choices"}
								</p>
								<p className="mt-1 text-xs text-slate-500">
									You keep the run alive, but you lose the perfect-answer bonus on this card.
								</p>
							</button>

							<div className="rounded-[1.4rem] bg-slate-950 px-4 py-4 text-white">
								<p className="text-sm font-semibold">
									{prompt.isExpanded ? "Tap 1-4 or click an answer" : "Swipe left/right or use A / D"}
								</p>
								<p className="mt-1 text-xs text-white/70">
									{selectedRegion === "all"
										? "World Tour distractors stay region-aware."
										: `Distractors stay close to ${selectedRegion}.`}
								</p>
							</div>
						</div>
					</div>

					<AnimatePresence mode="wait">
						{run.phase === "reveal" && run.reveal ? (
							<motion.button
								key="reveal"
								type="button"
								onClick={onAdvance}
								initial={{ opacity: 0, y: 14 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -14 }}
								transition={{ duration: 0.2, ease: "easeOut" }}
								className={`mt-5 block w-full rounded-[1.7rem] border px-4 py-4 text-left ${
									run.reveal.correct
										? "border-emerald-200 bg-emerald-50 text-emerald-950"
										: "border-rose-200 bg-rose-50 text-rose-950"
								}`}
							>
								<p className="text-sm font-semibold uppercase tracking-[0.18em]">
									{run.reveal.correct ? "Correct" : "Wrong"}{" "}
									{run.reveal.correct ? `+${run.reveal.xpAwarded} XP` : "-1 life"}
								</p>
								<p className="mt-2 text-2xl font-semibold">
									{prompt.card.country} to {run.reveal.correctCapital}
								</p>
								<p className="mt-1 text-sm">
									{prompt.card.region}, {prompt.card.subregion}. Mastery now: {run.reveal.masteryTier}.
								</p>
								<p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] opacity-70">Tap to continue</p>
							</motion.button>
						) : null}
					</AnimatePresence>

					<div className="mt-5 grid gap-3 sm:grid-cols-2">
						{options.map((option, index) => (
							<button
								key={option}
								type="button"
								onClick={() => onAnswer(option)}
								disabled={run.phase !== "active"}
								className={`group rounded-[1.4rem] border px-4 py-4 text-left transition ${
									run.phase !== "active"
										? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400"
										: "border-white/70 bg-white text-slate-900 shadow-[0_12px_26px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_30px_rgba(15,23,42,0.12)]"
								}`}
							>
								<p className="text-xs uppercase tracking-[0.2em] text-slate-400">
									{prompt.isExpanded ? `Choice ${index + 1}` : index === 0 ? "Swipe left" : "Swipe right"}
								</p>
								<p className="mt-2 text-xl font-semibold">{option}</p>
								<p className="mt-1 text-sm text-slate-500">
									{prompt.isExpanded ? "Tap or press the matching number key." : "Quick instinct answer."}
								</p>
							</button>
						))}
					</div>
				</section>
			</div>
		</section>
	);
}

function FlagPromptCard({
	prompt,
	run,
	onAnswer,
}: {
	prompt: PromptState;
	run: RunState;
	onAnswer: (choice: string) => void;
}) {
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-160, 0, 160], [-10, 0, 10]);
	const shadow = useTransform(
		x,
		[-140, 0, 140],
		[
			"0 20px 40px rgba(14, 165, 233, 0.22)",
			"0 28px 54px rgba(15, 23, 42, 0.14)",
			"0 20px 40px rgba(244, 63, 94, 0.22)",
		],
	);

	return (
		<div className="relative flex min-h-[26rem] flex-col overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(248,250,252,0.82))] p-4 shadow-[0_24px_56px_rgba(15,23,42,0.14)] sm:p-5">
			<div className="mb-3 flex flex-wrap items-center justify-between gap-3">
				<div>
					<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Guess the capital</p>
					<p className="text-lg font-semibold text-slate-950">
						{prompt.source === "review" ? "This one came back for review." : "Trust your read, then learn."}
					</p>
				</div>
				<div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
					{prompt.isExpanded ? "Expanded mode" : "Swipe mode"}
				</div>
			</div>

			<motion.div
				drag={run.phase === "active" && !prompt.isExpanded ? "x" : false}
				dragConstraints={{ left: 0, right: 0 }}
				onDragEnd={(_, info) => {
					if (run.phase !== "active" || prompt.isExpanded) {
						x.set(0);
						return;
					}

					if (info.offset.x < -110) {
						onAnswer(prompt.collapsedOptions[0]);
						return;
					}

					if (info.offset.x > 110) {
						onAnswer(prompt.collapsedOptions[1]);
						return;
					}

					x.set(0);
				}}
				style={{ x, rotate, boxShadow: shadow }}
				className="relative flex flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-white/70 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(241,245,249,0.88))]"
			>
				<div className="absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,_rgba(14,165,233,0.16),_transparent)]" />
				<div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,_rgba(244,63,94,0.12),_transparent)]" />

				<div className="relative flex h-full flex-col justify-between p-4 sm:p-6">
					<div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
						<span>{prompt.card.region}</span>
						<span>{prompt.card.subregion}</span>
					</div>

					<div className="relative mx-auto flex w-full max-w-3xl flex-1 items-center justify-center py-4">
						<div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.4rem] border border-white/70 bg-white/90">
							<Image
								src={prompt.card.flagPath}
								alt={`Flag of ${prompt.card.country}`}
								fill
								priority
								sizes="(max-width: 1024px) 90vw, 50vw"
								className="object-cover"
							/>
						</div>
					</div>

					<div className="rounded-[1.4rem] bg-slate-950 px-4 py-3 text-sm text-white">
						{prompt.isExpanded
							? "Four-choice assist is open. Perfect bonus is off for this card."
							: "Swipe left for the left answer, swipe right for the right answer."}
					</div>
				</div>
			</motion.div>
		</div>
	);
}

function RunSidebar({
	onExit,
	profile,
	run,
}: {
	onExit: () => void;
	profile: PlayerProgress;
	run: RunState;
}) {
	const levelProgress = getLevelProgress(profile.totalXp);

	return (
		<aside className="flex flex-col gap-5">
			<section className="glass-panel px-5 py-5">
				<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Run pulse</p>
				<div className="mt-4 grid grid-cols-2 gap-3 text-sm">
					<StatTile label="Correct" value={String(run.correctCount)} />
					<StatTile label="Misses" value={String(run.incorrectCount)} />
					<StatTile label="Perfects" value={String(run.perfectCount)} />
					<StatTile label="Review cards" value={String(run.reviewCount)} />
				</div>
			</section>

			<section className="glass-panel px-5 py-5">
				<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Long-term progress</p>
				<div className="mt-4 space-y-4">
					<div>
						<div className="flex items-center justify-between gap-3">
							<p className="text-sm font-semibold text-slate-900">Level {levelProgress.level}</p>
							<p className="text-xs font-medium text-slate-500">{profile.totalXp} XP total</p>
						</div>
						<div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
							<div
								className="h-full rounded-full bg-[linear-gradient(90deg,_#34d399,_#06b6d4)]"
								style={{ width: `${Math.round(levelProgress.progress * 100)}%` }}
							/>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3 text-sm">
						<StatTile label="Best streak" value={String(profile.bestStreak)} />
						<StatTile label="Runs played" value={String(profile.runsPlayed)} />
					</div>
				</div>
			</section>

			<section className="glass-panel px-5 py-5">
				<p className="text-xs uppercase tracking-[0.24em] text-slate-500">What the game is doing</p>
				<div className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
					<p>Wrong answers go into review and surface again during the run so the memory gets reinforced.</p>
					<p>
						Quick two-choice answers earn bonus XP. Expanding to four choices keeps the run alive while reducing reward.
					</p>
					<p>
						Mastery grows country by country, so repeated correct answers turn “learning” into “solid” and then
						“mastered”.
					</p>
				</div>
			</section>

			<button
				type="button"
				onClick={onExit}
				className="rounded-full border border-slate-200 bg-white/80 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:bg-white"
			>
				End run and return to lobby
			</button>
		</aside>
	);
}

function SummaryStage({
	profile,
	summary,
	onBack,
	onReplayMisses,
	onRunAgain,
}: {
	profile: PlayerProgress;
	summary: SummarySnapshot;
	onBack: () => void;
	onReplayMisses: () => void;
	onRunAgain: () => void;
}) {
	const accuracy = getAccuracy(summary.run.correctCount, summary.run.incorrectCount);
	const missedCards = dedupeCards(summary.run.missedCodes.map((code) => countryCardsByCode[code]).filter(Boolean));

	return (
		<section className="glass-panel flex flex-col gap-5 px-5 py-6 sm:px-7">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Run summary</p>
					<h2 className="display-type text-4xl font-semibold text-slate-950 sm:text-5xl">Strong finish.</h2>
					<p className="mt-2 max-w-2xl text-base leading-7 text-slate-700">
						You pushed {summary.run.label} until the run broke. The misses are queued, your XP stuck, and the next
						attempt can be tighter.
					</p>
				</div>
				<div className="rounded-[1.6rem] bg-slate-950 px-5 py-4 text-white shadow-[0_24px_60px_rgba(15,23,42,0.24)]">
					<p className="text-xs uppercase tracking-[0.2em] text-white/60">XP earned</p>
					<p className="display-type mt-2 text-5xl font-semibold">+{summary.run.xpEarned}</p>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-4">
				<StatTile label="Best run streak" value={String(summary.run.bestStreak)} className="bg-white/90" />
				<StatTile label="Accuracy" value={`${Math.round(accuracy * 100)}%`} className="bg-white/90" />
				<StatTile label="Perfect answers" value={String(summary.run.perfectCount)} className="bg-white/90" />
				<StatTile label="Review cards" value={String(summary.run.missedCodes.length)} className="bg-white/90" />
			</div>

			<div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
				<div className="rounded-[2rem] border border-white/60 bg-white/82 p-5">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-xs uppercase tracking-[0.24em] text-slate-500">Missed in this run</p>
							<h3 className="text-2xl font-semibold text-slate-950">Queue these back up</h3>
						</div>
						<span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
							{summary.run.missedCodes.length} queued
						</span>
					</div>

					<div className="mt-4 grid gap-3 sm:grid-cols-2">
						{missedCards.length ? (
							missedCards.map((card) => (
								<div key={card.code} className="rounded-[1.3rem] border border-slate-100 bg-slate-50/80 px-4 py-3">
									<p className="text-sm font-semibold text-slate-900">{card.country}</p>
									<p className="text-xs text-slate-500">{card.capital}</p>
								</div>
							))
						) : (
							<p className="text-sm text-slate-600">No misses this time. Run it back and push for a cleaner streak.</p>
						)}
					</div>

					<div className="mt-5 flex flex-wrap gap-3">
						<button
							type="button"
							onClick={onRunAgain}
							className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
						>
							Run it back
						</button>
						<button
							type="button"
							onClick={onReplayMisses}
							disabled={!summary.run.missedCodes.length}
							className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-50"
						>
							Replay misses
						</button>
						<button
							type="button"
							onClick={onBack}
							className="rounded-full border border-transparent px-5 py-3 text-sm font-semibold text-slate-500 transition hover:text-slate-800"
						>
							Back to lobby
						</button>
					</div>
				</div>

				<div className="rounded-[2rem] border border-slate-950/5 bg-[linear-gradient(165deg,_rgba(10,18,37,0.92),_rgba(34,46,76,0.86))] p-5 text-white">
					<p className="text-xs uppercase tracking-[0.24em] text-white/55">Carryover progress</p>
					<div className="mt-4 grid gap-3 sm:grid-cols-2">
						<StatTile
							label="Total XP"
							value={String(profile.totalXp)}
							className="bg-white/8 text-white"
							valueClassName="text-white"
							labelClassName="text-white/65"
						/>
						<StatTile
							label="All-time best"
							value={String(profile.bestStreak)}
							className="bg-white/8 text-white"
							valueClassName="text-white"
							labelClassName="text-white/65"
						/>
					</div>

					<div className="mt-5 space-y-3">
						<p className="text-sm font-semibold text-white">Newly unlocked this run</p>
						{summary.newBadges.length ? (
							summary.newBadges.map((badge) => (
								<div key={badge.id} className="rounded-[1.3rem] border border-white/10 bg-white/8 px-4 py-3">
									<p className="text-sm font-semibold">{badge.label}</p>
									<p className="text-xs text-white/65">{badge.kicker}</p>
								</div>
							))
						) : (
							<p className="text-sm text-white/70">No new badge this time, but the XP and mastery still landed.</p>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

function MetricPill({
	label,
	value,
	accent,
}: {
	label: string;
	value: string;
	accent?: string;
}) {
	return (
		<div className={`rounded-full border border-white/65 px-4 py-2 ${accent ?? "bg-white/78 text-slate-800"}`}>
			<p className="text-[11px] uppercase tracking-[0.18em] opacity-65">{label}</p>
			<p className="text-base font-semibold">{value}</p>
		</div>
	);
}

function StatTile({
	label,
	value,
	className,
	labelClassName,
	valueClassName,
}: {
	label: string;
	value: string;
	className?: string;
	labelClassName?: string;
	valueClassName?: string;
}) {
	return (
		<div className={`rounded-[1.3rem] border border-white/70 bg-slate-50/85 px-4 py-3 ${className ?? ""}`}>
			<p className={`text-xs uppercase tracking-[0.18em] text-slate-500 ${labelClassName ?? ""}`}>{label}</p>
			<p className={`mt-1 text-2xl font-semibold text-slate-900 ${valueClassName ?? ""}`}>{value}</p>
		</div>
	);
}

function TinyCounter({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-[1.2rem] bg-white/8 px-3 py-3">
			<p className="text-xs uppercase tracking-[0.18em] text-white/55">{label}</p>
			<p className="mt-1 text-2xl font-semibold">{value}</p>
		</div>
	);
}

function dedupeCards(cards: (typeof allCountryCards)[number][]): (typeof allCountryCards)[number][] {
	return Array.from(new Map(cards.map((card) => [card.code, card])).values());
}
