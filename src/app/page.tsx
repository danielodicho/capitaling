import countriesData from "../data"; // Import the countries data
import Quiz from "./components/quiz";
import getRandomIndices from "@utils/getRandomIndices";

import countriesData from "../data"; // Import the countries data
import Quiz from "./components/quiz";
import getRandomIndices from "@utils/getRandomIndices";
import { useState } from "react";
import { Settings } from "./components/settings";

export default function Page() {
	const [flagsPerQuiz, setFlagsPerQuiz] = useState<number>(5)
	const countryIndices = getRandomIndices(countriesData.length, flagsPerQuiz);
	const similarCountriesAndCitiesIndices: SimilarCountriesAndCitiesIndices = [];
	const [showSettings, setShowSettings] = useState(false);

	for (let i = 0; i < flagsPerQuiz; i++) {
		const similarCountriesIndices = getRandomIndices(4, 4);
		const similarCitiesIndices = getRandomIndices(4, 4);
		similarCountriesAndCitiesIndices.push({ similarCountriesIndices, similarCitiesIndices });
	}

	return (
	<>
	<Settings show={showSettings} flagsPerQuiz={flagsPerQuiz} setFlagsPerQuiz={setFlagsPerQuiz} />
	<Quiz countryIndices={countryIndices} similarCountriesAndCitiesIndices={similarCountriesAndCitiesIndices} setShowSettings={setShowSettings} />
	</>
	)
}

export const dynamic = "force-dynamic";

export type SimilarCountriesAndCitiesIndices = { similarCountriesIndices: number[]; similarCitiesIndices: number[] }[];
export const dynamic = "force-dynamic";

export type SimilarCountriesAndCitiesIndices = { similarCountriesIndices: number[]; similarCitiesIndices: number[] }[];
