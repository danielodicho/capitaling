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
const TIMED_MODE_SECONDS = 60;

type SessionMode = "classic" | "timed";

type SummarySnapshot = {
	run: RunState;
	sessionMode: SessionMode;
	timedOut: boolean;
};

function WinClock() {
	const [time, setTime] = useState("");
	useEffect(() => {
		function update() {
			const now = new Date();
			setTime(
				now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
			);
		}
		update();
		const id = setInterval(update, 1000);
		return () => clearInterval(id);
	}, []);
	return <div className="win-clock">{time}</div>;
}

function Taskbar({ title }: { title: string }) {
	return (
		<div className="win-taskbar">
			<button className="win-start-btn" type="button">
				<span style={{ fontSize: 14 }}>⊞</span>
				<span>Start</span>
			</button>
			{title && (
				<div
					style={{
						marginLeft: 6,
						background: "rgba(0,0,0,0.3)",
						border: "1px solid rgba(255,255,255,0.25)",
						color: "#fff",
						fontSize: 11,
						padding: "2px 10px",
						height: 22,
						display: "flex",
						alignItems: "center",
						gap: 6,
					}}
				>
					<span>🌍</span>
					<span>{title}</span>
				</div>
			)}
			<WinClock />
		</div>
	);
}

function TitleBar({
	title,
	icon = "🌍",
	onClose,
}: {
	title: string;
	icon?: string;
	onClose?: () => void;
}) {
	return (
		<div className="win-titlebar">
			<div style={{ display: "flex", alignItems: "center", gap: 6 }}>
				<span style={{ fontSize: 14 }}>{icon}</span>
				<span>{title}</span>
			</div>
			<div style={{ display: "flex", gap: 2 }}>
				<button
					type="button"
					style={{
						width: 16,
						height: 14,
						background: "#d4d0c8",
						border: "1px solid",
						borderColor: "#ffffff #808080 #808080 #ffffff",
						fontSize: 9,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "default",
						color: "#000",
						lineHeight: 1,
					}}
					aria-label="Minimize"
				>
					_
				</button>
				<button
					type="button"
					style={{
						width: 16,
						height: 14,
						background: "#d4d0c8",
						border: "1px solid",
						borderColor: "#ffffff #808080 #808080 #ffffff",
						fontSize: 9,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: "default",
						color: "#000",
						lineHeight: 1,
					}}
					aria-label="Maximize"
				>
					□
				</button>
				<button
					type="button"
					onClick={onClose}
					style={{
						width: 16,
						height: 14,
						background: "#c0392b",
						border: "1px solid",
						borderColor: "#e05040 #7a1c10 #7a1c10 #e05040",
						fontSize: 9,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						cursor: onClose ? "pointer" : "default",
						color: "#ffffff",
						fontWeight: "bold",
						lineHeight: 1,
					}}
					aria-label="Close"
				>
					✕
				</button>
			</div>
		</div>
	);
}

