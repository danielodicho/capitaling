"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import CountryGlobe from "@/components/country-globe";
import type { CountryBackdropTheme } from "@/lib/country-theme";
import { type RegionFilter, getRegionLabel, regionFilterOptions } from "@/lib/game-data";
import type { PromptState, RevealState, RunState } from "@/lib/game-engine";
import { type GlobeLocation, getRegionFocusLocation, getRegionHighlightShapeIds } from "@/lib/globe-data";

export type MobileFeedSlide = {
	id: string;
	prompt: PromptState;
	reveal: RevealState | null;
	selectedChoice: string | null;
	submitted: boolean;
};

type MobileGameFeedProps = {
	backdropTheme: CountryBackdropTheme;
	bestStreak: number;
	feedStartToken: number;
	globeFocusLocation: GlobeLocation | null;
	globeHighlightShapeIds: string[];
	hydrated: boolean;
	mobileSlides: MobileFeedSlide[];
	onAnswerTap: (choice: string) => void;
	onBackToLobby: () => void;
	onReplayMisses: () => void;
	onRunAgain: () => void;
	onSelectRegion: (region: RegionFilter) => void;
	onStart: () => void;
	run: RunState | null;
	selectedRegion: RegionFilter;
	summary: {
		run: RunState;
		timedOut: boolean;
	} | null;
};

type MobileGlobeView = {
	focusLocation: GlobeLocation | null;
	highlightShapeIds: string[];
	markerLocation: GlobeLocation | null;
	showMarker: boolean;
	subtitle: string;
	title: string;
};

