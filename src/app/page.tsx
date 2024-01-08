import countriesData from "../data"; // Import the countries data
import Quiz from "./components/quiz";
import getRandomIndices from "@utils/getRandomIndices";

export default function Page() {
	const countryIndices = getRandomIndices(countriesData.length, 5);
	const initialSimilarCountriesIndices = getRandomIndices(4, 4);
	const initialSimilarCitiesIndices = getRandomIndices(4, 4);

	return (
		<Quiz
			countryIndices={countryIndices}
			initialSimilarCountriesIndices={initialSimilarCountriesIndices}
			initialSimilarCitiesIndices={initialSimilarCitiesIndices}
		/>
	);
}

export const dynamic = "force-dynamic";
