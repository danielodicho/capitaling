import type { CountryCard, RegionFilter } from "@/lib/game-data";

type RGB = {
	r: number;
	g: number;
	b: number;
};

type HSL = {
	h: number;
	s: number;
	l: number;
};

type ColorEntry = {
	hex: string;
	count: number;
	hsl: HSL;
};

export type CountryBackdropTheme = {
	atlasDeep: string;
	atlasHighlight: string;
	atlasLand: string;
	atlasLandMuted: string;
	atlasMarker: string;
	atlasOcean: string;
	atlasStroke: string;
	flagOpacity: number;
	flagPath: string | null;
	glowPrimary: string;
	glowSecondary: string;
	grid: string;
	mountainFar: string;
	mountainNear: string;
	skyBottom: string;
	skyMid: string;
	skyTop: string;
	star: string;
	starSoft: string;
	sunBottom: string;
	sunMid: string;
	sunTop: string;
};

const REGION_BASE_COLORS: Record<RegionFilter, [string, string, string]> = {
	all: ["#fb7185", "#f59e0b", "#38bdf8"],
	Africa: ["#f59e0b", "#f97316", "#22c55e"],
	Americas: ["#ef4444", "#38bdf8", "#facc15"],
	Asia: ["#f97316", "#22c55e", "#0ea5e9"],
	Europe: ["#60a5fa", "#f8fafc", "#ef4444"],
	Oceania: ["#38bdf8", "#1d4ed8", "#f97316"],
};

const COLOR_NAME_MAP: Record<string, string> = {
	azure: "#007fff",
	black: "#000000",
	blue: "#0f52ba",
	brown: "#8b4513",
	crimson: "#dc143c",
	cyan: "#22d3ee",
	gold: "#d4af37",
	gray: "#808080",
	green: "#00843d",
	grey: "#808080",
	indigo: "#4f46e5",
	maroon: "#7f1d1d",
	navy: "#1e3a8a",
	orange: "#f97316",
	pink: "#ec4899",
	purple: "#7c3aed",
	red: "#dc2626",
	saffron: "#f59e0b",
	silver: "#c0c0c0",
	teal: "#0f766e",
	white: "#ffffff",
	yellow: "#facc15",
};

const themeCache = new Map<string, CountryBackdropTheme>();

export function createRegionBackdropTheme(region: RegionFilter): CountryBackdropTheme {
	return createThemeFromPalette([...REGION_BASE_COLORS[region], "#f8fafc"], null);
}

export function createSeedCountryBackdropTheme(card: CountryCard): CountryBackdropTheme {
	const regionBase = REGION_BASE_COLORS[card.region];
	const seededAccent = hslToHex(hashHue(card.code), 74, 58);

	return createThemeFromPalette(
		[seededAccent, mixHex(regionBase[0], regionBase[1], 0.45), mixHex(regionBase[1], regionBase[2], 0.4), "#f8fafc"],
		card.flagPath,
	);
}

export async function resolveCountryBackdropTheme(card: CountryCard): Promise<CountryBackdropTheme> {
	const cached = themeCache.get(card.code);
	if (cached) {
		return cached;
	}

	const fallback = createSeedCountryBackdropTheme(card);

	try {
		const response = await fetch(card.flagPath);
		if (!response.ok) {
			throw new Error(`Failed to load ${card.flagPath}`);
		}

		const svg = await response.text();
		const theme = createThemeFromPalette(extractPaletteFromSvg(svg, card.region), card.flagPath);
		themeCache.set(card.code, theme);
		return theme;
	} catch {
		themeCache.set(card.code, fallback);
		return fallback;
	}
}

