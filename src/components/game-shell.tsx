"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import type { MobileFeedSlide } from "@/components/mobile-game-feed";
import {
	type CountryBackdropTheme,
	createRegionBackdropTheme,
	createSeedCountryBackdropTheme,
	resolveCountryBackdropTheme,
} from "@/lib/country-theme";
import {
	type CountryCard,
	type RegionFilter,
	allCountryCards,
	countryCardsByCode,
	getCardsForRegion,
	getRegionLabel,
	regionFilterOptions,
} from "@/lib/game-data";
import {
	LIVES_PER_RUN,
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
import { type GlobeLocation, getRegionFocusLocation, getRegionHighlightShapeIds } from "@/lib/globe-data";

const MobileGameFeed = dynamic(() => import("@/components/mobile-game-feed"), {
	ssr: false,
	loading: () => null,
});
const CountryGlobe = dynamic(() => import("@/components/country-globe"), {
	ssr: false,
	loading: () => <GlobePlaceholder />,
});
const CountryRevealPanel = dynamic(() => import("./country-reveal-panel"), {
	ssr: false,
	loading: () => null,
});

const TIMED_MODE_SECONDS = 60;
const HEART_PATH =
	"M12 21.35 10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.53z";
const HEART_CRACK_PATH = "M12.6 6.8 10.7 10.2 12.8 11.6 10.9 15 13.3 16.3 12 19.1";
const HEART_BREAK_EASE = [0.22, 1, 0.36, 1] as const;
const LIFE_SLOT_KEYS = ["life-1", "life-2", "life-3"] as const;

type SessionMode = "classic" | "timed";

type SummarySnapshot = {
	run: RunState;
	sessionMode: SessionMode;
	timedOut: boolean;
};

type BackdropStyle = CSSProperties & Record<`--${string}`, number | string>;
type LegacyMediaQueryList = MediaQueryList & {
	addListener: (listener: (event: MediaQueryListEvent) => void) => void;
	removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
};

function GlobePlaceholder({ className }: { className?: string }) {
	return <div className={`rounded-[2rem] bg-white/6 ${className ?? "h-[22rem] w-full"}`.trim()} aria-hidden="true" />;
}

export default function GameShell() {
	const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("all");
	const [selectedMode, setSelectedMode] = useState<SessionMode>("classic");
	const [profile, setProfile] = useState<PlayerProgress>(createEmptyProgress);
	const [hydrated, setHydrated] = useState(false);
	const [isMobileViewport, setIsMobileViewport] = useState<boolean | null>(null);
	const [activeMode, setActiveMode] = useState<SessionMode>("classic");
	const [mobileSlides, setMobileSlides] = useState<MobileFeedSlide[]>([]);
	const [mobileFeedStartToken, setMobileFeedStartToken] = useState(0);
	const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
	const [run, setRun] = useState<RunState | null>(null);
	const [summary, setSummary] = useState<SummarySnapshot | null>(null);
	const [featuredBackdropCard, setFeaturedBackdropCard] = useState<CountryCard | null>(null);
	const [backdropTheme, setBackdropTheme] = useState(() => createRegionBackdropTheme("all"));
	const mobileSlideSequenceRef = useRef(0);
	const profileRef = useRef(profile);
	const runRef = useRef<RunState | null>(run);
	const handleAnswerRef = useRef<(choice: string) => void>(() => {});

	useEffect(() => {
		const mediaQuery = window.matchMedia("(max-width: 767px)");
		const syncViewport = () => setIsMobileViewport(mediaQuery.matches);

		syncViewport();
		if ("addEventListener" in mediaQuery) {
			mediaQuery.addEventListener("change", syncViewport);

			return () => mediaQuery.removeEventListener("change", syncViewport);
		}

		const legacyMediaQuery = mediaQuery as LegacyMediaQueryList;
		legacyMediaQuery.addListener(syncViewport);
		return () => legacyMediaQuery.removeListener(syncViewport);
	}, []);

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
		if (run?.currentPrompt?.card) {
			setFeaturedBackdropCard(run.currentPrompt.card);
			return;
		}

		if (!summary) {
			setFeaturedBackdropCard(null);
		}
	}, [run?.currentPrompt?.card, summary]);

	useEffect(() => {
		let cancelled = false;

		if (!featuredBackdropCard) {
			setBackdropTheme(createRegionBackdropTheme(selectedRegion));
			return;
		}

		setBackdropTheme(createSeedCountryBackdropTheme(featuredBackdropCard));

		void resolveCountryBackdropTheme(featuredBackdropCard).then((theme) => {
			if (!cancelled) {
				setBackdropTheme(theme);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [featuredBackdropCard, selectedRegion]);

	useEffect(() => {
		if (!run || activeMode !== "timed" || timeRemaining === null) {
			return;
		}

		if (timeRemaining <= 0) {
			const timedOutRun: RunState = {
				...run,
				phase: "summary",
				currentPrompt: null,
			};
			setSummary({
				run: timedOutRun,
				sessionMode: activeMode,
				timedOut: true,
			});
			setRun(null);
			setTimeRemaining(null);
			return;
		}

		const timer = window.setTimeout(() => {
			setTimeRemaining((current) => (current === null ? null : current - 1));
		}, 1000);

		return () => window.clearTimeout(timer);
	}, [activeMode, run, timeRemaining]);

	useEffect(() => {
		if (run?.phase !== "active" || !run.currentPrompt) {
			return;
		}

		if (window.matchMedia("(max-width: 767px)").matches) {
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
	const lobbyGlobeFocus = useMemo(() => getRegionFocusLocation(selectedRegion), [selectedRegion]);
	const lobbyGlobeHighlights = useMemo(() => getRegionHighlightShapeIds(selectedRegion), [selectedRegion]);
	const backdropStyle = useMemo<BackdropStyle>(
		() => ({
			"--retro-flag-image": backdropTheme.flagPath ? `url("${backdropTheme.flagPath}")` : "none",
			"--retro-flag-opacity": backdropTheme.flagOpacity,
			"--retro-glow-primary": backdropTheme.glowPrimary,
			"--retro-glow-secondary": backdropTheme.glowSecondary,
			"--retro-grid-color": backdropTheme.grid,
			"--retro-mountain-far": backdropTheme.mountainFar,
			"--retro-mountain-near": backdropTheme.mountainNear,
			"--retro-sky-bottom": backdropTheme.skyBottom,
			"--retro-sky-mid": backdropTheme.skyMid,
			"--retro-sky-top": backdropTheme.skyTop,
			"--retro-star-color": backdropTheme.star,
			"--retro-star-soft": backdropTheme.starSoft,
			"--retro-sun-bottom": backdropTheme.sunBottom,
			"--retro-sun-mid": backdropTheme.sunMid,
			"--retro-sun-top": backdropTheme.sunTop,
		}),
		[backdropTheme],
	);

	function createMobileSlide(prompt: PromptState): MobileFeedSlide {
		mobileSlideSequenceRef.current += 1;

		return {
			id: `${prompt.card.code}-${mobileSlideSequenceRef.current}`,
			prompt,
			reveal: null,
			selectedChoice: null,
			submitted: false,
		};
	}

	function initializeMobileFeed(nextRun: RunState) {
		if (!nextRun.currentPrompt) {
			setMobileSlides([]);
			return;
		}

		setMobileSlides([createMobileSlide(nextRun.currentPrompt)]);
		setMobileFeedStartToken((current) => current + 1);
	}

	function triggerFeedback(correct: boolean) {
		if (typeof window === "undefined" || !("vibrate" in navigator)) {
			return;
		}

		navigator.vibrate(correct ? 12 : 36);
	}

	function startStandardRun(regionFilter: RegionFilter, sessionMode: SessionMode) {
		setSummary(null);
		const nextProfile = recordRunStart(profile);
		const pool = getCardsForRegion(regionFilter);
		const nextRun = createRun({
			pool,
			optionPool: pool.length >= 4 ? pool : allCountryCards,
			regionFilter,
			label: getRegionLabel(regionFilter),
		});

		setProfile(nextProfile);
		profileRef.current = nextProfile;
		setActiveMode(sessionMode);
		setTimeRemaining(sessionMode === "timed" ? TIMED_MODE_SECONDS : null);
		setRun(nextRun);

		if (sessionMode === "classic") {
			initializeMobileFeed(nextRun);
			return;
		}

		setMobileSlides([]);
	}

	function startReviewRun(codes: string[]) {
		const reviewPool = dedupeCards(
			codes.map((code) => countryCardsByCode[code]).filter((card): card is NonNullable<typeof card> => Boolean(card)),
		);

		if (!reviewPool.length) {
			return;
		}

		setSummary(null);
		const nextProfile = recordRunStart(profile);
		const nextRun = createRun({
			pool: reviewPool,
			optionPool: allCountryCards,
			regionFilter: "review",
			mode: "review",
			label: "Review",
		});

		setProfile(nextProfile);
		profileRef.current = nextProfile;
		setActiveMode("classic");
		setTimeRemaining(null);
		setRun(nextRun);
		initializeMobileFeed(nextRun);
	}

	function handleDesktopAnswer(choice: string) {
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
		profileRef.current = nextProfile;

		triggerFeedback(resolution.correct);

		if (activeMode === "timed") {
			const advancedRun = advanceAfterReveal(nextRun);

			if (advancedRun.phase === "summary") {
				setSummary({
					run: advancedRun,
					sessionMode: activeMode,
					timedOut: false,
				});
				setRun(null);
				setTimeRemaining(null);
				return;
			}

			profileRef.current = nextProfile;
			setRun(advancedRun);
			return;
		}

		setRun(nextRun);
	}

	function handleMobileAnswerTap(choice: string) {
		if (!run || run.phase !== "active" || !run.currentPrompt) {
			return;
		}

		const currentSlide = getLastItem(mobileSlides);
		if (!currentSlide || currentSlide.submitted) {
			return;
		}

		if (currentSlide.selectedChoice !== choice) {
			setMobileSlides((slides) => {
				const latestSlide = getLastItem(slides);
				if (!latestSlide) {
					return slides;
				}

				return [...slides.slice(0, -1), { ...latestSlide, selectedChoice: choice }];
			});
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
		const revealedRun = applyAnswerResolution(run, resolution, masteryTier);
		const advancedRun = advanceAfterReveal(revealedRun);

		setProfile(nextProfile);
		profileRef.current = nextProfile;
		triggerFeedback(resolution.correct);

		setMobileSlides((slides) => {
			const latestSlide = getLastItem(slides);
			if (!latestSlide) {
				return slides;
			}

			const completedSlide: MobileFeedSlide = {
				...latestSlide,
				reveal: revealedRun.reveal,
				selectedChoice: choice,
				submitted: true,
			};
			const nextSlides = [...slides.slice(0, -1), completedSlide];

			if (advancedRun.phase !== "summary" && advancedRun.currentPrompt) {
				nextSlides.push(createMobileSlide(advancedRun.currentPrompt));
			}

			return nextSlides;
		});

		if (advancedRun.phase === "summary") {
			setSummary({
				run: advancedRun,
				sessionMode: "classic",
				timedOut: false,
			});
			setRun(null);
			setTimeRemaining(null);
			return;
		}

		setRun(advancedRun);
	}

	handleAnswerRef.current = handleDesktopAnswer;

	function handleAdvance(profileSnapshot = profileRef.current) {
		const currentRun = runRef.current;
		if (!currentRun) {
			return;
		}

		const nextRun = advanceAfterReveal(currentRun);

		if (nextRun.phase === "summary") {
			setSummary({
				run: nextRun,
				sessionMode: activeMode,
				timedOut: false,
			});
			setRun(null);
			setTimeRemaining(null);
			return;
		}

		profileRef.current = profileSnapshot;
		setRun(nextRun);
	}

	function handleReturnToLobby() {
		setMobileSlides([]);
		setRun(null);
		setSummary(null);
		setTimeRemaining(null);
	}

	if (isMobileViewport !== false) {
		return (
			<main className="retro-stage relative min-h-[100dvh] text-white" style={backdropStyle}>
				<BackdropScene />
				<MobileGameFeed
					backdropTheme={backdropTheme}
					bestStreak={profile.bestStreak}
					feedStartToken={mobileFeedStartToken}
					globeFocusLocation={lobbyGlobeFocus}
					globeHighlightShapeIds={lobbyGlobeHighlights}
					hydrated={hydrated}
					mobileSlides={mobileSlides}
					onAnswerTap={handleMobileAnswerTap}
					onBackToLobby={handleReturnToLobby}
					onReplayMisses={() => {
						if (summary) {
							startReviewRun(summary.run.missedCodes);
						}
					}}
					onRunAgain={() => startStandardRun(selectedRegion, "classic")}
					onSelectRegion={setSelectedRegion}
					onStart={() => startStandardRun(selectedRegion, "classic")}
					run={run}
					selectedRegion={selectedRegion}
					summary={summary}
				/>
			</main>
		);
	}

	return (
		<main
			className="retro-stage relative h-[100dvh] overflow-hidden px-4 py-5 text-white md:px-6 md:py-6"
			style={backdropStyle}
		>
			<BackdropScene />

			<div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col">
				<div className="mb-4 flex items-center justify-between text-sm text-white/74 sm:mb-5">
					<p className="display-type text-2xl text-white">Capitaling</p>
					<p>{run ? run.label : "Flags to capitals"}</p>
				</div>

				<div className={`flex flex-1 justify-center ${run ? "items-start pt-1" : "items-center"}`}>
					<AnimatePresence mode="wait">
						{run ? (
							<motion.section
								key="run"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								transition={{ duration: 0.17, ease: [0.22, 1, 0.36, 1] }}
								className="w-full"
							>
								<RunScreen
									activeMode={activeMode}
									backdropTheme={backdropTheme}
									onAnswer={handleDesktopAnswer}
									onAdvance={() => handleAdvance()}
									onExit={handleReturnToLobby}
									run={run}
									timeRemaining={timeRemaining}
								/>
							</motion.section>
						) : summary ? (
							<motion.section
								key="summary"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								transition={{ duration: 0.17, ease: [0.22, 1, 0.36, 1] }}
								className="w-full"
							>
								<SummaryScreen
									bestStreak={profile.bestStreak}
									onBack={handleReturnToLobby}
									onReplayMisses={() => startReviewRun(summary.run.missedCodes)}
									onRunAgain={() => startStandardRun(selectedRegion, summary.sessionMode)}
									run={summary.run}
									sessionMode={summary.sessionMode}
									timedOut={summary.timedOut}
								/>
							</motion.section>
						) : (
							<motion.section
								key="lobby"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -12 }}
								transition={{ duration: 0.17, ease: [0.22, 1, 0.36, 1] }}
								className="w-full"
							>
								<LobbyScreen
									backdropTheme={backdropTheme}
									cardsCount={selectedCards.length}
									globeFocusLocation={lobbyGlobeFocus}
									globeHighlightShapeIds={lobbyGlobeHighlights}
									hydrated={hydrated}
									onSelectMode={setSelectedMode}
									onSelectRegion={setSelectedRegion}
									onStart={() => startStandardRun(selectedRegion, selectedMode)}
									selectedMode={selectedMode}
									selectedRegion={selectedRegion}
								/>
							</motion.section>
						)}
					</AnimatePresence>
				</div>
			</div>
		</main>
	);
}

function BackdropScene() {
	return (
		<div className="retro-backdrop pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
			<div className="retro-backdrop__aura" />
			<div className="retro-backdrop__stars" />
			<div className="retro-backdrop__sun" />
			<div className="retro-backdrop__mountains retro-backdrop__mountains--far" />
			<div className="retro-backdrop__mountains retro-backdrop__mountains--near" />
			<div className="retro-backdrop__grid" />
			<div className="retro-backdrop__scanlines" />
		</div>
	);
}

function LobbyScreen({
	backdropTheme,
	cardsCount,
	globeFocusLocation,
	globeHighlightShapeIds,
	hydrated,
	onSelectMode,
	onSelectRegion,
	onStart,
	selectedMode,
	selectedRegion,
}: {
	backdropTheme: CountryBackdropTheme;
	cardsCount: number;
	globeFocusLocation: GlobeLocation | null;
	globeHighlightShapeIds: string[];
	hydrated: boolean;
	onSelectMode: (mode: SessionMode) => void;
	onSelectRegion: (region: RegionFilter) => void;
	onStart: () => void;
	selectedMode: SessionMode;
	selectedRegion: RegionFilter;
}) {
	const selectedModeConfig = SESSION_MODES.find((mode) => mode.value === selectedMode) ?? SESSION_MODES[0];
	const regionLabel = getRegionLabel(selectedRegion);
	const regionDescription =
		selectedRegion === "all" ? "The whole atlas is ready." : `${cardsCount} countries in ${regionLabel}.`;

	return (
		<section className="mx-auto w-full max-w-6xl">
			<div className="grid gap-5 lg:grid-cols-[22.5rem_minmax(0,1fr)] xl:grid-cols-[23.5rem_minmax(0,1fr)] xl:gap-7">
				<div className="ui-panel-light relative overflow-hidden rounded-[2.2rem] px-5 py-6 sm:px-7 sm:py-7">
					<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(251,113,133,0.18),transparent_24%),radial-gradient(circle_at_100%_0%,rgba(251,146,60,0.16),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.36),rgba(255,255,255,0.04))]" />
					<div className="relative z-10 flex h-full flex-col">
						<p className="ui-kicker-light">Pick mode → Pick region → Start</p>
						<h1 className="display-type mt-3 text-4xl font-semibold leading-[0.94] text-slate-950 sm:text-[3.3rem]">
							Choose your route.
						</h1>
						<p className="mt-4 max-w-sm text-base leading-7 text-[var(--ui-text-dark-muted)]">
							Set the pace, narrow the map, and launch straight into a clean flag-to-capital run.
						</p>

						<div className="mt-8 space-y-7">
							<div>
								<div className="flex items-center gap-3">
									<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[11px] font-semibold tracking-[0.16em] text-white">
										01
									</span>
									<p className="ui-kicker-light">Pick mode</p>
								</div>
								<div className="mt-3 grid gap-3">
									{SESSION_MODES.map((mode) => {
										const active = mode.value === selectedMode;
										return (
											<button
												key={mode.value}
												type="button"
												onClick={() => onSelectMode(mode.value)}
												className={`rounded-[1.35rem] border px-4 py-4 text-left transition ${
													active
														? "border-[#f2b8a1] bg-[rgba(255,241,234,0.95)] text-slate-950 shadow-[0_0_0_1px_rgba(242,140,107,0.16)]"
														: "border-[#e6d8cc] bg-white/70 text-slate-800 hover:border-[#f2b8a1] hover:bg-white"
												}`}
											>
												<div className="flex items-start justify-between gap-3">
													<div>
														<p className="text-xs uppercase tracking-[0.16em] opacity-60">{mode.label}</p>
														<p className="mt-1 text-lg font-semibold">{mode.shortLabel}</p>
														<p className="mt-1 text-sm leading-6 text-slate-600/84">{mode.description}</p>
													</div>
													<span
														className={`h-3 w-3 rounded-full border ${
															active ? "border-[#f28c6b] bg-[#f28c6b]" : "border-slate-300 bg-transparent"
														}`}
													/>
												</div>
											</button>
										);
									})}
								</div>
							</div>

							<div>
								<div className="flex items-center gap-3">
									<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[11px] font-semibold tracking-[0.16em] text-white">
										02
									</span>
									<p className="ui-kicker-light">Pick region</p>
								</div>
								<div className="mt-3 flex flex-wrap gap-2">
									{regionFilterOptions.map((option) => {
										const active = option.value === selectedRegion;
										return (
											<button
												key={option.value}
												type="button"
												onClick={() => onSelectRegion(option.value)}
												className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
													active
														? "border-[#f2b8a1] bg-[rgba(255,241,234,0.95)] text-slate-950 shadow-[0_0_0_1px_rgba(242,140,107,0.16)]"
														: "border-[#e6d8cc] bg-white/72 text-slate-800 hover:border-[#f2b8a1] hover:bg-white"
												}`}
											>
												{option.label}
											</button>
										);
									})}
								</div>
							</div>

							<div>
								<div className="flex items-center gap-3">
									<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-[11px] font-semibold tracking-[0.16em] text-white">
										03
									</span>
									<p className="ui-kicker-light">Start</p>
								</div>
								<p className="mt-3 text-sm leading-6 text-[var(--ui-text-dark-muted)]">
									{selectedModeConfig.shortLabel} · {regionDescription}
								</p>
								<button
									type="button"
									onClick={onStart}
									disabled={!hydrated}
									className="ui-cta mt-4 inline-flex w-full items-center justify-center rounded-full px-5 py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-55"
								>
									{hydrated ? `Start ${regionLabel}` : "Loading..."}
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="ui-panel-dark relative overflow-hidden rounded-[2.7rem] p-5 sm:p-7">
					<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.06),transparent_22%),radial-gradient(circle_at_82%_14%,rgba(242,140,107,0.06),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />
					<div className="relative z-10 flex h-full min-h-[34rem] flex-col">
						<div className="flex flex-wrap items-start justify-between gap-4">
							<div>
								<p className="ui-kicker-dark">Atlas preview</p>
								<h2 className="mt-2 text-2xl font-semibold text-white sm:text-[2.3rem]">{regionLabel}</h2>
								<p className="mt-2 max-w-xs text-sm leading-6 text-[var(--ui-text-light-muted)]">
									{selectedRegion === "all"
										? "A quiet survey of the full deck before the run begins."
										: `Previewing ${regionLabel} before you start.`}
								</p>
							</div>
							<div className="ui-chip ui-chip--dark rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
								{selectedRegion === "all" ? "195 countries" : `${cardsCount} countries`}
							</div>
						</div>

						<div className="flex flex-1 items-center justify-center pt-4">
							<CountryGlobe
								className="mx-auto w-full max-w-[28rem] sm:max-w-[30rem] xl:max-w-[32rem]"
								focusLocation={globeFocusLocation}
								highlightShapeIds={globeHighlightShapeIds}
								idleSpin={selectedRegion === "all"}
								markerLocation={null}
								showMarker={false}
								theme={backdropTheme}
								variant="hero"
							/>
						</div>

						<div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-sm text-slate-100/88">
							<p>Survey window</p>
							<p className="text-right text-slate-200/72">The globe takes over on reveal, not during setup.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function RunScreen({
	activeMode,
	backdropTheme,
	onAnswer,
	onAdvance,
	onExit,
	run,
	timeRemaining,
}: {
	activeMode: SessionMode;
	backdropTheme: CountryBackdropTheme;
	onAnswer: (choice: string) => void;
	onAdvance: () => void;
	onExit: () => void;
	run: RunState;
	timeRemaining: number | null;
}) {
	const prompt = run.currentPrompt;

	if (!prompt) {
		return null;
	}

	const options = prompt.expandedOptions;
	const isClassicReveal = activeMode === "classic" && run.phase === "reveal" && Boolean(run.reveal);

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-3">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<button
					type="button"
					onClick={onExit}
					className="ui-chip ui-chip--light px-4 py-2 text-sm font-medium text-[var(--ui-text-dark)]"
				>
					Exit
				</button>

				<div className="flex items-center gap-2.5 text-sm">
					<RunMetric label="Streak" value={run.streak} />
					{activeMode === "timed" && timeRemaining !== null ? (
						<RunMetric label="Time" value={`${timeRemaining}s`} />
					) : null}
					<LivesRow lives={run.lives} />
				</div>
			</div>

			<div className="space-y-3">
				<div className="ui-panel-dark mx-auto flex w-full max-w-[42rem] flex-wrap items-end justify-between gap-3 rounded-[1.5rem] px-4 py-3 sm:px-5">
					<div className="max-w-[28rem]">
						<p className="ui-kicker-dark text-white/84">
							{prompt.card.region} · {activeMode}
						</p>
						<h1 className="mt-1 text-[1.22rem] font-semibold leading-tight text-white sm:text-[1.45rem]">
							Which capital matches this flag?
						</h1>
						<p className="mt-1 text-sm leading-6 text-[var(--ui-text-light-muted)]">
							Tap the answer or flick the flag toward the matching direction.
						</p>
					</div>
					<div className="ui-chip ui-chip--dark px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
						{prompt.card.subregion}
					</div>
				</div>

				<div className="relative mx-auto w-full max-w-[42rem]">
					<FlagCard backdropTheme={backdropTheme} prompt={prompt} run={run} onAnswer={onAnswer} />

					<AnimatePresence mode="wait">
						{isClassicReveal && run.reveal ? (
							<div className="absolute inset-x-3 bottom-3 z-20 sm:inset-x-auto sm:left-4 sm:right-4">
								<CountryRevealPanel
									key={`reveal-${prompt.card.code}`}
									card={prompt.card}
									onAdvance={onAdvance}
									reveal={run.reveal}
									theme={backdropTheme}
								/>
							</div>
						) : null}
					</AnimatePresence>
				</div>

				<div className="mx-auto grid w-full max-w-[42rem] gap-3 sm:grid-cols-2">
					{options.map((option, index) => (
						<button
							key={option}
							type="button"
							onClick={() => onAnswer(option)}
							disabled={run.phase !== "active"}
							className={`ui-answer-tile group min-h-[6.25rem] rounded-[1.45rem] border px-4 py-3 text-left ${resolveRunOptionStateClass(
								option,
								run,
							)} ${run.phase !== "active" ? "cursor-default" : "hover:-translate-y-0.5"}`}
						>
							<div className="flex items-center gap-3">
								<span
									className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-current/8 text-xl leading-none text-current transition-transform duration-150 ${DIRECTION_META[index].hoverClass}`}
								>
									{DIRECTION_META[index].arrow}
								</span>
								<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-current/72">
									{DIRECTION_META[index].label}
								</p>
							</div>
							<p className="mt-3 text-[1.55rem] font-semibold leading-tight sm:text-[1.72rem]">{option}</p>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

function FlagCard({
	backdropTheme,
	prompt,
	run,
	onAnswer,
}: {
	backdropTheme: CountryBackdropTheme;
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
	const flagStageStyle = useMemo<BackdropStyle>(
		() => ({
			"--flag-stage-glow-primary": backdropTheme.glowPrimary,
			"--flag-stage-glow-secondary": backdropTheme.glowSecondary,
			"--flag-stage-image": `url("${prompt.card.flagPath}")`,
		}),
		[backdropTheme.glowPrimary, backdropTheme.glowSecondary, prompt.card.flagPath],
	);

	return (
		<div className="flag-stage" style={flagStageStyle}>
			<div aria-hidden="true" className="flag-stage__aura" />
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
				role="img"
				aria-label={`Flag of ${prompt.card.country}`}
				style={{ backgroundImage: `url("${prompt.card.flagPath}")`, x, rotate, boxShadow: shadow }}
				className="flag-stage__drag relative aspect-[16/9] bg-contain bg-center bg-no-repeat"
			>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.18),transparent_18%,transparent_74%,rgba(255,255,255,0.08))] opacity-70 mix-blend-screen"
				/>
				{prompt.source === "review" ? (
					<div className="absolute inset-x-0 top-0 flex justify-end p-3">
						<span className="rounded-full bg-slate-950/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_20px_rgba(15,23,42,0.24)]">
							Review
						</span>
					</div>
				) : null}
			</motion.div>
		</div>
	);
}

function RunGlobeStage({
	prompt,
	theme,
}: {
	prompt: PromptState;
	theme: CountryBackdropTheme;
}) {
	const focusLocation = prompt.card.location;
	const highlightShapeIds = prompt.card.countryShapeId ? [prompt.card.countryShapeId] : [];
	const markerLocation = prompt.card.location;

	return (
		<div className="flex h-full items-start justify-center pt-2">
			<motion.div
				key={`globe-${prompt.card.code}-reveal`}
				initial={{ opacity: 0, scale: 0.95, y: 12 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: -12 }}
				transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
				className="ui-panel-dark w-full rounded-[1.7rem] p-3"
			>
				<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ui-text-light-soft)]">
					Country lock
				</p>
				<p className="mt-1.5 text-lg font-semibold text-white">{prompt.card.country}</p>
				<p className="mt-1 text-xs leading-5 text-[var(--ui-text-light-muted)]">{prompt.card.capital}</p>

				<CountryGlobe
					className="mx-auto mt-3 max-w-[13rem]"
					focusLocation={focusLocation}
					highlightShapeIds={highlightShapeIds}
					idleSpin={false}
					markerLocation={markerLocation}
					showMarker={Boolean(markerLocation)}
					theme={theme}
					variant="hero"
				/>
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
	sessionMode,
	timedOut,
}: {
	bestStreak: number;
	onBack: () => void;
	onReplayMisses: () => void;
	onRunAgain: () => void;
	run: RunState;
	sessionMode: SessionMode;
	timedOut: boolean;
}) {
	const isPersonalBest = run.bestStreak > 0 && run.bestStreak >= bestStreak;

	return (
		<div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-stone-200 bg-white px-5 py-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:px-8">
			<p className="text-xs uppercase tracking-[0.26em] text-stone-500">
				{timedOut ? "Time's up" : `${sessionMode} mode`}
			</p>
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

const DIRECTION_META = [
	{ arrow: "↑", hoverClass: "group-hover:-translate-y-0.5", label: "Up" },
	{ arrow: "→", hoverClass: "group-hover:translate-x-0.5", label: "Right" },
	{ arrow: "↓", hoverClass: "group-hover:translate-y-0.5", label: "Down" },
	{ arrow: "←", hoverClass: "group-hover:-translate-x-0.5", label: "Left" },
] as const;
const SESSION_MODES: { value: SessionMode; label: string; shortLabel: string; description: string }[] = [
	{
		value: "classic",
		label: "Classic",
		shortLabel: "Self-paced",
		description: "Take each flag one at a time, with no timer pushing the pace.",
	},
	{
		value: "timed",
		label: "Timed",
		shortLabel: "60-second sprint",
		description: "Keep moving through flags for one fast minute and chase the streak.",
	},
];

function RunMetric({ label, value }: { label: string; value: number | string }) {
	return (
		<div className="ui-chip-light rounded-full px-3.5 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
			<p className="text-[10px] uppercase tracking-[0.16em] text-[var(--ui-text-dark-soft)]">{label}</p>
			<p className="text-sm font-semibold text-[var(--ui-text-dark)]">{value}</p>
		</div>
	);
}

function LivesRow({ lives }: { lives: number }) {
	const previousLivesRef = useRef(lives);
	const lostLifeIndex = lives < previousLivesRef.current ? lives : null;

	useEffect(() => {
		previousLivesRef.current = lives;
	}, [lives]);

	return (
		<div
			aria-label={`${lives} lives remaining`}
			className="ui-chip-light flex items-center gap-1.5 rounded-full px-3.5 py-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
			role="img"
		>
			{LIFE_SLOT_KEYS.map((slotKey, index) => (
				<HeartLife key={slotKey} filled={index < lives} isBreaking={index === lostLifeIndex} />
			))}
		</div>
	);
}

function HeartLife({ filled, isBreaking }: { filled: boolean; isBreaking: boolean }) {
	const prefersReducedMotion = useReducedMotion();
	const isBroken = !filled;
	const transition = prefersReducedMotion ? { duration: 0 } : { duration: 0.24, ease: HEART_BREAK_EASE };
	const leftX = isBroken ? -1.4 : 0;
	const rightX = isBroken ? 1.4 : 0;
	const dropY = isBroken ? 0.85 : 0;

	return (
		<motion.span
			animate={
				isBreaking && !prefersReducedMotion
					? {
							scale: [1, 1.14, 0.95, 1],
					  }
					: { scale: 1 }
			}
			className="relative block h-5 w-5"
			initial={false}
			transition={transition}
		>
			<motion.svg
				animate={{ rotate: isBroken ? -10 : 0, x: leftX, y: dropY }}
				aria-hidden
				className={`absolute inset-0 h-full w-full overflow-visible ${
					filled ? "text-rose-500 drop-shadow-[0_3px_8px_rgba(244,63,94,0.24)]" : "text-rose-200"
				}`}
				initial={false}
				style={{ clipPath: "inset(0 50% 0 0)" }}
				transition={transition}
				viewBox="0 0 24 24"
			>
				<title>Heart icon</title>
				<path d={HEART_PATH} fill="currentColor" />
			</motion.svg>

			<motion.svg
				animate={{ rotate: isBroken ? 10 : 0, x: rightX, y: dropY + 0.25 }}
				aria-hidden
				className={`absolute inset-0 h-full w-full overflow-visible ${
					filled ? "text-rose-500 drop-shadow-[0_3px_8px_rgba(244,63,94,0.24)]" : "text-rose-200"
				}`}
				initial={false}
				style={{ clipPath: "inset(0 0 0 50%)" }}
				transition={transition}
				viewBox="0 0 24 24"
			>
				<title>Heart icon</title>
				<path d={HEART_PATH} fill="currentColor" />
			</motion.svg>

			<motion.svg
				animate={{ opacity: isBroken ? 1 : 0 }}
				aria-hidden
				className={`absolute inset-0 h-full w-full overflow-visible ${filled ? "text-rose-600" : "text-rose-300"}`}
				initial={false}
				transition={transition}
				viewBox="0 0 24 24"
			>
				<title>Heart crack</title>
				<motion.path
					animate={{ pathLength: isBroken ? 1 : 0.2 }}
					d={HEART_CRACK_PATH}
					fill="none"
					initial={false}
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.8"
					transition={transition}
				/>
			</motion.svg>
		</motion.span>
	);
}

function dedupeCards(cards: (typeof allCountryCards)[number][]): (typeof allCountryCards)[number][] {
	return Array.from(new Map(cards.map((card) => [card.code, card])).values());
}

function getLastItem<T>(items: T[]): T | undefined {
	return items.length ? items[items.length - 1] : undefined;
}

function resolveRunOptionStateClass(option: string, run: RunState) {
	if (run.phase === "active" || !run.reveal) {
		return "ui-answer-card";
	}

	if (run.reveal.correctCapital === option) {
		return "ui-answer-card border-[rgba(91,167,132,0.55)] bg-[linear-gradient(180deg,rgba(237,248,241,0.98),rgba(226,244,235,0.96))] text-[#1e4836] shadow-[0_16px_34px_rgba(91,167,132,0.12)]";
	}

	if (run.reveal.selectedCapital === option && !run.reveal.correct) {
		return "ui-answer-card border-[rgba(216,132,144,0.58)] bg-[linear-gradient(180deg,rgba(252,238,239,0.98),rgba(250,229,231,0.96))] text-[#5b2e37] shadow-[0_16px_34px_rgba(216,132,144,0.12)]";
	}

	return "ui-answer-card-muted";
}
