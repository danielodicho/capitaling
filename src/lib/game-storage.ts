import type { CountryCard } from "@/lib/game-data";

export const PROFILE_STORAGE_KEY = "capitaling/profile:v1";
const CURRENT_VERSION = 1;

export type MasteryTier = "learning" | "solid" | "mastered";

export type CountryMastery = {
	score: number;
	correct: number;
	incorrect: number;
	lastSeenAt: number;
	lastResult: "correct" | "incorrect";
};

export type PlayerProgress = {
	version: number;
	totalXp: number;
	runsPlayed: number;
	totalCorrect: number;
	totalIncorrect: number;
	bestStreak: number;
	mastery: Record<string, CountryMastery>;
	recentMisses: string[];
	lastPlayedAt: number | null;
};

export type BadgeDefinition = {
	id: string;
	label: string;
	kicker: string;
};

export type RegionProgressSummary = {
	totalCards: number;
	practicedCards: number;
	learningCards: number;
	solidCards: number;
	masteredCards: number;
	accuracy: number;
};

const BADGE_LIBRARY: BadgeDefinition[] = [
	{ id: "first-run", label: "First Spin", kicker: "Play your first run" },
	{ id: "ten-streak", label: "Hot Hands", kicker: "Hit a 10-answer streak" },
	{ id: "hundred-correct", label: "Capital Collector", kicker: "Answer 100 cards correctly" },
	{ id: "ten-mastered", label: "Atlas Memory", kicker: "Master 10 countries" },
	{ id: "fifty-mastered", label: "World Builder", kicker: "Master 50 countries" },
];

export function createEmptyProgress(): PlayerProgress {
	return {
		version: CURRENT_VERSION,
		totalXp: 0,
		runsPlayed: 0,
		totalCorrect: 0,
		totalIncorrect: 0,
		bestStreak: 0,
		mastery: {},
		recentMisses: [],
		lastPlayedAt: null,
	};
}

export function getMasteryTier(score: number): MasteryTier {
	if (score >= 5) {
		return "mastered";
	}

	if (score >= 2) {
		return "solid";
	}

	return "learning";
}

export function getLevelFromXp(totalXp: number): number {
	return Math.floor(totalXp / 180) + 1;
}

export function getLevelProgress(totalXp: number) {
	const level = getLevelFromXp(totalXp);
	const levelStartXp = (level - 1) * 180;
	const nextLevelXp = level * 180;
	const levelSpan = nextLevelXp - levelStartXp;

	return {
		level,
		currentLevelXp: totalXp - levelStartXp,
		nextLevelXp,
		levelSpan,
		progress: Math.max(0, Math.min(1, (totalXp - levelStartXp) / levelSpan)),
	};
}

export function loadProgress(): PlayerProgress {
	if (typeof window === "undefined") {
		return createEmptyProgress();
	}

	try {
		const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
		if (!raw) {
			return createEmptyProgress();
		}

		const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
		return {
			...createEmptyProgress(),
			...parsed,
			version: CURRENT_VERSION,
			mastery: parsed.mastery ?? {},
			recentMisses: Array.isArray(parsed.recentMisses) ? parsed.recentMisses.slice(0, 12) : [],
		};
	} catch (error) {
		console.error("Failed to load Capitaling profile", error);
		return createEmptyProgress();
	}
}

export function saveProgress(profile: PlayerProgress) {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function recordRunStart(profile: PlayerProgress): PlayerProgress {
	return {
		...profile,
		runsPlayed: profile.runsPlayed + 1,
		lastPlayedAt: Date.now(),
	};
}

export function recordAnswerOnProfile(
	profile: PlayerProgress,
	input: {
		card: CountryCard;
		correct: boolean;
		xpAwarded: number;
		runBestStreak: number;
	},
): PlayerProgress {
	const previous = profile.mastery[input.card.code] ?? {
		score: 0,
		correct: 0,
		incorrect: 0,
		lastSeenAt: 0,
		lastResult: "incorrect" as const,
	};

	const nextScore = Math.max(0, Math.min(6, previous.score + (input.correct ? 1 : -1)));
	const masteryRecord: CountryMastery = {
		score: nextScore,
		correct: previous.correct + (input.correct ? 1 : 0),
		incorrect: previous.incorrect + (input.correct ? 0 : 1),
		lastSeenAt: Date.now(),
		lastResult: input.correct ? "correct" : "incorrect",
	};

	return {
		...profile,
		totalXp: profile.totalXp + input.xpAwarded,
		totalCorrect: profile.totalCorrect + (input.correct ? 1 : 0),
		totalIncorrect: profile.totalIncorrect + (input.correct ? 0 : 1),
		bestStreak: Math.max(profile.bestStreak, input.runBestStreak),
		mastery: {
			...profile.mastery,
			[input.card.code]: masteryRecord,
		},
		recentMisses: input.correct
			? profile.recentMisses
			: dedupeCodes([input.card.code, ...profile.recentMisses]).slice(0, 12),
	};
}

export function getUnlockedBadges(profile: PlayerProgress): BadgeDefinition[] {
	const masteredCount = Object.values(profile.mastery).filter(
		(entry) => getMasteryTier(entry.score) === "mastered",
	).length;

	return BADGE_LIBRARY.filter((badge) => {
		switch (badge.id) {
			case "first-run":
				return profile.runsPlayed >= 1;
			case "ten-streak":
				return profile.bestStreak >= 10;
			case "hundred-correct":
				return profile.totalCorrect >= 100;
			case "ten-mastered":
				return masteredCount >= 10;
			case "fifty-mastered":
				return masteredCount >= 50;
			default:
				return false;
		}
	});
}

export function getAccuracy(correct: number, incorrect: number): number {
	const total = correct + incorrect;
	if (!total) {
		return 0;
	}

	return correct / total;
}

export function getRegionProgressSummary(cards: CountryCard[], profile: PlayerProgress): RegionProgressSummary {
	let practicedCards = 0;
	let learningCards = 0;
	let solidCards = 0;
	let masteredCards = 0;
	let correct = 0;
	let incorrect = 0;

	for (const card of cards) {
		const mastery = profile.mastery[card.code];
		if (!mastery) {
			continue;
		}

		practicedCards += 1;
		correct += mastery.correct;
		incorrect += mastery.incorrect;

		const tier = getMasteryTier(mastery.score);
		if (tier === "mastered") {
			masteredCards += 1;
		} else if (tier === "solid") {
			solidCards += 1;
		} else {
			learningCards += 1;
		}
	}

	return {
		totalCards: cards.length,
		practicedCards,
		learningCards,
		solidCards,
		masteredCards,
		accuracy: getAccuracy(correct, incorrect),
	};
}

export function getMasteryLabel(profile: PlayerProgress, code: string): MasteryTier {
	return getMasteryTier(profile.mastery[code]?.score ?? 0);
}

export function getRecentMissCards(cards: CountryCard[], profile: PlayerProgress): CountryCard[] {
	const cardsByCode = new Map(cards.map((card) => [card.code, card]));
	return profile.recentMisses.map((code) => cardsByCode.get(code)).filter((card): card is CountryCard => Boolean(card));
}

function dedupeCodes(codes: string[]): string[] {
	return Array.from(new Set(codes));
}