function createThemeFromPalette(colors: string[], flagPath: string | null): CountryBackdropTheme {
	const [primary, secondary, accent, light] = normalizePalette(colors);
	const navyTop = "#1b2842";
	const navyMid = "#132238";
	const navyBottom = "#0b1324";
	const uiWarm = "#f28c6b";
	const atlasOcean = mixHex("#7b93b4", secondary, 0.14);
	const atlasDeep = mixHex("#18253a", accent, 0.04);
	const atlasLand = mixHex("#f4f8fc", light, 0.12);
	const atlasLandMuted = mixHex("#6a778d", secondary, 0.18);
	const atlasStroke = mixHex("#d8e1ec", light, 0.12);
	const atlasHighlight = mixHex("#fff1cc", primary, 0.12);
	const atlasMarker = mixHex("#b0d9e2", secondary, 0.18);
	const glowPrimary = mixHex(lighten(primary, 10), uiWarm, 0.12);
	const glowSecondary = mixHex(lighten(secondary, 10), "#ffffff", 0.18);
	const skyTop = mixHex(navyTop, primary, 0.12);
	const skyMid = mixHex(navyMid, secondary, 0.08);
	const skyBottom = mixHex(navyBottom, accent, 0.06);
	const mountainFar = mixHex("#314460", secondary, 0.16);
	const mountainNear = mixHex("#18263f", primary, 0.12);
	const starSoft = mixHex(light, secondary, 0.16);
	const sunBottom = mixHex(uiWarm, accent, 0.14);
	const sunMid = mixHex("#ffd7c8", primary, 0.18);
	const sunTop = lighten(mixHex("#fff8f1", light, 0.18), 1);

	return {
		atlasDeep,
		atlasHighlight,
		atlasLand,
		atlasLandMuted,
		atlasMarker,
		atlasOcean,
		atlasStroke,
		flagOpacity: flagPath ? 1 : 0,
		flagPath,
		glowPrimary: toRgba(glowPrimary, 0.14),
		glowSecondary: toRgba(glowSecondary, 0.08),
		grid: toRgba(mixHex(light, secondary, 0.24), 0.14),
		mountainFar,
		mountainNear,
		skyBottom,
		skyMid,
		skyTop,
		star: toRgba(light, 0.86),
		starSoft: toRgba(starSoft, 0.58),
		sunBottom,
		sunMid,
		sunTop,
	};
}

function normalizePalette(colors: string[]): [string, string, string, string] {
	const cleaned = colors.filter(Boolean);
	const primary = cleaned[0] ?? "#fb7185";
	const secondary = cleaned[1] ?? lighten(primary, 18);
	const accent = cleaned[2] ?? mixHex(primary, secondary, 0.5);
	const light = cleaned[3] ?? lighten(primary, 36);
	return [primary, secondary, accent, light];
}

