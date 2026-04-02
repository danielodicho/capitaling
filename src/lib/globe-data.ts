import { type RegionFilter, allCountryCards, getCardsForRegion } from "@/lib/game-data";

export type GlobeLocation = {
	lat: number;
	lng: number;
};

const regionFocusCache = new Map<RegionFilter, GlobeLocation | null>();
const regionHighlightCache = new Map<RegionFilter, string[]>();
const REGION_FOCUS_PRESETS: Partial<Record<Exclude<RegionFilter, "all">, GlobeLocation>> = {
	Africa: { lat: 2, lng: 20 },
	Americas: { lat: 12, lng: -82 },
	Asia: { lat: 30, lng: 96 },
	Europe: { lat: 52, lng: 18 },
	Oceania: { lat: -24, lng: 144 },
};

export function getRegionFocusLocation(regionFilter: RegionFilter): GlobeLocation | null {
	if (regionFilter === "all") {
		return null;
	}

	const cached = regionFocusCache.get(regionFilter);
	if (cached !== undefined) {
		return cached;
	}

	const preset = REGION_FOCUS_PRESETS[regionFilter];
	const location =
		preset ??
		averageLocations(getCardsForRegion(regionFilter).flatMap((card) => (card.location ? [card.location] : [])));

	regionFocusCache.set(regionFilter, location);
	return location;
}

export function getRegionHighlightShapeIds(regionFilter: RegionFilter): string[] {
	if (regionFilter === "all") {
		return [];
	}

	const cached = regionHighlightCache.get(regionFilter);
	if (cached) {
		return cached;
	}

	const highlightIds = getCardsForRegion(regionFilter)
		.flatMap((card) => (card.countryShapeId ? [card.countryShapeId] : []))
		.sort();

	regionHighlightCache.set(regionFilter, highlightIds);
	return highlightIds;
}

export function getCountryHighlightShapeIds(code: string): string[] {
	const shapeId = allCountryCards.find((card) => card.code === code)?.countryShapeId;
	return shapeId ? [shapeId] : [];
}

function averageLocations(locations: GlobeLocation[]): GlobeLocation | null {
	if (!locations.length) {
		return null;
	}

	let x = 0;
	let y = 0;
	let z = 0;

	for (const location of locations) {
		const latitude = degreesToRadians(location.lat);
		const longitude = degreesToRadians(location.lng);
		const cosLat = Math.cos(latitude);

		x += cosLat * Math.cos(longitude);
		y += cosLat * Math.sin(longitude);
		z += Math.sin(latitude);
	}

	const count = locations.length;
	x /= count;
	y /= count;
	z /= count;

	const longitude = Math.atan2(y, x);
	const hypotenuse = Math.sqrt(x * x + y * y);
	const latitude = Math.atan2(z, hypotenuse);

	return {
		lat: roundCoordinate(radiansToDegrees(latitude)),
		lng: roundCoordinate(radiansToDegrees(longitude)),
	};
}

function roundCoordinate(value: number) {
	return Math.round(value * 100) / 100;
}

function degreesToRadians(value: number) {
	return (value * Math.PI) / 180;
}

function radiansToDegrees(value: number) {
	return (value * 180) / Math.PI;
}
