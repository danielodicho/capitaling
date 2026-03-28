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
} from "@/lib/game-engine";
import {
	type PlayerProgress,
	createEmptyProgress,
	getMasteryLabel,
	loadProgress,
	recordAnswerOnProfile,
	recordRunStart,
	saveProgress,
} from "@/lib/game-storage";

const REVEAL_DURATION_MS = 1300;

type SummarySnapshot = {
	run: RunState;
};

export default function GameShell() {
	const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("all");
	const [profile, setProfile] = useState<PlayerProgress>(createEmptyProgress);
	const [hydrated, setHydrated] = useState(false);
	const [run, setRun] = useState<RunState | null>(null);
	const [summary, setSummary] = useState<SummarySnapshot | null>(null);
	const revealTimerRef = useRef<number | null>(null);
	const profileRef = useRef(profile);
	const runRef = useRef<RunState | null>(run);
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

			if (key === "arrowup" || key === "w") {
				event.preventDefault();
				handleAnswerRef.current(prompt.expandedOptions[0]);
				return;
			}

			if (key === "arrowright" || key === "d") {
				event.preventDefault();
				handleAnswerRef.current(prompt.expandedOptions[1]);
				return;
			}

			if (key === "arrowdown" || key === "s") {
				event.preventDefault();
				handleAnswerRef.current(prompt.expandedOptions[2]);
				return;
			}

			if (key === "arrowleft" || key === "a") {
				event.preventDefault();
				handleAnswerRef.current(prompt.expandedOptions[3]);
				return;
			}

			if (["1", "2", "3", "4"].includes(key)) {
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

	function startStandardRun(regionFilter: RegionFilter) {
		clearRevealTimer();
		setSummary(null);
		const nextProfile = recordRunStart(profile);
		const pool = getCardsForRegion(regionFilter);

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
		setProfile(recordRunStart(profile));

		startTransition(() => {
			setRun(
				createRun({
					pool: reviewPool,
					optionPool: allCountryCards,
					regionFilter: "review",
					mode: "review",
					label: "Review",
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

		if (typeof window !== "undefined" && "vibrate" in navigator) {
			navigator.vibrate(resolution.correct ? 12 : 36);
		}

		scheduleAdvance(nextProfile);
	}

	handleAnswerRef.current = handleAnswer;

	function handleAdvance(profileSnapshot = profileRef.current) {
		const currentRun = runRef.current;
		if (!currentRun) {
			return;
		}

		clearRevealTimer();
		const nextRun = advanceAfterReveal(currentRun);

		if (nextRun.phase === "summary") {
			setSummary({ run: nextRun });
			setRun(null);
			return;
		}

		profileRef.current = profileSnapshot;
		setRun(nextRun);
	}

	function handleReturnToLobby() {
		clearRevealTimer();
		setRun(null);
		setSummary(null);
	}

	function scheduleAdvance(nextProfile: PlayerProgress) {
		clearRevealTimer();
		revealTimerRef.current = window.setTimeout(() => {
			handleAdvance(nextProfile);
		}, REVEAL_DURATION_MS);
	}

	function clearRevealTimer() {
		if (revealTimerRef.current) {
			window.clearTimeout(revealTimerRef.current);
			revealTimerRef.current = null;
		}
	}

	return (
		<main className="retro-stage relative min-h-screen overflow-hidden px-4 py-6 text-slate-950 sm:px-6">
			<div className="retro-backdrop pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
				<div className="retro-backdrop__stars" />
				<div className="retro-backdrop__sun" />
				<div className="retro-backdrop__mountains retro-backdrop__mountains--far" />
				<div className="retro-backdrop__mountains retro-backdrop__mountains--near" />
				<div className="retro-backdrop__grid" />
				<div className="retro-backdrop__scanlines" />
			</div>

			<div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col">
				<div className="mb-6 flex items-center justify-between text-sm text-stone-500">
					<p className="display-type text-2xl text-slate-950">Capitaling</p>
					<p>{run ? run.label : "Flags to capitals"}</p>
				</div>

				<div className="flex flex-1 items-center justify-center">
					<AnimatePresence mode="wait">
						{run ? (
							<motion.section
								key="run"
								initial={{ opacity: 0, y: 18 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -18 }}
								transition={{ duration: 0.2, ease: "easeOut" }}
								className="w-full"
							>
								<RunScreen
									bestStreak={profile.bestStreak}
									onAnswer={handleAnswer}
									onAdvance={() => handleAdvance()}
									onExit={handleReturnToLobby}
									run={run}
								/>
							</motion.section>
						) : summary ? (
							<motion.section
								key="summary"
								initial={{ opacity: 0, y: 18 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -18 }}
								transition={{ duration: 0.2, ease: "easeOut" }}
								className="w-full"
							>
								<SummaryScreen
									bestStreak={profile.bestStreak}
									onBack={handleReturnToLobby}
									onReplayMisses={() => startReviewRun(summary.run.missedCodes)}
									onRunAgain={() => startStandardRun(selectedRegion)}
									run={summary.run}
								/>
							</motion.section>
						) : (
							<motion.section
								key="lobby"
								initial={{ opacity: 0, y: 18 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -18 }}
								transition={{ duration: 0.2, ease: "easeOut" }}
								className="w-full"
							>
								<LobbyScreen
									bestStreak={profile.bestStreak}
									cardsCount={selectedCards.length}
									hydrated={hydrated}
									onSelectRegion={setSelectedRegion}
									onStart={() => startStandardRun(selectedRegion)}
									selectedRegion={selectedRegion}
									totalCorrect={profile.totalCorrect}
								/>
							</motion.section>
						)}
					</AnimatePresence>
				</div>
			</div>
		</main>
	);
}

function LobbyScreen({
	bestStreak,
	cardsCount,
	hydrated,
	onSelectRegion,
	onStart,
	selectedRegion,
	totalCorrect,
}: {
	bestStreak: number;
	cardsCount: number;
	hydrated: boolean;
	onSelectRegion: (region: RegionFilter) => void;
	onStart: () => void;
	selectedRegion: RegionFilter;
	totalCorrect: number;
}) {
	return (
		<div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-stone-200 bg-white px-5 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-8">
			<div className="space-y-4 text-center">
				<p className="text-xs uppercase tracking-[0.26em] text-stone-500">Minimal mode</p>
				<h1 className="display-type text-5xl font-semibold leading-none sm:text-6xl">One flag. One choice.</h1>
				<p className="mx-auto max-w-xl text-base leading-7 text-stone-600 sm:text-lg">
					Swipe left for the left answer. Swipe right for the right answer. Keep the streak alive.
				</p>
			</div>

			<div className="mt-8 flex flex-wrap justify-center gap-2">
				{regionFilterOptions.map((option) => {
					const active = option.value === selectedRegion;
					return (
						<button
							key={option.value}
							type="button"
							onClick={() => onSelectRegion(option.value)}
							className={`rounded-full px-4 py-2 text-sm font-medium transition ${
								active ? "bg-slate-950 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
							}`}
						>
							{option.label}
						</button>
					);
				})}
			</div>

			<button
				type="button"
				onClick={onStart}
				disabled={!hydrated}
				className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-4 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{hydrated ? `Start ${getRegionLabel(selectedRegion)}` : "Loading..."}
			</button>

			<p className="mt-4 text-center text-sm text-stone-500">
				{cardsCount} flags in this set • best streak {bestStreak} • {totalCorrect} correct so far
			</p>
		</div>
	);
}

function RunScreen({
	bestStreak,
	onAnswer,
	onAdvance,
	onExit,
	run,
}: {
	bestStreak: number;
	onAnswer: (choice: string) => void;
	onAdvance: () => void;
	onExit: () => void;
	run: RunState;
}) {
	const prompt = run.currentPrompt;

	if (!prompt) {
		return null;
	}

	const options = prompt.expandedOptions;

	return (
		<div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
			<div className="flex items-center justify-between">
				<button
					type="button"
					onClick={onExit}
					className="rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:bg-stone-100"
				>
					Exit
				</button>

				<div className="flex items-center gap-3 text-sm text-stone-600">
					<MiniStat label="Region" value={prompt.card.region} />
					<MiniStat label="Streak" value={run.streak} />
					<MiniStat label="Best" value={bestStreak} />
					<LivesRow lives={run.lives} />
				</div>
			</div>

			<FlagCard prompt={prompt} run={run} onAnswer={onAnswer} />

			<AnimatePresence mode="wait">
				{run.phase === "reveal" && run.reveal ? (
					<motion.button
						key="reveal"
						type="button"
						onClick={onAdvance}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.18, ease: "easeOut" }}
						className={`rounded-[1.6rem] border px-5 py-4 text-left ${
							run.reveal.correct
								? "border-emerald-200 bg-emerald-50 text-emerald-950"
								: "border-rose-200 bg-rose-50 text-rose-950"
						}`}
					>
						<p className="text-xs uppercase tracking-[0.22em] opacity-70">{run.reveal.correct ? "Correct" : "Wrong"}</p>
						<p className="mt-2 text-2xl font-semibold">
							{prompt.card.country} • {run.reveal.correctCapital}
						</p>
						<p className="mt-1 text-sm opacity-75">Tap anywhere to continue.</p>
					</motion.button>
				) : null}
			</AnimatePresence>

			<div className="grid gap-3 sm:grid-cols-2">
				{options.map((option, index) => (
					<button
						key={option}
						type="button"
						onClick={() => onAnswer(option)}
						disabled={run.phase !== "active"}
						className={`rounded-[1.5rem] border px-5 py-5 text-left transition ${
							run.phase !== "active"
								? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400"
								: "border-stone-200 bg-white text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 hover:border-stone-300"
						}`}
					>
						<p className="text-xs uppercase tracking-[0.22em] text-stone-400">{DIRECTION_LABELS[index]}</p>
						<p className="mt-2 text-2xl font-semibold">{option}</p>
					</button>
				))}
			</div>

			<div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-stone-500">
				<p>{prompt.card.subregion}</p>
				<p>Swipe up / right / down / left</p>
			</div>
		</div>
	);
}

function FlagCard({
	prompt,
	run,
	onAnswer,
}: {
	prompt: PromptState;
	run: RunState;
	onAnswer: (choice: string) => void;
}) {
	const x = useMotionValue(0);
	const rotate = useTransform(x, [-160, 0, 160], [-9, 0, 9]);
	const shadow = useTransform(
		x,
		[-140, 0, 140],
		[
			"0 18px 44px rgba(14, 165, 233, 0.18)",
			"0 28px 60px rgba(15, 23, 42, 0.10)",
			"0 18px 44px rgba(244, 63, 94, 0.18)",
		],
	);

	return (
		<div className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
			<motion.div
				drag={run.phase === "active" ? true : false}
				dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
				onDragEnd={(_, info) => {
					if (run.phase !== "active") {
						x.set(0);
						return;
					}

					const horizontal = Math.abs(info.offset.x);
					const vertical = Math.abs(info.offset.y);

					if (horizontal < 90 && vertical < 90) {
						x.set(0);
						return;
					}

					if (vertical > horizontal && info.offset.y < -90) {
						onAnswer(prompt.expandedOptions[0]);
						return;
					}

					if (horizontal >= vertical && info.offset.x > 90) {
						onAnswer(prompt.expandedOptions[1]);
						return;
					}

					if (vertical > horizontal && info.offset.y > 90) {
						onAnswer(prompt.expandedOptions[2]);
						return;
					}

					if (horizontal >= vertical && info.offset.x < -90) {
						onAnswer(prompt.expandedOptions[3]);
						return;
					}

					x.set(0);
				}}
				style={{ x, rotate, boxShadow: shadow }}
				className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-stone-100"
			>
				<Image
					src={prompt.card.flagPath}
					alt={`Flag of ${prompt.card.country}`}
					fill
					priority
					sizes="(max-width: 1024px) 90vw, 720px"
					className="object-cover"
				/>

				<div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
					<span className="rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700">
						{prompt.card.region}
					</span>
					{prompt.source === "review" ? (
						<span className="rounded-full bg-slate-950/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
							Review
						</span>
					) : null}
				</div>

				<div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
					<span className="rounded-full bg-slate-950/72 px-3 py-2">Left</span>
					<span className="rounded-full bg-slate-950/72 px-3 py-2">Right</span>
				</div>
			</motion.div>
		</div>
	);
}

function SummaryScreen({
	bestStreak,
	onBack,
	onReplayMisses,
	onRunAgain,
	run,
}: {
	bestStreak: number;
	onBack: () => void;
	onReplayMisses: () => void;
	onRunAgain: () => void;
	run: RunState;
}) {
	const isPersonalBest = run.bestStreak > 0 && run.bestStreak >= bestStreak;

	return (
		<div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-stone-200 bg-white px-5 py-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-8">
			<p className="text-xs uppercase tracking-[0.26em] text-stone-500">Run over</p>
			<h2 className="display-type mt-4 text-6xl font-semibold leading-none sm:text-7xl">{run.bestStreak}</h2>
			<p className="mt-3 text-lg text-stone-700">streak</p>

			<div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-stone-500">
				<span>{run.correctCount} correct</span>
				<span>•</span>
				<span>{run.missedCodes.length} misses</span>
				<span>•</span>
				<span>{isPersonalBest ? "new best" : `all-time best ${bestStreak}`}</span>
			</div>

			<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
				<button
					type="button"
					onClick={onRunAgain}
					className="rounded-full bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
				>
					Play again
				</button>
				<button
					type="button"
					onClick={onReplayMisses}
					disabled={!run.missedCodes.length}
					className="rounded-full bg-stone-100 px-5 py-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-45"
				>
					Replay misses
				</button>
				<button
					type="button"
					onClick={onBack}
					className="rounded-full px-5 py-4 text-sm font-semibold text-stone-500 transition hover:text-slate-950"
				>
					Back
				</button>
			</div>
		</div>
	);
}

const DIRECTION_LABELS = ["Up", "Right", "Down", "Left"] as const;

function MiniStat({ label, value }: { label: string; value: number | string }) {
	return (
		<div className="rounded-full bg-white px-4 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
			<p className="text-[11px] uppercase tracking-[0.18em] text-stone-400">{label}</p>
			<p className="text-sm font-semibold text-slate-950">{value}</p>
		</div>
	);
}

function LivesRow({ lives }: { lives: number }) {
	return (
		<div className="flex items-center gap-2 rounded-full bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
			{[0, 1, 2].map((index) => (
				<span key={index} className={`h-2.5 w-2.5 rounded-full ${index < lives ? "bg-slate-950" : "bg-stone-200"}`} />
			))}
		</div>
	);
}

function dedupeCards(cards: (typeof allCountryCards)[number][]): (typeof allCountryCards)[number][] {
	return Array.from(new Map(cards.map((card) => [card.code, card])).values());
}
