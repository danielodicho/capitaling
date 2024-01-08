import countriesData from "../data"; // Import the countries data
import Quiz from "./components/quiz";
import getRandomIndices from "@utils/getRandomIndices";

export default function Page() {
	const countryIndices = getRandomIndices(countriesData.length, 5);
	const similarCountriesIndices = getRandomIndices(4, 4);
	const similarCitiesIndices = getRandomIndices(4, 4);

	return <Quiz countryIndices={countryIndices} />;
}

export const dynamic = "force-dynamic";
