"use client";
import Image from "next/image";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import countriesData from "../../data";
import { Button } from "@components/button";
import getRandomIndices from "@utils/getRandomIndices";
import CurvedLine from "@components/curved-line";
import { SimilarCountriesAndCitiesIndices } from "../page";

export default function Quiz({
	countryIndices,
	similarCountriesAndCitiesIndices,
}: { countryIndices: number[]; similarCountriesAndCitiesIndices: SimilarCountriesAndCitiesIndices }) {
	// navigation logic
	const [selectedCountry, setSelectedCountry] = useState<string>();
	const [selectedCapital, setSelectedCapital] = useState<string>();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);

	// data to display
	const similarCountriesIndices = useMemo(
		() => similarCountriesAndCitiesIndices[currentIndex].similarCountriesIndices,
		[similarCountriesAndCitiesIndices, currentIndex],
	);
	const similarCitiesIndices = useMemo(
		() => similarCountriesAndCitiesIndices[currentIndex].similarCitiesIndices,
		[similarCountriesAndCitiesIndices, currentIndex],
	);
	// TODO: this is just placeholder logic
	// current score
	const [score, setScore] = useState(0);

	const currentCountry = countriesData[countryIndices[currentIndex]];
	const countryData = useMemo(() => [currentCountry.country, ...currentCountry.similarCountries], [currentCountry]);
	const capitalData = useMemo(() => [currentCountry.capital, ...currentCountry.similarCapitals], [currentCountry]);

	// current state of guess
	const isCountryCorrect = selectedCountry === currentCountry.country;

	const handleCountrySelect = (country: string) => {
		setSelectedCountry(country);
	};

	const handleCapitalSelect = (capital: string) => {
		setSelectedCapital(capital);

		const isCapitalCorrect = capital === currentCountry.capital;
		if (isCountryCorrect && isCapitalCorrect) {
			setScore(score + 1);
		}
	};

	const handleSubmit = () => {
		setShowAnswer(true);
	};

	const handleNextFlag = () => {
		if (currentIndex + 1 >= countryIndices.length) return;
		setSelectedCountry(undefined);
		setSelectedCapital(undefined);
		setLineStart(null);
		setLineEnd(null);
		setShowAnswer(false);
		setCurrentIndex(currentIndex + 1);
	};

	const [lineStart, setLineStart] = useState<DOMRect | null>(null);
	const [lineEnd, setLineEnd] = useState<DOMRect | null>(null);

	useLayoutEffect(() => {
		const updatePositions = () => {
			const startIndex = similarCountriesIndices.findIndex((i) => countryData[i] === selectedCountry);

			if (startIndex !== -1) {
				const startElement = document.getElementById(`button-Country-${similarCountriesIndices[startIndex]}`);
				const startPosition = startElement?.getBoundingClientRect();
				!!startPosition && setLineStart(startPosition);
			}

			const endIndex = similarCitiesIndices.findIndex((i) => capitalData[i] === selectedCapital);
			if (endIndex !== -1) {
				const endElement = document.getElementById(`button-Capital-${similarCitiesIndices[endIndex]}`);
				const endPosition = endElement?.getBoundingClientRect();
				!!endPosition && setLineEnd(endPosition);
			}
		};

		updatePositions();

		window.addEventListener("resize", updatePositions);

		return () => {
			window.removeEventListener("resize", updatePositions);
		};
	}, [selectedCountry, selectedCapital, countryData, capitalData, similarCountriesIndices, similarCitiesIndices]);

	return (
		<div className="flex pt-6 sm:pt-16 justify-center min-h-full">
			<div className="flex flex-col items-center gap-10 w-full px-4 sm:w-[400px] ">
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

				<div className="flex w-full gap-14 sm:gap-10 justify-between items-center">
					<Selections
						data={countryData}
						indices={similarCountriesIndices}
						selected={selectedCountry}
						answer={currentCountry.country}
						showAnswer={showAnswer}
						header={"Country"}
						onOptionSelect={(country) => handleCountrySelect(country)}
						updatePosition={(position) => setLineStart(position)}
					/>
					<Selections
						data={capitalData}
						indices={similarCitiesIndices}
						selected={selectedCapital}
						answer={currentCountry.capital}
						showAnswer={showAnswer}
						header={"Capital"}
						onOptionSelect={(capital) => handleCapitalSelect(capital)}
						updatePosition={(position) => setLineEnd(position)}
					/>
					{lineStart && lineEnd && (
						<CurvedLine start={lineStart} end={lineEnd} curveOffsetStart={5} curveOffsetEnd={5} />
					)}
				</div>

				{!showAnswer && <Button onClick={() => handleSubmit()}>Submit</Button>}
				{showAnswer && selectedCountry && selectedCapital && (
					<Button onClick={() => handleNextFlag()}>Next Flag</Button>
				)}
			</div>
		</div>
	);
}

const Selections = ({
	data,
	indices,
	selected,
	answer,
	header,
	onOptionSelect,
	updatePosition,
	showAnswer,
}: {
	data: string[];
	indices: number[];
	selected: string | undefined;
	answer: string;
	header: string;
	onOptionSelect: (selection: string) => void;
	updatePosition: (position: DOMRect) => void;
	showAnswer: boolean;
}) => {
	return (
		<div className="flex flex-col gap-2 items-center w-full">
			<p className="font-bold">{header}</p>
			{indices.map((i) => {
				const option = data[i];
				return (
					<Button
						id={`button-${header}-${i}`}
						className={`w-full py-6 ${
							selected === option
								? showAnswer
									? selected === answer
										? "bg-green-600"
										: "bg-red-600"
									: "bg-blue-600"
								: "hover:bg-[#1A1818]/90"
						}`}
						disabled={showAnswer && selected !== option}
						size={"lg"}
						variant={"default"}
						key={option}
						onClick={(e) => {
							const position = e.currentTarget.getBoundingClientRect();
							onOptionSelect(option);
							updatePosition(position);
						}}
					>
						{option}
					</Button>
				);
			})}
		</div>
	);
};
