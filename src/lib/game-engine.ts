import { type CountryCard, type RegionFilter, allCountryCards, getRegionLabel } from "@/lib/game-data";
import type { MasteryTier } from "@/lib/game-storage";

export const LIVES_PER_RUN = 3;
const BASE_XP = 20;
const PERFECT_BONUS = 10;
const REVIEW_BONUS = 5;
const REVIEW_INTERVAL = 4;

export type PromptSource = "main" | "review";
export type RunMode = "standard" | "review";

export type PromptState = {
	card: CountryCard;
	collapsedOptions: [string, string];
	expandedOptions: [string, string, string, string];
	isExpanded: boolean;
	source: PromptSource;
};

export type RevealState = {
	correct: boolean;
	selectedCapital: string;
	correctCapital: string;
	masteryTier: MasteryTier;
	xpAwarded: number;
	perfect: boolean;
	source: PromptSource;
};

export type RunState = {
	mode: RunMode;
	label: string;
	regionFilter: RegionFilter | "review";
	phase: "active" | "reveal" | "summary";
	lives: number;
	streak: number;
	bestStreak: number;
	correctCount: number;
	incorrectCount: number;
	answeredCount: number;
	perfectCount: number;
	reviewCount: number;
	xpEarned: number;
	pool: CountryCard[];
	optionPool: CountryCard[];
	deck: CountryCard[];
	reviewQueue: CountryCard[];
	currentPrompt: PromptState | null;
	reveal: RevealState | null;
	missedCodes: string[];
};

export type AnswerResolution = {
	correct: boolean;
	selectedCapital: string;
	correctCapital: string;
	perfect: boolean;
	xpAwarded: number;
	nextStreak: number;
	nextBestStreak: number;
	nextLives: number;
	promptSource: PromptSource;
};

export function createRun(input: {
	pool: CountryCard[];
	optionPool?: CountryCard[];
	regionFilter: RegionFilter | "review";
	mode?: RunMode;
	label?: string;
}): RunState {
	const run: RunState = {
		mode: input.mode ?? "standard",
		label: input.label ?? getRegionLabel(input.regionFilter),
		regionFilter: input.regionFilter,
		phase: "active",
		lives: LIVES_PER_RUN,
		streak: 0,
		bestStreak: 0,
		correctCount: 0,
		incorrectCount: 0,
		answeredCount: 0,
		perfectCount: 0,
		reviewCount: 0,
		xpEarned: 0,
		pool: input.pool,
		optionPool: input.optionPool && input.optionPool.length >= 4 ? input.optionPool : allCountryCards,
		deck: shuffleCards(input.pool),
		reviewQueue: [],
		currentPrompt: null,
		reveal: null,
		missedCodes: [],
	};

	return drawNextPrompt(run);
}

export function expandPrompt(run: RunState): RunState {
	if (!run.currentPrompt || run.currentPrompt.isExpanded) {
		return run;
	}

	return {
		...run,
		currentPrompt: {
			...run.currentPrompt,
			isExpanded: true,
		},
	};
}

export function evaluateAnswer(run: RunState, selectedCapital: string): AnswerResolution {
	const prompt = assertPrompt(run);
	const correct = selectedCapital === prompt.card.capital;
	const perfect = correct && !prompt.isExpanded;
	const nextStreak = correct ? run.streak + 1 : 0;
	const nextBestStreak = Math.max(run.bestStreak, nextStreak);
	const streakBonus = correct ? Math.min(20, Math.floor(nextStreak / 3) * 5) : 0;
	const reviewBonus = correct && prompt.source === "review" ? REVIEW_BONUS : 0;
	const xpAwarded = correct ? BASE_XP + streakBonus + reviewBonus + (perfect ? PERFECT_BONUS : 0) : 0;

	return {
		correct,
		selectedCapital,
		correctCapital: prompt.card.capital,
		perfect,
		xpAwarded,
		nextStreak,
		nextBestStreak,
		nextLives: correct ? run.lives : Math.max(0, run.lives - 1),
		promptSource: prompt.source,
	};
}

export function applyAnswerResolution(run: RunState, resolution: AnswerResolution, masteryTier: MasteryTier): RunState {
	const prompt = assertPrompt(run);
	const missedCodes = resolution.correct ? run.missedCodes : dedupeCodes([prompt.card.code, ...run.missedCodes]);

	return {
		...run,
		phase: "reveal",
		lives: resolution.nextLives,
		streak: resolution.nextStreak,
		bestStreak: resolution.nextBestStreak,
		correctCount: run.correctCount + (resolution.correct ? 1 : 0),
		incorrectCount: run.incorrectCount + (resolution.correct ? 0 : 1),
		answeredCount: run.answeredCount + 1,
		perfectCount: run.perfectCount + (resolution.perfect ? 1 : 0),
		reviewCount: run.reviewCount + (prompt.source === "review" ? 1 : 0),
		xpEarned: run.xpEarned + resolution.xpAwarded,
		reviewQueue: resolution.correct ? run.reviewQueue : enqueueReviewCard(run.reviewQueue, prompt.card),
		reveal: {
			correct: resolution.correct,
			selectedCapital: resolution.selectedCapital,
			correctCapital: resolution.correctCapital,
			masteryTier,
			xpAwarded: resolution.xpAwarded,
			perfect: resolution.perfect,
			source: resolution.promptSource,
		},
		missedCodes,
	};
}

