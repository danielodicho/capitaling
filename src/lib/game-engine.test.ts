import assert from "node:assert/strict";
import test from "node:test";

import type { CountryCard } from "@/lib/game-data";
import {
	LIVES_PER_RUN,
	type RunState,
	advanceAfterReveal,
	applyAnswerResolution,
	buildPromptOptions,
	createRun,
	evaluateAnswer,
	expandPrompt,
} from "@/lib/game-engine";

const cards: CountryCard[] = [
	{
		code: "hr",
		country: "Croatia",
		capital: "Zagreb",
		region: "Europe",
		subregion: "Southeast Europe",
		flagPath: "/images/svg/hr.svg",
		location: { lat: 45.1, lng: 15.2 },
		countryShapeId: "191",
	},
	{
		code: "si",
		country: "Slovenia",
		capital: "Ljubljana",
		region: "Europe",
		subregion: "Southeast Europe",
		flagPath: "/images/svg/si.svg",
		location: { lat: 46.1, lng: 14.8 },
		countryShapeId: "705",
	},
	{
		code: "at",
		country: "Austria",
		capital: "Vienna",
		region: "Europe",
		subregion: "Central Europe",
		flagPath: "/images/svg/at.svg",
		location: { lat: 47.5, lng: 14.6 },
		countryShapeId: "040",
	},
	{
		code: "hu",
		country: "Hungary",
		capital: "Budapest",
		region: "Europe",
		subregion: "Central Europe",
		flagPath: "/images/svg/hu.svg",
		location: { lat: 47.1, lng: 19.5 },
		countryShapeId: "348",
	},
	{
		code: "sk",
		country: "Slovakia",
		capital: "Bratislava",
		region: "Europe",
		subregion: "Central Europe",
		flagPath: "/images/svg/sk.svg",
		location: { lat: 48.7, lng: 19.7 },
		countryShapeId: "703",
	},
];

test("buildPromptOptions returns unique choices including the correct capital", () => {
	const prompt = buildPromptOptions(cards[0], cards);

	assert.equal(new Set(prompt.collapsedOptions).size, 2);
	assert.equal(new Set(prompt.expandedOptions).size, 4);
	assert.ok(prompt.collapsedOptions.includes("Zagreb"));
	assert.ok(prompt.expandedOptions.includes("Zagreb"));
});

test("wrong answers cost a life and queue the card for review", () => {
	let run = createRun({ pool: cards, optionPool: cards, regionFilter: "Europe" });
	const wrongOption = run.currentPrompt?.collapsedOptions.find((option) => option !== run.currentPrompt?.card.capital);
	assert.ok(wrongOption);

	const resolution = evaluateAnswer(run, wrongOption);
	run = applyAnswerResolution(run, resolution, "learning");

	assert.equal(run.lives, LIVES_PER_RUN - 1);
	assert.equal(run.reviewQueue.length, 1);
	assert.equal(run.phase, "reveal");
});

test("expanding choices removes the perfect-answer bonus", () => {
	let run = createRun({ pool: cards, optionPool: cards, regionFilter: "Europe" });
	run = expandPrompt(run);

	const correctCapital = run.currentPrompt?.card.capital;
	assert.ok(correctCapital);

	const resolution = evaluateAnswer(run, correctCapital);
	assert.equal(resolution.perfect, false);
	assert.equal(resolution.xpAwarded, 20);
});

test("review cards resurface after the configured interval", () => {
	let run: RunState = createRun({ pool: cards, optionPool: cards, regionFilter: "Europe" });

	const firstWrong = run.currentPrompt?.collapsedOptions.find((option) => option !== run.currentPrompt?.card.capital);
	assert.ok(firstWrong);
	run = applyAnswerResolution(run, evaluateAnswer(run, firstWrong), "learning");
	run = advanceAfterReveal(run);

	for (let count = 0; count < 3; count += 1) {
		const correct = run.currentPrompt?.card.capital;
		assert.ok(correct);
		run = applyAnswerResolution(run, evaluateAnswer(run, correct), "solid");
		run = advanceAfterReveal(run);
	}

	assert.equal(run.currentPrompt?.source, "review");
});