export default function MobileGameFeed({
	backdropTheme,
	bestStreak,
	feedStartToken,
	globeFocusLocation,
	globeHighlightShapeIds,
	hydrated,
	mobileSlides,
	onAnswerTap,
	onBackToLobby,
	onReplayMisses,
	onRunAgain,
	onSelectRegion,
	onStart,
	run,
	selectedRegion,
	summary,
}: MobileGameFeedProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isGlobeOpen, setIsGlobeOpen] = useState(false);
	const [swiperInstance, setSwiperInstance] = useState<SwiperInstance | null>(null);
	const globeView = useMemo(
		() =>
			resolveMobileGlobeView({
				activeIndex,
				globeFocusLocation,
				globeHighlightShapeIds,
				mobileSlides,
				selectedRegion,
				summary,
			}),
		[activeIndex, globeFocusLocation, globeHighlightShapeIds, mobileSlides, selectedRegion, summary],
	);

	useEffect(() => {
		if (feedStartToken === 0 || !swiperInstance) {
			return;
		}

		const frameId = window.requestAnimationFrame(() => {
			swiperInstance.update();
			swiperInstance.slideTo(1, 0);
			setActiveIndex(1);
		});

		return () => window.cancelAnimationFrame(frameId);
	}, [feedStartToken, swiperInstance]);

	useEffect(() => {
		if (!swiperInstance || run || summary || mobileSlides.length > 0) {
			return;
		}

		const frameId = window.requestAnimationFrame(() => {
			swiperInstance.slideTo(0, 0);
			setActiveIndex(0);
		});

		return () => window.cancelAnimationFrame(frameId);
	}, [mobileSlides.length, run, summary, swiperInstance]);

	useEffect(() => {
		if (activeIndex <= mobileSlides.length + (summary ? 1 : 0)) {
			return;
		}

		setActiveIndex(Math.max(0, mobileSlides.length + (summary ? 1 : 0)));
	}, [activeIndex, mobileSlides.length, summary]);

	return (
		<div className="mobile-feed-shell relative z-10 h-[100dvh]">
			<Swiper
				className="mobile-feed-swiper h-full"
				cssMode
				direction="vertical"
				onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
				onSwiper={setSwiperInstance}
				slidesPerView={1}
				speed={380}
			>
				<SwiperSlide className="mobile-feed-swiper__slide">
					<MobileLobbySlide
						hydrated={hydrated}
						onSelectRegion={onSelectRegion}
						onStart={onStart}
						selectedRegion={selectedRegion}
					/>
				</SwiperSlide>

				{mobileSlides.map((slide, index) => (
					<SwiperSlide key={slide.id} className="mobile-feed-swiper__slide">
						<MobilePromptSlide
							index={index}
							isCurrentSlide={index === mobileSlides.length - 1 && run?.phase === "active"}
							onAnswerTap={onAnswerTap}
							run={run}
							slide={slide}
						/>
					</SwiperSlide>
				))}

				{summary ? (
					<SwiperSlide className="mobile-feed-swiper__slide">
						<MobileSummarySlide
							bestStreak={bestStreak}
							onBackToLobby={onBackToLobby}
							onReplayMisses={onReplayMisses}
							onRunAgain={onRunAgain}
							run={summary.run}
							timedOut={summary.timedOut}
						/>
					</SwiperSlide>
				) : null}
			</Swiper>

			<div className="pointer-events-none fixed bottom-[calc(env(safe-area-inset-bottom)+1rem)] right-4 z-20 md:hidden">
				<div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/14 bg-slate-950/94 px-3 py-3 shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
					<button
						type="button"
						onClick={() => setIsGlobeOpen(true)}
						className="flex h-12 w-12 items-center justify-center rounded-full border border-[#6ba7b8]/34 bg-[#6ba7b8]/16 text-white transition active:scale-[0.97]"
					>
						<GlobeIcon />
					</button>
					<p className="pr-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/86">Globe</p>
				</div>
			</div>

			<AnimatePresence>
				{isGlobeOpen ? (
					<motion.div
						animate={{ opacity: 1 }}
						className="fixed inset-0 z-40 md:hidden"
						exit={{ opacity: 0 }}
						initial={{ opacity: 0 }}
						transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
					>
						<div className="absolute inset-0 bg-slate-950/92" />
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="relative flex min-h-[100dvh] flex-col px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-[calc(env(safe-area-inset-top)+1rem)] text-white"
							exit={{ opacity: 0, y: 12 }}
							initial={{ opacity: 0, y: 12 }}
							transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
						>
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200/76">Atlas view</p>
									<h2 className="display-type mt-2 text-3xl font-semibold leading-tight">{globeView.title}</h2>
									<p className="mt-2 max-w-xs text-sm leading-6 text-slate-200/76">{globeView.subtitle}</p>
								</div>
								<button
									type="button"
									onClick={() => setIsGlobeOpen(false)}
									className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-medium text-white transition active:scale-[0.99]"
								>
									Close
								</button>
							</div>

							<div className="mt-10 flex flex-1 items-center justify-center">
								<CountryGlobe
									className="mx-auto w-full max-w-[23rem]"
									focusLocation={globeView.focusLocation}
									highlightShapeIds={globeView.highlightShapeIds}
									idleSpin={!globeView.showMarker}
									markerLocation={globeView.markerLocation}
									showMarker={globeView.showMarker}
									theme={backdropTheme}
									variant="hero"
								/>
							</div>
						</motion.div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}

function MobileLobbySlide({
	hydrated,
	onSelectRegion,
	onStart,
	selectedRegion,
}: {
	hydrated: boolean;
	onSelectRegion: (region: RegionFilter) => void;
	onStart: () => void;
	selectedRegion: RegionFilter;
}) {
	return (
		<section className="flex h-full min-h-[100dvh] flex-col overflow-y-auto overscroll-contain px-4 pb-[calc(env(safe-area-inset-bottom)+5.75rem)] pt-[calc(env(safe-area-inset-top)+1rem)]">
			<div className="mx-auto flex w-full max-w-[25rem] flex-1 flex-col">
				<div className="rounded-[2rem] border border-white/12 bg-slate-950/94 p-5 shadow-[0_22px_56px_rgba(2,6,23,0.28)]">
					<div className="flex items-center justify-between gap-3 text-sm text-stone-200/72">
						<p className="display-type text-3xl text-white">Capitaling</p>
						<span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]">
							Phone feed
						</span>
					</div>

					<div className="mt-6 space-y-4">
						<h1 className="display-type text-[2.65rem] font-semibold leading-[0.92] text-white">
							Scroll through flags. Lock in capitals.
						</h1>
						<p className="text-sm leading-7 text-slate-100/92">
							Tap once to select, tap again to answer, then keep moving. The atlas waits for reveal instead of fighting
							the quiz.
						</p>
					</div>
				</div>

				<div className="mt-5 rounded-[2rem] border border-white/10 bg-slate-950/90 p-4 shadow-[0_18px_42px_rgba(2,6,23,0.2)]">
					<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100/76">Choose a region</p>
					<div className="mt-4 flex flex-wrap gap-2.5">
						{regionFilterOptions.map((option) => {
							const active = option.value === selectedRegion;

							return (
								<button
									key={option.value}
									type="button"
									onClick={() => onSelectRegion(option.value)}
									className={`rounded-full border px-4 py-3 text-sm font-medium transition ${
										active
											? "border-[#f2b8a1] bg-[rgba(255,241,234,0.14)] text-white shadow-[0_0_0_1px_rgba(242,140,107,0.16)]"
											: "border-white/12 bg-white/8 text-slate-100"
									}`}
								>
									{option.label}
								</button>
							);
						})}
					</div>
				</div>

				<div className="mt-auto pt-6">
					<div className="rounded-[2rem] border border-white/10 bg-slate-950/92 p-4">
						<p className="text-sm leading-6 text-slate-100/90">
							Starting in <span className="font-semibold text-white">{getRegionLabel(selectedRegion)}</span>. Swipe up
							between cards once the run starts.
						</p>
						<button
							type="button"
							onClick={onStart}
							disabled={!hydrated}
							className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-[#ffe5dc] bg-[linear-gradient(135deg,#ffb395,#f28c6b_52%,#ffad72)] px-5 py-4 text-base font-semibold text-slate-950 shadow-[0_18px_44px_rgba(242,140,107,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
						>
							{hydrated ? `Start ${getRegionLabel(selectedRegion)}` : "Loading..."}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}

function MobilePromptSlide({
	index,
	isCurrentSlide,
	onAnswerTap,
	run,
	slide,
}: {
	index: number;
	isCurrentSlide: boolean;
	onAnswerTap: (choice: string) => void;
	run: RunState | null;
	slide: MobileFeedSlide;
}) {
	const instruction = slide.submitted
		? slide.reveal?.correct
			? "Correct call. Scroll for the next flag."
			: "Answer locked. Scroll for the next flag."
		: slide.selectedChoice
		  ? "Tap the orange answer again to lock it in."
		  : "Tap once to select, then tap again to answer.";

	return (
		<section className="flex h-full min-h-[100dvh] flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+5.75rem)] pt-[calc(env(safe-area-inset-top)+1rem)]">
			<div className="mx-auto flex h-full w-full max-w-[25rem] flex-col">
				<div className="rounded-[1.5rem] border border-white/12 bg-slate-950/78 px-4 py-3 backdrop-blur-md">
					<div className="flex items-start justify-between gap-4">
						<div>
							<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100/82">
								Flag {index + 1}
							</p>
							<h2 className="display-type mt-2 text-[1.9rem] font-semibold leading-none text-white">
								Pick the capital
							</h2>
						</div>
						<div className="flex flex-wrap justify-end gap-2">
							<MobileInlineStat label="Region" value={slide.prompt.card.region} />
							{isCurrentSlide && run ? <MobileInlineStat label="Streak" value={run.streak} /> : null}
							{isCurrentSlide && run ? <MobileInlineStat label="Lives" value={run.lives} /> : null}
							{slide.prompt.source === "review" ? <MobileInlineStat label="Mode" value="Review" /> : null}
						</div>
					</div>
				</div>

				<div className="mt-5 rounded-[2.2rem] border border-white/12 bg-slate-950/94 p-3 shadow-[0_20px_52px_rgba(2,6,23,0.24)]">
					<div className="pointer-events-none rounded-[1.7rem] bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.14),transparent_34%),linear-gradient(180deg,rgba(15,23,42,0.5),rgba(2,6,23,0.38))] p-3">
						<div
							aria-label="Flag card"
							className="aspect-[16/10] rounded-[1.45rem] bg-contain bg-center bg-no-repeat shadow-[0_20px_46px_rgba(2,6,23,0.32)]"
							role="img"
							style={{ backgroundImage: `url("${slide.prompt.card.flagPath}")` }}
						/>
					</div>

					<div className="mt-4 flex items-center justify-between gap-3 px-1">
						<p className="text-sm text-slate-100/90">{slide.prompt.card.subregion}</p>
						<p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80">
							{slide.submitted ? "Answered" : "Waiting"}
						</p>
					</div>
				</div>

				<div className="mt-auto">
					<div className="rounded-[2rem] border border-white/10 bg-slate-950/94 p-3 shadow-[0_18px_46px_rgba(2,6,23,0.22)]">
						<div className="grid grid-cols-2 gap-3">
							{slide.prompt.expandedOptions.map((option) => (
								<button
									key={option}
									type="button"
									disabled={!isCurrentSlide || slide.submitted}
									onClick={() => onAnswerTap(option)}
									className={`min-h-[5.5rem] rounded-[1.45rem] border px-3 py-3.5 text-left transition ${resolveAnswerStateClass(
										option,
										slide,
									)} ${!isCurrentSlide || slide.submitted ? "cursor-default" : "active:scale-[0.985]"}`}
								>
									<p className="text-[11px] uppercase tracking-[0.18em] opacity-82">{slide.prompt.card.region}</p>
									<p className="mt-3 text-lg font-semibold leading-tight sm:text-xl">{option}</p>
								</button>
							))}
						</div>

						<p className="mt-4 text-center text-sm leading-6 text-slate-100/92">{instruction}</p>

						<AnimatePresence>
							{slide.submitted && slide.reveal ? (
								<motion.div
									animate={{ opacity: 1, y: 0 }}
									className={`mt-4 rounded-[1.7rem] border px-4 py-4 ${
										slide.reveal.correct
											? "border-emerald-300/24 bg-emerald-400/10 text-emerald-50"
											: "border-rose-300/24 bg-rose-400/10 text-rose-50"
									}`}
									exit={{ opacity: 0, y: -8 }}
									initial={{ opacity: 0, y: 8 }}
									transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
								>
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-86">
												{slide.reveal.correct ? "Correct" : "Locked in"}
											</p>
											<p className="mt-2 text-xl font-semibold text-white">
												{slide.prompt.card.country} · {slide.reveal.correctCapital}
											</p>
											<p className="mt-2 text-sm leading-6 opacity-88">
												{slide.reveal.correct
													? "Nice hit. The next flag is waiting below."
													: `You picked ${slide.reveal.selectedCapital}. The right answer is ${slide.reveal.correctCapital}.`}
											</p>
										</div>
										<div className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/82">
											Next below
										</div>
									</div>
								</motion.div>
							) : null}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</section>
	);
}

function MobileSummarySlide({
	bestStreak,
	onBackToLobby,
	onReplayMisses,
	onRunAgain,
	run,
	timedOut,
}: {
	bestStreak: number;
	onBackToLobby: () => void;
	onReplayMisses: () => void;
	onRunAgain: () => void;
	run: RunState;
	timedOut: boolean;
}) {
	const isPersonalBest = run.bestStreak > 0 && run.bestStreak >= bestStreak;

	return (
		<section className="flex h-full min-h-[100dvh] flex-col justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+5.75rem)] pt-[calc(env(safe-area-inset-top)+1rem)]">
			<div className="mx-auto w-full max-w-[25rem] rounded-[2.2rem] border border-white/12 bg-slate-950/94 p-6 text-white shadow-[0_22px_56px_rgba(2,6,23,0.28)]">
				<p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100/74">
					{timedOut ? "Time's up" : "Run complete"}
				</p>
				<h2 className="display-type mt-4 text-7xl font-semibold leading-none">{run.bestStreak}</h2>
				<p className="mt-3 text-lg text-slate-200/82">best streak this run</p>

				<div className="mt-6 grid grid-cols-3 gap-3">
					<MobileStat label="Correct" value={run.correctCount} />
					<MobileStat label="Misses" value={run.missedCodes.length} />
					<MobileStat label="Record" value={isPersonalBest ? "New" : bestStreak} />
				</div>

				<div className="mt-8 space-y-3">
					<button
						type="button"
						onClick={onRunAgain}
						className="w-full rounded-full bg-white px-5 py-4 text-sm font-semibold text-slate-950"
					>
						Run it again
					</button>
					<button
						type="button"
						disabled={!run.missedCodes.length}
						onClick={onReplayMisses}
						className="w-full rounded-full border border-white/12 bg-white/8 px-5 py-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
					>
						Replay misses
					</button>
					<button
						type="button"
						onClick={onBackToLobby}
						className="w-full rounded-full border border-white/14 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white/92"
					>
						Back to lobby
					</button>
				</div>
			</div>
		</section>
	);
}

function MobileStat({ label, value }: { label: string; value: number | string }) {
	return (
		<div className="rounded-[1.4rem] border border-white/12 bg-slate-950/72 px-4 py-3">
			<p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-100/86">{label}</p>
			<p className="mt-2 text-lg font-semibold text-white">{value}</p>
		</div>
	);
}

function MobileInlineStat({ label, value }: { label: string; value: number | string }) {
	return (
		<span className="rounded-full border border-white/14 bg-slate-950/72 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
			{label}: {value}
		</span>
	);
}

function GlobeIcon() {
	return (
		<svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
			<circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
			<path
				d="M3.5 12h17M12 3c2.8 2.5 4.5 5.7 4.5 9S14.8 18.5 12 21m0-18c-2.8 2.5-4.5 5.7-4.5 9S9.2 18.5 12 21"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	);
}

function resolveAnswerStateClass(option: string, slide: MobileFeedSlide) {
	if (!slide.submitted) {
		if (slide.selectedChoice === option) {
			return "ui-answer-card border-[rgba(242,140,107,0.6)] bg-[rgba(255,241,234,0.98)] text-[#102033] shadow-[0_0_0_1px_rgba(242,140,107,0.2)]";
		}

		return "ui-answer-card";
	}

	if (slide.reveal?.correctCapital === option) {
		return "ui-answer-card border-[rgba(91,167,132,0.55)] bg-[rgba(237,248,241,0.98)] text-[#1e4836]";
	}

	if (slide.selectedChoice === option && !slide.reveal?.correct) {
		return "ui-answer-card border-[rgba(216,132,144,0.58)] bg-[rgba(252,238,239,0.98)] text-[#5b2e37]";
	}

	return "ui-answer-card-muted text-slate-700";
}

function resolveMobileGlobeView({
	activeIndex,
	globeFocusLocation,
	globeHighlightShapeIds,
	mobileSlides,
	selectedRegion,
	summary,
}: {
	activeIndex: number;
	globeFocusLocation: GlobeLocation | null;
	globeHighlightShapeIds: string[];
	mobileSlides: MobileFeedSlide[];
	selectedRegion: RegionFilter;
	summary: MobileGameFeedProps["summary"];
}): MobileGlobeView {
	const lobbyView: MobileGlobeView = {
		focusLocation: globeFocusLocation,
		highlightShapeIds: globeHighlightShapeIds,
		markerLocation: selectedRegion === "all" ? null : globeFocusLocation,
		showMarker: selectedRegion !== "all" && Boolean(globeFocusLocation),
		subtitle:
			selectedRegion === "all"
				? "The full atlas is in play."
				: `${getRegionLabel(selectedRegion)} stays highlighted while you scroll the feed.`,
		title: getRegionLabel(selectedRegion),
	};

	if (activeIndex <= 0 || mobileSlides.length === 0) {
		return lobbyView;
	}

	const summaryIndex = summary ? mobileSlides.length + 1 : -1;
	if (summary && activeIndex >= summaryIndex) {
		const lastSlide = getLastItem(mobileSlides);
		return lastSlide ? resolveAnsweredGlobeView(lastSlide) : lobbyView;
	}

	const activeSlide = mobileSlides[Math.min(activeIndex - 1, mobileSlides.length - 1)];
	if (!activeSlide) {
		return lobbyView;
	}

	return activeSlide.submitted ? resolveAnsweredGlobeView(activeSlide) : resolvePromptGlobeView(activeSlide);
}

function resolvePromptGlobeView(slide: MobileFeedSlide): MobileGlobeView {
	return {
		focusLocation: getRegionFocusLocation(slide.prompt.card.region),
		highlightShapeIds: getRegionHighlightShapeIds(slide.prompt.card.region),
		markerLocation: null,
		showMarker: false,
		subtitle: "Region spotlight for the current flag. Lock in an answer to reveal the country focus.",
		title: `${slide.prompt.card.region} focus`,
	};
}

function resolveAnsweredGlobeView(slide: MobileFeedSlide): MobileGlobeView {
	return {
		focusLocation: slide.prompt.card.location ?? getRegionFocusLocation(slide.prompt.card.region),
		highlightShapeIds: slide.prompt.card.countryShapeId
			? [slide.prompt.card.countryShapeId]
			: getRegionHighlightShapeIds(slide.prompt.card.region),
		markerLocation: slide.prompt.card.location,
		showMarker: Boolean(slide.prompt.card.location),
		subtitle: `${slide.prompt.card.capital} · ${slide.prompt.card.region}`,
		title: slide.prompt.card.country,
	};
}

function getLastItem<T>(items: T[]): T | undefined {
	return items.length ? items[items.length - 1] : undefined;
}
