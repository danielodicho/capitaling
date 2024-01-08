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
	const [selectedCountry, setSelectedCountry] = useState("");
	const [selectedCapital, setSelectedCapital] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [similarCountriesIndices, setSimilarCountriesIndices] = useState(() => initialSimilarCountriesIndices);
	const [similarCitiesIndices, setSimilarCitiesIndices] = useState(() => initialSimilarCitiesIndices);
	const [isCorrect, setIsCorrect] = useState<boolean>();

	const currentCountry = countriesData[countryIndices[currentIndex]];
	const countryData = [currentCountry.country, ...currentCountry.similarCountries];
	const capitalData = [currentCountry.capital, ...currentCountry.similarCapitals];

	const checkAnswers = () => {
		const isCountryCorrect = selectedCountry === currentCountry.country;
		const isCapitalCorrect = selectedCapital === currentCountry.capital;
		const isCorrect = isCountryCorrect && isCapitalCorrect;

		setIsCorrect(isCorrect);

		if (isCorrect) {
			// TODO: temp block so that we don't go out of bounds
			// this condition returns if it is the last question
			if (currentIndex >= countryIndices.length - 1) return;
			setCurrentIndex(currentIndex + 1);
			setSelectedCountry("");
			setSelectedCapital("");
		}
	};

	const handleCountrySelect = (country: string) => {
		setSelectedCountry(country);
		setIsCorrect(undefined);
	};

	const handleCapitalSelect = (capital: string) => {
		setSelectedCapital(capital);
		setIsCorrect(undefined);
	};

	return (
		<div className="flex pt-16 justify-center min-h-full">
			<div className="flex flex-col items-center gap-10">
				<div className="h-48">
					<Image
						src={currentCountry.flagImage}
						width={0}
						height={0}
						alt={`Flag of ${currentCountry.country}`}
						sizes="100vw"
						priority={true}
						className="w-full h-auto border border-black"
					/>
				</div>

				<div className="flex gap-2">
					<Selections
						data={countryData}
						indices={similarCountriesIndices}
						selected={selectedCountry}
						header={"Country"}
						handleSelect={handleCountrySelect}
					/>
					<Selections
						data={capitalData}
						indices={similarCitiesIndices}
						selected={selectedCapital}
						header={"Capital"}
						handleSelect={handleCapitalSelect}
					/>
				</div>

				<Button type="button" onPress={() => checkAnswers()}>
					Check Answers
				</Button>
			</div>
		</div>
	);
}

const Selections = ({
	data,
	indices,
	handleSelect,
	selected,
	header,
}: {
	data: string[];
	indices: number[];
	handleSelect: (selection: string) => void;
	selected: string;
	header: string;
}) => {
	return (
		<div className="flex flex-col gap-2 items-center">
			<p className="font-bold">{header}</p>
			{indices.map((i) => {
				const option = data[i];
				return (
					<Button
						className={`w-32 ${selected === option ? "bg-blue-600" : "hover:bg-[#1A1818]/90"}`}
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
