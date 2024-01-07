"use client";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import countriesData from "../../data"; // Import the countries data
import styles from "./quiz.module.css";

type CountryData = {
	country: string;
	capital: string;
	flagImage: string;
	similarCountries: string[];
	similarCapitals: string[];
};

export default function Quiz({ defaultCountryData }: { defaultCountryData: CountryData }) {
	// States to track the user's selections
	const [selectedCountry, setSelectedCountry] = useState<string>();
	const [selectedCapital, setSelectedCapital] = useState<string>();

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
			setSelectedCountry(undefined);
			setSelectedCapital(undefined);
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

	const resultClassNames = `${styles.result} ${isCorrect ? styles.correct : styles.incorrect}`;

	return (
		<div className={styles.container}>
			<Image
				width={500}
				height={500}
				src={currentCountryData.flagImage}
				alt={`Flag of ${currentCountryData.country}`}
				className={"border-4 border-black"}
			/>

			<div className={styles.optionsContainer}>
				<div className={styles.column}>
					{[currentCountryData.country, ...currentCountryData.similarCountries].map((country) => (
						<button
							type="button"
							key={country}
							className={`${styles.option} ${selectedCountry === country ? styles.selected : ""}`}
							onClick={() => handleCountrySelect(country)}
						>
							{country}
						</button>
					))}
				</div>
				<div className={styles.column}>
					{[currentCountryData.capital, ...currentCountryData.similarCapitals].map((capital) => (
						<button
							type="button"
							key={capital}
							className={`${styles.option} ${selectedCapital === capital ? styles.selected : ""}`}
							onClick={() => handleCapitalSelect(capital)}
						>
							{capital}
						</button>
					))}
				</div>
			</div>
			<button type="button" onClick={checkAnswers} className={styles.submitButton}>
				Check Answers
			</button>
			{isCorrect !== null && (
				<div className={resultClassNames}>
					{isCorrect ? "Correct! Next country!" : "Incorrect, try again!"}
				</div>
			)}
		</div>
	);
}