export default function GameShell() {
	const [selectedRegion, setSelectedRegion] = useState<RegionFilter>("all");
	const [selectedMode, setSelectedMode] = useState<SessionMode>("classic");
	const [profile, setProfile] = useState<PlayerProgress>(createEmptyProgress);
	const [hydrated, setHydrated] = useState(false);
	const [activeMode, setActiveMode] = useState<SessionMode>("classic");
	const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
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
		if (!hydrated) return;
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
			if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
		};
	}, []);

	useEffect(() => {
		if (!run || activeMode !== "timed" || timeRemaining === null) return;
		if (timeRemaining <= 0) {
			clearRevealTimer();
			const timedOutRun: RunState = { ...run, phase: "summary", currentPrompt: null };
			setSummary({ run: timedOutRun, sessionMode: activeMode, timedOut: true });
			setRun(null);
			setTimeRemaining(null);
			return;
		}
		const timer = window.setTimeout(() => {
			setTimeRemaining((c) => (c === null ? null : c - 1));
		}, 1000);
		return () => window.clearTimeout(timer);
	}, [activeMode, run, timeRemaining]);

	useEffect(() => {
		if (run?.phase !== "active" || !run.currentPrompt) return;
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.metaKey || event.ctrlKey || event.altKey) return;
			const prompt = run.currentPrompt;
			if (!prompt) return;
			const key = event.key.toLowerCase();
			if (key === "arrowup" || key === "w") { event.preventDefault(); handleAnswerRef.current(prompt.expandedOptions[0]); return; }
			if (key === "arrowright" || key === "d") { event.preventDefault(); handleAnswerRef.current(prompt.expandedOptions[1]); return; }
			if (key === "arrowdown" || key === "s") { event.preventDefault(); handleAnswerRef.current(prompt.expandedOptions[2]); return; }
			if (key === "arrowleft" || key === "a") { event.preventDefault(); handleAnswerRef.current(prompt.expandedOptions[3]); return; }
			if (["1", "2", "3", "4"].includes(key)) {
				event.preventDefault();
				const option = prompt.expandedOptions[Number(key) - 1];
				if (option) handleAnswerRef.current(option);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [run]);

	const selectedCards = useMemo(() => getCardsForRegion(selectedRegion), [selectedRegion]);

	function startStandardRun(regionFilter: RegionFilter, sessionMode: SessionMode) {
		clearRevealTimer();
		setSummary(null);
		const nextProfile = recordRunStart(profile);
		const pool = getCardsForRegion(regionFilter);
		setProfile(nextProfile);
		setActiveMode(sessionMode);
		setTimeRemaining(sessionMode === "timed" ? TIMED_MODE_SECONDS : null);
		startTransition(() => {
			setRun(createRun({ pool, optionPool: pool.length >= 4 ? pool : allCountryCards, regionFilter, label: getRegionLabel(regionFilter) }));
		});
	}

	function startReviewRun(codes: string[]) {
		const reviewPool = dedupeCards(
			codes.map((code) => countryCardsByCode[code]).filter((card): card is NonNullable<typeof card> => Boolean(card)),
		);
		if (!reviewPool.length) return;
		clearRevealTimer();
		setSummary(null);
		setProfile(recordRunStart(profile));
		setActiveMode("classic");
		setTimeRemaining(null);
		startTransition(() => {
			setRun(createRun({ pool: reviewPool, optionPool: allCountryCards, regionFilter: "review", mode: "review", label: "Review" }));
		});
	}

	function handleAnswer(choice: string) {
		if (!run || run.phase !== "active" || !run.currentPrompt) return;
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
		if (typeof window !== "undefined" && "vibrate" in navigator) navigator.vibrate(resolution.correct ? 12 : 36);
		if (activeMode === "timed") scheduleAdvance(nextProfile);
	}

	handleAnswerRef.current = handleAnswer;

	function handleAdvance(profileSnapshot = profileRef.current) {
		const currentRun = runRef.current;
		if (!currentRun) return;
		clearRevealTimer();
		const nextRun = advanceAfterReveal(currentRun);
		if (nextRun.phase === "summary") {
			setSummary({ run: nextRun, sessionMode: activeMode, timedOut: false });
			setRun(null);
			setTimeRemaining(null);
			return;
		}
		profileRef.current = profileSnapshot;
		setRun(nextRun);
	}

	function handleReturnToLobby() {
		clearRevealTimer();
		setRun(null);
		setSummary(null);
		setTimeRemaining(null);
	}

	function scheduleAdvance(nextProfile: PlayerProgress) {
		clearRevealTimer();
		revealTimerRef.current = window.setTimeout(() => handleAdvance(nextProfile), REVEAL_DURATION_MS);
	}

	function clearRevealTimer() {
		if (revealTimerRef.current) {
			window.clearTimeout(revealTimerRef.current);
			revealTimerRef.current = null;
		}
	}

	const currentTitle = run
		? `Capitaling — ${run.label}`
		: summary
		? "Capitaling — Results"
		: "Capitaling — Flags Quiz";

	return (
		<div className="win-desktop">
			<Taskbar title={run ? run.label : summary ? "Results" : "Flags Quiz"} />

			{/* Desktop icons */}
			<div style={{ position: "fixed", top: 16, left: 16, zIndex: 10, display: "flex", flexDirection: "column", gap: 8 }}>
				<div className="win-desktop-icon">
					<span style={{ fontSize: 32 }}>🌍</span>
					<span>Capitaling</span>
				</div>
				<div className="win-desktop-icon">
					<span style={{ fontSize: 32 }}>🗑️</span>
					<span>Recycle Bin</span>
				</div>
			</div>

			{/* Main window centered on desktop */}
			<div
				style={{
					minHeight: "calc(100vh - 30px)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					padding: "16px 16px 46px 88px",
				}}
			>
				<div style={{ width: "100%", maxWidth: 660 }}>
					<AnimatePresence mode="wait">
						{run ? (
							<motion.div
								key="run"
								initial={{ opacity: 0, scale: 0.97 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.97 }}
								transition={{ duration: 0.12 }}
							>
								<div className="win-panel">
									<TitleBar title={`${run.label} — Capitaling`} onClose={handleReturnToLobby} />
									<MenuBar />
									<div style={{ padding: 8 }}>
										<RunScreen
											activeMode={activeMode}
											bestStreak={profile.bestStreak}
											onAnswer={handleAnswer}
											onAdvance={() => handleAdvance()}
											onExit={handleReturnToLobby}
											run={run}
											timeRemaining={timeRemaining}
										/>
									</div>
									<StatusBar
										cells={[
											`Region: ${run.currentPrompt?.card.region ?? "—"}`,
											`Mode: ${activeMode}`,
											`Streak: ${run.streak}`,
											activeMode === "timed" && timeRemaining !== null ? `Time: ${timeRemaining}s` : "Classic",
										]}
									/>
								</div>
							</motion.div>
						) : summary ? (
							<motion.div
								key="summary"
								initial={{ opacity: 0, scale: 0.97 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.97 }}
								transition={{ duration: 0.12 }}
							>
								<div className="win-panel">
									<TitleBar title="Session Results — Capitaling" onClose={handleReturnToLobby} />
									<MenuBar />
									<div style={{ padding: 12 }}>
										<SummaryScreen
											bestStreak={profile.bestStreak}
											onBack={handleReturnToLobby}
											onReplayMisses={() => startReviewRun(summary.run.missedCodes)}
											onRunAgain={() => startStandardRun(selectedRegion, summary.sessionMode)}
											run={summary.run}
											sessionMode={summary.sessionMode}
											timedOut={summary.timedOut}
										/>
									</div>
									<StatusBar cells={["Session complete", `${summary.run.correctCount} correct`, `${summary.run.missedCodes.length} misses`]} />
								</div>
							</motion.div>
						) : (
							<motion.div
								key="lobby"
								initial={{ opacity: 0, scale: 0.97 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.97 }}
								transition={{ duration: 0.12 }}
							>
								<div className="win-panel">
									<TitleBar title="Capitaling — Flags Quiz" />
									<MenuBar />
									<div style={{ padding: 12 }}>
										<LobbyScreen
											bestStreak={profile.bestStreak}
											cardsCount={selectedCards.length}
											hydrated={hydrated}
											onSelectMode={setSelectedMode}
											onSelectRegion={setSelectedRegion}
											onStart={() => startStandardRun(selectedRegion, selectedMode)}
											selectedMode={selectedMode}
											selectedRegion={selectedRegion}
											totalCorrect={profile.totalCorrect}
										/>
									</div>
									<StatusBar
										cells={[
											`${selectedCards.length} flags in set`,
											`Best streak: ${profile.bestStreak}`,
											`Total correct: ${profile.totalCorrect}`,
											"Ready",
										]}
									/>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}

function MenuBar() {
	return (
		<div className="win-menubar">
			{["File", "Edit", "View", "Game", "Help"].map((item) => (
				<span key={item} className="win-menubar-item">
					{item}
				</span>
			))}
		</div>
	);
}

function StatusBar({ cells }: { cells: (string | false | null | undefined)[] }) {
	const validCells = cells.filter(Boolean) as string[];
	return (
		<div className="win-statusbar">
			{validCells.map((cell, i) => (
				<div key={i} className="win-statusbar-cell">
					{cell}
				</div>
			))}
		</div>
	);
}

function LobbyScreen({
	bestStreak,
	cardsCount,
	hydrated,
	onSelectMode,
	onSelectRegion,
	onStart,
	selectedMode,
	selectedRegion,
	totalCorrect,
}: {
	bestStreak: number;
	cardsCount: number;
	hydrated: boolean;
	onSelectMode: (mode: SessionMode) => void;
	onSelectRegion: (region: RegionFilter) => void;
	onStart: () => void;
	selectedMode: SessionMode;
	selectedRegion: RegionFilter;
	totalCorrect: number;
}) {
	return (
		<div>
			{/* Header */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 12,
					marginBottom: 12,
					padding: 8,
					background: "linear-gradient(to right, #0a246a, #a6caf0)",
					color: "#fff",
				}}
			>
				<span style={{ fontSize: 32 }}>🌍</span>
				<div>
					<div style={{ fontWeight: "bold", fontSize: 16 }}>Capitaling</div>
					<div style={{ fontSize: 11, opacity: 0.85 }}>One flag. Four choices. Learn world capitals.</div>
				</div>
			</div>

			{/* Stats row */}
			<div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
				{[
					{ label: "Flags in Set", value: cardsCount },
					{ label: "Best Streak", value: bestStreak },
					{ label: "Total Correct", value: totalCorrect },
				].map(({ label, value }) => (
					<div key={label} className="win-sunken" style={{ flex: 1, padding: "6px 10px", textAlign: "center" }}>
						<div style={{ fontSize: 18, fontWeight: "bold", color: "#0a246a" }}>{value}</div>
						<div style={{ fontSize: 10, color: "#404040" }}>{label}</div>
					</div>
				))}
			</div>

			<div className="win-separator" />

			{/* Mode selection */}
			<div style={{ marginBottom: 10 }}>
				<div
					style={{
						fontSize: 11,
						fontWeight: "bold",
						marginBottom: 6,
						color: "#000",
						background: "#ece9d8",
						padding: "3px 6px",
						borderBottom: "1px solid #aca899",
					}}
				>
					Select Game Mode
				</div>
				<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
					{SESSION_MODES.map((mode) => {
						const active = mode.value === selectedMode;
						return (
							<button
								key={mode.value}
								type="button"
								onClick={() => onSelectMode(mode.value)}
								className={active ? "win-btn win-btn-active" : "win-btn"}
								style={{ textAlign: "left", padding: "8px 10px", height: "auto", display: "block" }}
							>
								<div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
									<span style={{ fontSize: 16 }}>{mode.icon}</span>
									<strong>{mode.label}</strong>
								</div>
								<div style={{ fontSize: 10, color: active ? "rgba(255,255,255,0.85)" : "#404040", lineHeight: 1.4 }}>
									{mode.description}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			<div className="win-separator" />

			{/* Region selection */}
			<div style={{ marginBottom: 10 }}>
				<div
					style={{
						fontSize: 11,
						fontWeight: "bold",
						marginBottom: 6,
						color: "#000",
						background: "#ece9d8",
						padding: "3px 6px",
						borderBottom: "1px solid #aca899",
					}}
				>
					Select Region
				</div>
				<div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
					{regionFilterOptions.map((option) => {
						const active = option.value === selectedRegion;
						return (
							<button
								key={option.value}
								type="button"
								onClick={() => onSelectRegion(option.value)}
								className={active ? "win-btn win-btn-active" : "win-btn"}
								style={{ fontSize: 11 }}
							>
								{option.label}
							</button>
						);
					})}
				</div>
			</div>

			<div className="win-separator" />

			{/* Start button */}
			<div style={{ display: "flex", justifyContent: "center", paddingTop: 4 }}>
				<button
					type="button"
					onClick={onStart}
					disabled={!hydrated}
					className="win-btn win-btn-primary"
					style={{ padding: "6px 32px", fontSize: 13, minWidth: 180 }}
				>
					{hydrated ? `▶  Start — ${getRegionLabel(selectedRegion)}` : "Loading..."}
				</button>
			</div>
		</div>
	);
}

function RunScreen({
	activeMode,
	bestStreak,
	onAnswer,
	onAdvance,
	onExit,
	run,
	timeRemaining,
}: {
	activeMode: SessionMode;
	bestStreak: number;
	onAnswer: (choice: string) => void;
	onAdvance: () => void;
	onExit: () => void;
	run: RunState;
	timeRemaining: number | null;
}) {
	const prompt = run.currentPrompt;
	if (!prompt) return null;
	const options = prompt.expandedOptions;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
			{/* Toolbar row */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 6,
					padding: "4px 0",
					borderBottom: "1px solid #aca899",
				}}
			>
				<button type="button" onClick={onExit} className="win-btn" style={{ padding: "2px 10px" }}>
					◀ Exit
				</button>
				<div style={{ flex: 1 }} />
				<LivesRow lives={run.lives} />
				{activeMode === "timed" && timeRemaining !== null ? (
					<div
						className="win-sunken"
						style={{
							padding: "2px 10px",
							minWidth: 60,
							textAlign: "center",
							color: timeRemaining <= 10 ? "#c00000" : "#000",
							fontWeight: "bold",
						}}
					>
						⏱ {timeRemaining}s
					</div>
				) : null}
			</div>

			{/* Flag card */}
			<FlagCard prompt={prompt} run={run} onAnswer={onAnswer} />

			{/* Reveal panel */}
			<AnimatePresence mode="wait">
				{run.phase === "reveal" && run.reveal ? (
					<motion.div
						key="reveal"
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						transition={{ duration: 0.15 }}
					>
						<button
							type="button"
							onClick={onAdvance}
							className={`win-panel ${run.reveal.correct ? "win-correct" : "win-wrong"}`}
							style={{ width: "100%", textAlign: "left", padding: "10px 12px", cursor: "pointer" }}
						>
							<div
								style={{
									fontWeight: "bold",
									fontSize: 13,
									marginBottom: 4,
									display: "flex",
									alignItems: "center",
									gap: 6,
								}}
							>
								<span>{run.reveal.correct ? "✔" : "✖"}</span>
								<span>{run.reveal.correct ? "Correct!" : "Wrong!"}</span>
							</div>
							<div style={{ fontSize: 14, fontWeight: "bold" }}>
								{prompt.card.country} — {run.reveal.correctCapital}
							</div>
							<div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>
								{prompt.card.region} • {prompt.card.subregion}
							</div>
							{activeMode === "classic" ? (
								<div style={{ fontSize: 11, marginTop: 6, fontStyle: "italic" }}>{getFunFact(prompt.card)}</div>
							) : null}
							<div style={{ fontSize: 10, marginTop: 6, opacity: 0.7 }}>
								{activeMode === "classic" ? "Click anywhere to continue." : "Next card incoming..."}
							</div>
						</button>
					</motion.div>
				) : null}
			</AnimatePresence>

			{/* Answer options */}
			<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
				{options.map((option, index) => (
					<button
						key={option}
						type="button"
						onClick={() => onAnswer(option)}
						disabled={run.phase !== "active"}
						className="win-option-btn"
					>
						<div style={{ fontSize: 10, color: "#808080", marginBottom: 2 }}>
							[{DIRECTION_LABELS[index]}] {index + 1}
						</div>
						<div style={{ fontSize: 13, fontWeight: "bold" }}>{option}</div>
					</button>
				))}
			</div>

			{/* Hint row */}
			<div
				style={{
					fontSize: 10,
					color: "#808080",
					display: "flex",
					justifyContent: "space-between",
					paddingTop: 2,
				}}
			>
				<span>Subregion: {prompt.card.subregion}</span>
				<span>{activeMode === "classic" ? "Keys: ↑ → ↓ ←  or  1 2 3 4" : "Race the clock!"}</span>
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
	const rotate = useTransform(x, [-160, 0, 160], [-6, 0, 6]);

	return (
		<div
			className="win-sunken"
			style={{ position: "relative", overflow: "hidden", background: "#000" }}
		>
			{/* Window chrome on flag */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 20,
					background: "linear-gradient(to right, #0a246a, #a6caf0)",
					zIndex: 2,
					display: "flex",
					alignItems: "center",
					paddingLeft: 6,
					gap: 6,
					fontSize: 11,
					color: "#fff",
					fontWeight: "bold",
				}}
			>
				<span>🏳</span>
				<span>Flag.bmp — Paint</span>
				{prompt.source === "review" ? (
					<span
						style={{
							marginLeft: "auto",
							marginRight: 6,
							background: "#c00000",
							color: "#fff",
							fontSize: 10,
							padding: "1px 6px",
							border: "1px solid #7a1c10",
						}}
					>
						REVIEW
					</span>
				) : (
					<span
						style={{
							marginLeft: "auto",
							marginRight: 6,
							background: "rgba(0,0,0,0.4)",
							color: "#fff",
							fontSize: 10,
							padding: "1px 6px",
						}}
					>
						{prompt.card.region}
					</span>
				)}
			</div>

			<motion.div
				drag={run.phase === "active" ? true : false}
				dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
				onDragEnd={(_, info) => {
					if (run.phase !== "active") { x.set(0); return; }
					const horizontal = Math.abs(info.offset.x);
					const vertical = Math.abs(info.offset.y);
					if (horizontal < 90 && vertical < 90) { x.set(0); return; }
					if (vertical > horizontal && info.offset.y < -90) { onAnswer(prompt.expandedOptions[0]); return; }
					if (horizontal >= vertical && info.offset.x > 90) { onAnswer(prompt.expandedOptions[1]); return; }
					if (vertical > horizontal && info.offset.y > 90) { onAnswer(prompt.expandedOptions[2]); return; }
					if (horizontal >= vertical && info.offset.x < -90) { onAnswer(prompt.expandedOptions[3]); return; }
					x.set(0);
				}}
				style={{ x, rotate }}
				className="relative"
				aria-label={`Flag of ${prompt.card.country}`}
			>
				<div style={{ aspectRatio: "4/3", position: "relative", marginTop: 20 }}>
					<Image
						src={prompt.card.flagPath}
						alt={`Flag of ${prompt.card.country}`}
						fill
						priority
						sizes="(max-width: 1024px) 90vw, 660px"
						style={{ objectFit: "cover" }}
					/>
					{/* Drag hint overlays */}
					<div
						style={{
							position: "absolute",
							bottom: 0,
							left: 0,
							right: 0,
							display: "flex",
							justifyContent: "space-between",
							padding: "6px 10px",
							background: "linear-gradient(transparent, rgba(0,0,0,0.5))",
						}}
					>
						<span
							style={{
								background: "rgba(0,0,0,0.7)",
								color: "#fff",
								fontSize: 10,
								padding: "2px 8px",
								border: "1px solid rgba(255,255,255,0.3)",
							}}
						>
							◀ Left
						</span>
						<span
							style={{
								background: "rgba(0,0,0,0.7)",
								color: "#fff",
								fontSize: 10,
								padding: "2px 8px",
								border: "1px solid rgba(255,255,255,0.3)",
							}}
						>
							Right ▶
						</span>
					</div>
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
		<div>
			{/* Result header */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 16,
					marginBottom: 12,
					padding: 12,
					background: isPersonalBest
						? "linear-gradient(to right, #1a6e1a, #a6d9a6)"
						: "linear-gradient(to right, #0a246a, #a6caf0)",
					color: "#fff",
				}}
			>
				<span style={{ fontSize: 48, lineHeight: 1 }}>{timedOut ? "⏱" : isPersonalBest ? "🏆" : "📊"}</span>
				<div>
					<div style={{ fontSize: 11, opacity: 0.85 }}>
						{timedOut ? "Time's Up!" : `${sessionMode === "classic" ? "Classic" : "Timed"} Mode — Session Complete`}
					</div>
					<div style={{ fontSize: 28, fontWeight: "bold" }}>Streak: {run.bestStreak}</div>
					{isPersonalBest && <div style={{ fontSize: 11, color: "#ffe080" }}>★ New Personal Best!</div>}
				</div>
			</div>

			{/* Stats */}
			<div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
				{[
					{ label: "Correct", value: run.correctCount, icon: "✔" },
					{ label: "Misses", value: run.missedCodes.length, icon: "✖" },
					{ label: "All-time Best", value: isPersonalBest ? run.bestStreak : bestStreak, icon: "🏅" },
				].map(({ label, value, icon }) => (
					<div key={label} className="win-sunken" style={{ padding: "8px 12px", textAlign: "center" }}>
						<div style={{ fontSize: 20, marginBottom: 2 }}>{icon}</div>
						<div style={{ fontSize: 20, fontWeight: "bold" }}>{value}</div>
						<div style={{ fontSize: 10, color: "#404040" }}>{label}</div>
					</div>
				))}
			</div>

			<div className="win-separator" />

			{/* Action buttons */}
			<div style={{ display: "flex", justifyContent: "center", gap: 8, paddingTop: 8 }}>
				<button type="button" onClick={onRunAgain} className="win-btn win-btn-primary" style={{ padding: "5px 20px" }}>
					▶ Play Again
				</button>
				<button
					type="button"
					onClick={onReplayMisses}
					disabled={!run.missedCodes.length}
					className="win-btn"
					style={{ padding: "5px 16px" }}
				>
					↺ Replay Misses
				</button>
				<button type="button" onClick={onBack} className="win-btn" style={{ padding: "5px 16px" }}>
					⌂ Main Menu
				</button>
			</div>
		</div>
	);
}

const DIRECTION_LABELS = ["Up", "Right", "Down", "Left"] as const;

const SESSION_MODES: { value: SessionMode; label: string; description: string; icon: string }[] = [
	{
		value: "classic",
		label: "Classic",
		description: "Self-paced rounds with a quick fact after every answer.",
		icon: "🎮",
	},
	{
		value: "timed",
		label: "Timed",
		description: "A 60-second sprint that auto-advances between cards.",
		icon: "⏱",
	},
];

function LivesRow({ lives }: { lives: number }) {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 4 }}>
			<span style={{ fontSize: 10, color: "#404040" }}>Lives:</span>
			{[0, 1, 2].map((index) => (
				<span
					key={index}
					style={{
						fontSize: 14,
						filter: index < lives ? "none" : "grayscale(1) opacity(0.3)",
					}}
				>
					❤
				</span>
			))}
		</div>
	);
}

function dedupeCards(cards: (typeof allCountryCards)[number][]): (typeof allCountryCards)[number][] {
	return Array.from(new Map(cards.map((card) => [card.code, card])).values());
}

function getFunFact(card: PromptState["card"]): string {
	if (card.country[0]?.toLowerCase() === card.capital[0]?.toLowerCase()) {
		return `${card.country} and ${card.capital} start with the same letter.`;
	}
	if (card.capital.includes(" ")) {
		return `${card.capital} is one of the multi-word capitals in the deck.`;
	}
	if (card.capital.length <= 6) {
		return `${card.capital} is one of the shorter capital names you will run into.`;
	}
	return `${card.country} sits in ${card.subregion}.`;
}