export function advanceAfterReveal(run: RunState): RunState {
	if (run.phase !== "reveal") {
		return run;
	}

	if (run.lives <= 0) {
		return {
			...run,
			phase: "summary",
			currentPrompt: null,
		};
	}

	return drawNextPrompt({
		...run,
		phase: "active",
		reveal: null,
	});
}

export function buildPromptOptions(
	card: CountryCard,
	optionPool: CountryCard[],
): {
	collapsedOptions: [string, string];
	expandedOptions: [string, string, string, string];
} {
	const distractors = selectDistractors(card, optionPool, 3);
	const expandedOptions = shuffleStrings([card.capital, ...distractors.map((candidate) => candidate.capital)]);
	const primaryDistractor =
		distractors[0]?.capital ?? expandedOptions.find((option) => option !== card.capital) ?? card.capital;
	const collapsedOptions = shuffleStrings([card.capital, primaryDistractor]);

	return {
		collapsedOptions: collapsedOptions as [string, string],
		expandedOptions: expandedOptions as [string, string, string, string],
	};
}

function drawNextPrompt(run: RunState): RunState {
	if (!run.pool.length) {
		return {
			...run,
			phase: "summary",
			currentPrompt: null,
		};
	}

	const shouldReview = run.reviewQueue.length > 0 && run.answeredCount > 0 && run.answeredCount % REVIEW_INTERVAL === 0;
	let deck = [...run.deck];
	const reviewQueue = [...run.reviewQueue];
	let source: PromptSource = "main";
	let card: CountryCard | undefined;

	if (shouldReview) {
		card = reviewQueue.shift();
		source = "review";
	} else {
		if (!deck.length) {
			deck = shuffleCards(run.pool);
		}

		card = deck.shift();
	}

	if (!card) {
		return {
			...run,
			phase: "summary",
			currentPrompt: null,
		};
	}

	const options = buildPromptOptions(card, run.optionPool);

	return {
		...run,
		deck,
		reviewQueue,
		currentPrompt: {
			card,
			collapsedOptions: options.collapsedOptions,
			expandedOptions: options.expandedOptions,
			isExpanded: false,
			source,
		},
	};
}

function selectDistractors(card: CountryCard, optionPool: CountryCard[], count: number): CountryCard[] {
	const deduped = new Map<string, CountryCard>();
	for (const candidate of optionPool) {
		if (candidate.code === card.code || candidate.capital === card.capital) {
			continue;
		}

		if (!deduped.has(candidate.capital)) {
			deduped.set(candidate.capital, candidate);
		}
	}

	return Array.from(deduped.values())
		.map((candidate) => ({
			candidate,
			score: scoreDistractor(card, candidate) + Math.random(),
		}))
		.sort((left, right) => right.score - left.score)
		.slice(0, count)
		.map((entry) => entry.candidate);
}

function scoreDistractor(current: CountryCard, candidate: CountryCard): number {
	const currentCapital = normalizeText(current.capital);
	const candidateCapital = normalizeText(candidate.capital);
	const sharedStart = currentCapital.slice(0, 2) === candidateCapital.slice(0, 2);
	const sharedEnding = currentCapital.slice(-2) === candidateCapital.slice(-2);

	let score = 0;

	if (current.region === candidate.region) {
		score += 35;
	}

	if (current.subregion === candidate.subregion) {
		score += 50;
	}

	if (currentCapital[0] === candidateCapital[0]) {
		score += 12;
	}

	if (sharedStart) {
		score += 10;
	}

	if (sharedEnding) {
		score += 8;
	}

	score += Math.max(0, 8 - Math.abs(currentCapital.length - candidateCapital.length));
	score += longestCommonChunk(currentCapital, candidateCapital) * 2;

	return score;
}

function longestCommonChunk(left: string, right: string): number {
	let best = 0;

	for (let start = 0; start < left.length; start += 1) {
		for (let offset = 0; offset < right.length; offset += 1) {
			let width = 0;
			while (left[start + width] && left[start + width] === right[offset + width]) {
				width += 1;
			}
			best = Math.max(best, width);
		}
	}

	return best;
}

function normalizeText(value: string): string {
	return value.toLowerCase().replace(/[^a-z]/g, "");
}

function shuffleCards(cards: CountryCard[]): CountryCard[] {
	const shuffled = [...cards];
	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
	}
	return shuffled;
}

function shuffleStrings(values: string[]): string[] {
	const shuffled = [...values];
	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const swapIndex = Math.floor(Math.random() * (index + 1));
		[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
	}
	return shuffled;
}

function enqueueReviewCard(queue: CountryCard[], card: CountryCard): CountryCard[] {
	if (queue.some((entry) => entry.code === card.code)) {
		return queue;
	}

	return [...queue, card];
}

function assertPrompt(run: RunState): PromptState {
	if (!run.currentPrompt) {
		throw new Error("Run has no active prompt.");
	}

	return run.currentPrompt;
}

function dedupeCodes(codes: string[]): string[] {
	return Array.from(new Set(codes));
}
