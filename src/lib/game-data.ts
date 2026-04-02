import { type CountryCardData, countryCardData } from "@/lib/country-card-data";

export const GAME_REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania"] as const;

export type RegionKey = (typeof GAME_REGIONS)[number];
export type RegionFilter = RegionKey | "all";

export type CountryCard = CountryCardData;

type RegionFilterOption = {
	value: RegionFilter;
	label: string;
	count: number;
};

export const allCountryCards = [...countryCardData].sort((left, right) => left.country.localeCompare(right.country));

export const countryCardsByCode = Object.fromEntries(allCountryCards.map((card) => [card.code, card]));

export const regionFilterOptions: RegionFilterOption[] = [
	{ value: "all", label: "World Tour", count: allCountryCards.length },
	...GAME_REGIONS.map((region) => ({
		value: region,
		label: region,
		count: allCountryCards.filter((card) => card.region === region).length,
	})),
];

export function getCardsForRegion(regionFilter: RegionFilter): CountryCard[] {
	if (regionFilter === "all") {
		return allCountryCards;
	}

	return allCountryCards.filter((card) => card.region === regionFilter);
}

export function getRegionLabel(regionFilter: RegionFilter | "review"): string {
	if (regionFilter === "all") {
		return "World Tour";
	}

	if (regionFilter === "review") {
		return "Review Replay";
	}

	return regionFilter;
}
