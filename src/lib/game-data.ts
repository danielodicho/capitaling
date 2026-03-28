import countryList from "world-countries";

export const GAME_REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania"] as const;

export type RegionKey = (typeof GAME_REGIONS)[number];
export type RegionFilter = RegionKey | "all";

export type CountryCard = {
	code: string;
	country: string;
	capital: string;
	region: RegionKey;
	subregion: string;
	flagPath: string;
};

type RegionFilterOption = {
	value: RegionFilter;
	label: string;
	count: number;
};

const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
	Bahamas: "The Bahamas",
	Czechia: "Czech Republic",
	Gambia: "The Gambia",
};

const PLAYABLE_CODES = new Set(
	countryList
		.filter((country) => {
			return (
				country.capital?.[0] &&
				country.cca2 &&
				country.region &&
				GAME_REGIONS.includes(country.region as RegionKey) &&
				country.independent !== false
			);
		})
		.map((country) => country.cca2.toLowerCase()),
);

function toCountryCard(country: (typeof countryList)[number]): CountryCard | null {
	if (!country.capital?.[0] || !country.cca2 || !GAME_REGIONS.includes(country.region as RegionKey)) {
		return null;
	}

	if (country.independent === false) {
		return null;
	}

	const code = country.cca2.toLowerCase();
	if (!PLAYABLE_CODES.has(code)) {
		return null;
	}

	return {
		code,
		country: DISPLAY_NAME_OVERRIDES[country.name.common] ?? country.name.common,
		capital: country.capital[0],
		region: country.region as RegionKey,
		subregion: country.subregion ?? "Global",
		flagPath: `/images/svg/${code}.svg`,
	};
}

export const allCountryCards = countryList
	.map(toCountryCard)
	.filter((card): card is CountryCard => Boolean(card))
	.sort((left, right) => left.country.localeCompare(right.country));

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
