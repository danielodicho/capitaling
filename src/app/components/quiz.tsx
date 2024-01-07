"use client";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import countriesData, { CountryData } from "../../data"; // Import the countries data

export default function Quiz({ defaultCountryData }: { defaultCountryData: CountryData }) {
	// States to track the user's selections
	const [selectedCountry, setSelectedCountry] = useState("");
	const [selectedCapital, setSelectedCapital] = useState("");

	const [currentCountryData, setCurrentCountryData] = useState(defaultCountryData);
	const [isCorrect, setIsCorrect] = useState<boolean>(); // null, true, or false

	// Assume the first country is the one to guess for simplicity
	//   const currentCountryData = countriesData[0];

	// Event handlers for selecting country and capital

	// Function to check answers
	// Function to check answers
	const checkAnswers = () => {
		// Check if the selected country and capital match the current country data
		const isCountryCorrect = selectedCountry === currentCountryData.country;
		const isCapitalCorrect = selectedCapital === currentCountryData.capital;
		const isCorrect = isCountryCorrect && isCapitalCorrect;
		// Set the correctness state based on the user's selections
		setIsCorrect(isCorrect);

		// If both guesses are correct, select a new random country
		if (isCorrect) {
			const randomIndex = Math.floor(Math.random() * countriesData.length);
			setCurrentCountryData(countriesData[randomIndex]);
			// Reset selections
			setSelectedCountry("");
			setSelectedCapital("");
		}
	};

	const handleCountrySelect = (country: string) => {
		setSelectedCountry(country);
		setIsCorrect(undefined); // Reset the correctness state
	};

	const handleCapitalSelect = (capital: string) => {
		setSelectedCapital(capital);
		setIsCorrect(undefined); // Reset the correctness state
	};

	const handleNextCountry = () => {
		const randomIndex = Math.floor(Math.random() * countriesData.length);
		setCurrentCountryData(countriesData[randomIndex]);
	};

	const countryData = [currentCountryData.country, ...currentCountryData.similarCountries];
	const capitalData = [currentCountryData.capital, ...currentCountryData.similarCapitals];

	return (
		<div className="flex items-center justify-center min-h-full">
			<div className="flex flex-col items-center gap-10">
				<Image
					src={currentCountryData.flagImage}
					width={0}
					height={0}
					alt={`Flag of ${currentCountryData.country}`}
					sizes="100vw"
					priority={true}
					className="w-full h-auto border border-black"
				/>

				<div className="flex gap-2">
					<Selections
						data={countryData}
						selected={selectedCountry}
						header={"Country"}
						handleSelect={handleCountrySelect}
					/>
					<Selections
						data={capitalData}
						selected={selectedCapital}
						header={"Capital"}
						handleSelect={handleCapitalSelect}
					/>
				</div>

				<button
					className="border w-44 rounded-md px-4 py-3 hover:bg-blue-500 hover:text-white"
					type="button"
					onClick={checkAnswers}
				>
					Check Answers
				</button>
				{isCorrect !== undefined && <div>{isCorrect ? "Correct! Next country!" : "Incorrect, try again!"}</div>}
			</div>
		</div>
	);
}

const Selections = ({
	data,
	handleSelect,
	selected,
	header,
}: { data: string[]; handleSelect: (selection: string) => void; selected: string; header: string }) => {
	return (
		<div className="flex flex-col gap-2 items-center">
			<p className="font-bold">{header}</p>
			{data.map((option) => (
				<button
					className={`border w-32 rounded-md px-4 py-3 ${selected === option ? "bg-blue-600 text-white" : ""}`}
					type="button"
					key={option}
					onClick={() => handleSelect(option)}
				>
					{option}
				</button>
			))}
		</div>
	);
};

// function shuffleArray(arr: string[]): string[] {
// 	// Create a copy of the array to avoid modifying the original array
// 	const arrayCopy = [...arr];

// 	for (let i = arrayCopy.length - 1; i > 0; i--) {
// 		// Generate a random index
// 		const j = Math.floor(Math.random() * (i + 1));

// 		// Swap elements at indices i and j
// 		[arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
// 	}

// 	return arrayCopy;
// }
