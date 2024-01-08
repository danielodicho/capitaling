"use client";
import Image from "next/image";
import React, { useState } from "react";
import countriesData from "../../data";
import { Button } from "@components/button";
import getRandomIndices from "odicho/utils/getRandomIndices";

export default function Quiz({
	countryIndices,
	initialSimilarCountriesIndices,
	initialSimilarCitiesIndices,
}: { countryIndices: number[]; initialSimilarCountriesIndices: number[]; initialSimilarCitiesIndices: number[] }) {
	// navigation logic
	const [selectedCountry, setSelectedCountry] = useState<string>();
	const [selectedCapital, setSelectedCapital] = useState<string>();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showCapitalGuess, setShowCapitalGuess] = useState(false);

	// data to display
	const [similarCountriesIndices, setSimilarCountriesIndices] = useState(() => initialSimilarCountriesIndices);
	const [similarCitiesIndices, setSimilarCitiesIndices] = useState(() => initialSimilarCitiesIndices);

	// TODO: this is just placeholder logic
	// current score
	const [score, setScore] = useState(0);

	const currentCountry = countriesData[countryIndices[currentIndex]];
	const countryData = [currentCountry.country, ...currentCountry.similarCountries];
	const capitalData = [currentCountry.capital, ...currentCountry.similarCapitals];

	// current state of guess
	const isCountryCorrect = selectedCountry === currentCountry.country;

	const handleCountrySelect = (country: string) => {
		if (selectedCountry) return;
		setSelectedCountry(country);
	};

	const handleCapitalSelect = (capital: string) => {
		if (selectedCapital) return;
		setSelectedCapital(capital);

		const isCapitalCorrect = capital === currentCountry.capital;
		if (isCountryCorrect && isCapitalCorrect) {
			setScore(score + 1);
		}
	};

	const handleNextFlag = () => {
		if (currentIndex + 1 >= countryIndices.length) return;
		setSelectedCountry(undefined);
		setSelectedCapital(undefined);
		setShowCapitalGuess(false);
		setCurrentIndex(currentIndex + 1);
	};

	return (
		<div className="flex pt-6 md:pt-16 justify-center min-h-full">
			<div className="flex flex-col items-center gap-10 w-full px-4 md:w-[400px] ">
				<p className="font-bold">
					{score} / {countryIndices.length}
				</p>
				<div className="relative w-full h-56">
					<Image
						fill
						src={currentCountry.flagImage}
						width={0}
						height={0}
						sizes="100vw"
						alt={`Flag of ${currentCountry.country}`}
						priority={true}
						className="border border-black object-cover"
					/>
				</div>

				{!showCapitalGuess ? (
					<Selections
						data={countryData}
						indices={similarCountriesIndices}
						handleSelect={handleCountrySelect}
						selected={selectedCountry}
						answer={currentCountry.country}
						header={"Country"}
					/>
				) : (
					<Selections
						data={capitalData}
						indices={similarCitiesIndices}
						handleSelect={handleCapitalSelect}
						selected={selectedCapital}
						answer={currentCountry.capital}
						header={"Capital"}
					/>
				)}

				{isCountryCorrect && !showCapitalGuess && (
					<Button onPress={() => setShowCapitalGuess(true)}>Guess Capital</Button>
				)}
				{(!!selectedCapital || (selectedCountry && !isCountryCorrect)) && (
					<Button onPress={() => handleNextFlag()}>Next Flag</Button>
				)}
			</div>
		</div>
	);
}

const Selections = ({
	data,
	indices,
	handleSelect,
	selected,
	answer,
	header,
}: {
	data: string[];
	indices: number[];
	handleSelect: (selection: string) => void;
	selected: string | undefined;
	answer: string;
	header: string;
}) => {
	return (
		<div className="flex flex-col gap-2 items-center w-full">
			<p className="font-bold">{header}</p>
			{indices.map((i) => {
				const option = data[i];
				return (
					<Button
						className={`w-full py-6 ${
							selected === option ? (selected === answer ? "bg-green-600" : "bg-red-600") : "hover:bg-[#1A1818]/90"
						}`}
						isDisabled={!!selected && selected !== option}
						size={"lg"}
						variant={"default"}
						key={option}
						onPress={() => handleSelect(option)}
					>
						{option}
					</Button>
				);
			})}
		</div>
	);
};
