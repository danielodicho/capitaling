import countriesData from "../data"; // Import the countries data
import Quiz from "./components/quiz";

export default function Page() {
	const selectRandomCountry = () => {
		const randomIndex = Math.floor(Math.random() * countriesData.length);
		return countriesData[randomIndex];
	};

	const defaultCountryData = selectRandomCountry();

	return <Quiz defaultCountryData={defaultCountryData} />;
}

export const dynamic = "force-dynamic";
