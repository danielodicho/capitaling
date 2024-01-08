import countriesData from "../data"; // Import the countries data
import Quiz from "./components/quiz";
import getRandomIndices from "@utils/getRandomIndices";

export default function Page() {
	const numOfFlags = 5;
	const countryIndices = getRandomIndices(countriesData.length, numOfFlags);
	const similarCountriesAndCitiesIndices: SimilarCountriesAndCitiesIndices = [];

	for (let i = 0; i < numOfFlags; i++) {
		const similarCountriesIndices = getRandomIndices(4, 4);
		const similarCitiesIndices = getRandomIndices(4, 4);
		similarCountriesAndCitiesIndices.push({ similarCountriesIndices, similarCitiesIndices });
	}

	return <Quiz countryIndices={countryIndices} similarCountriesAndCitiesIndices={similarCountriesAndCitiesIndices} />;
}

export const dynamic = "force-dynamic";

export type SimilarCountriesAndCitiesIndices = { similarCountriesIndices: number[]; similarCitiesIndices: number[] }[];