function extractPaletteFromSvg(svg: string, region: RegionFilter): string[] {
	const counts = new Map<string, number>();

	for (const match of Array.from(svg.matchAll(/(?:fill|stroke|stop-color)=["']([^"']+)["']/gi))) {
		addColor(counts, match[1]);
	}

	for (const match of Array.from(svg.matchAll(/(?:fill|stroke|stop-color)\s*:\s*([^;"'\s]+)/gi))) {
		addColor(counts, match[1]);
	}

	const entries = Array.from(counts.entries())
		.map(([hex, count]) => ({
			count,
			hex,
			hsl: rgbToHsl(hexToRgb(hex)),
		}))
		.sort((left, right) => scoreColor(right) - scoreColor(left));

	if (!entries.length) {
		return [...REGION_BASE_COLORS[region], "#f8fafc"];
	}

	const chosen: string[] = [];
	for (const entry of entries) {
		if (entry.hsl.l < 0.08) {
			continue;
		}

		if (chosen.some((existing) => colorDistance(existing, entry.hex) < 52)) {
			continue;
		}

		chosen.push(entry.hex);
		if (chosen.length === 3) {
			break;
		}
	}

	const brightest = [...entries]
		.filter((entry) => entry.hsl.l > 0.72)
		.sort((left, right) => right.hsl.l - left.hsl.l || right.count - left.count)[0]?.hex;

	const primary = chosen[0] ?? REGION_BASE_COLORS[region][0];
	const secondary = chosen[1] ?? mixHex(primary, REGION_BASE_COLORS[region][1], 0.35);
	const accent = chosen[2] ?? mixHex(secondary, REGION_BASE_COLORS[region][2], 0.4);
	const light = brightest ?? lighten(primary, 36);

	return [primary, secondary, accent, light];
}

function addColor(counts: Map<string, number>, rawValue: string) {
	const normalized = normalizeColor(rawValue);
	if (!normalized) {
		return;
	}

	counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
}

function normalizeColor(rawValue: string): string | null {
	const value = rawValue.trim().toLowerCase();

	if (!value || value === "none" || value === "transparent" || value === "currentcolor" || value.startsWith("url(")) {
		return null;
	}

	if (value.startsWith("#")) {
		return normalizeHex(value);
	}

	if (value.startsWith("rgb")) {
		return normalizeRgb(value);
	}

	return COLOR_NAME_MAP[value] ?? null;
}

function normalizeHex(value: string): string | null {
	if (value.length === 4 || value.length === 5) {
		const [r, g, b] = value.slice(1, 4).split("");
		return `#${r}${r}${g}${g}${b}${b}`;
	}

	if (value.length === 7) {
		return value;
	}

	if (value.length === 9) {
		return value.slice(0, 7);
	}

	return null;
}

function normalizeRgb(value: string): string | null {
	const matches = value.match(/\d+(\.\d+)?/g);
	if (!matches || matches.length < 3) {
		return null;
	}

	const [r, g, b] = matches.slice(0, 3).map((entry) => Number.parseFloat(entry));
	return rgbToHex({
		b: clampChannel(b),
		g: clampChannel(g),
		r: clampChannel(r),
	});
}

function scoreColor(entry: ColorEntry): number {
	const saturationWeight = 0.6 + entry.hsl.s;
	const lightnessWeight = 1 - Math.abs(entry.hsl.l - 0.52);
	return entry.count * saturationWeight * Math.max(lightnessWeight, 0.2);
}

function colorDistance(left: string, right: string): number {
	const a = hexToRgb(left);
	const b = hexToRgb(right);

	return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function lighten(hex: string, amount: number): string {
	if (amount === 0) {
		return hex;
	}

	if (amount > 0) {
		return mixHex(hex, "#ffffff", amount / 100);
	}

	return mixHex(hex, "#000000", Math.abs(amount) / 100);
}

function mixHex(left: string, right: string, weight: number): string {
	const a = hexToRgb(left);
	const b = hexToRgb(right);
	const ratio = clamp(weight, 0, 1);

	return rgbToHex({
		b: Math.round(a.b * (1 - ratio) + b.b * ratio),
		g: Math.round(a.g * (1 - ratio) + b.g * ratio),
		r: Math.round(a.r * (1 - ratio) + b.r * ratio),
	});
}

function toRgba(hex: string, alpha: number): string {
	const color = hexToRgb(hex);
	return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

function hexToRgb(hex: string): RGB {
	return {
		b: Number.parseInt(hex.slice(5, 7), 16),
		g: Number.parseInt(hex.slice(3, 5), 16),
		r: Number.parseInt(hex.slice(1, 3), 16),
	};
}

function rgbToHex(color: RGB): string {
	return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}

function toHex(value: number): string {
	return value.toString(16).padStart(2, "0");
}

function rgbToHsl(color: RGB): HSL {
	const r = color.r / 255;
	const g = color.g / 255;
	const b = color.b / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const lightness = (max + min) / 2;
	const delta = max - min;

	if (delta === 0) {
		return { h: 0, l: lightness, s: 0 };
	}

	const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

	let hue = 0;

	switch (max) {
		case r:
			hue = (g - b) / delta + (g < b ? 6 : 0);
			break;
		case g:
			hue = (b - r) / delta + 2;
			break;
		default:
			hue = (r - g) / delta + 4;
	}

	return {
		h: hue * 60,
		l: lightness,
		s: saturation,
	};
}

function hslToHex(hue: number, saturation: number, lightness: number): string {
	const s = saturation / 100;
	const l = lightness / 100;
	const chroma = (1 - Math.abs(2 * l - 1)) * s;
	const segment = hue / 60;
	const x = chroma * (1 - Math.abs((segment % 2) - 1));
	let r = 0;
	let g = 0;
	let b = 0;

	if (segment >= 0 && segment < 1) {
		r = chroma;
		g = x;
	} else if (segment < 2) {
		r = x;
		g = chroma;
	} else if (segment < 3) {
		g = chroma;
		b = x;
	} else if (segment < 4) {
		g = x;
		b = chroma;
	} else if (segment < 5) {
		r = x;
		b = chroma;
	} else {
		r = chroma;
		b = x;
	}

	const match = l - chroma / 2;

	return rgbToHex({
		b: Math.round((b + match) * 255),
		g: Math.round((g + match) * 255),
		r: Math.round((r + match) * 255),
	});
}

function hashHue(input: string): number {
	let hash = 0;
	for (const character of input) {
		hash = (hash * 31 + character.charCodeAt(0)) % 360;
	}

	return hash;
}

function clamp(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function clampChannel(value: number): number {
	return Math.round(clamp(value, 0, 255));
}
