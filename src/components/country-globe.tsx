"use client";

import { motion, useReducedMotion } from "framer-motion";
import { type CSSProperties, useEffect, useId, useMemo, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Graticule, Marker, Sphere } from "react-simple-maps";
import globeAtlas from "world-atlas/countries-50m.json";

import type { CountryBackdropTheme } from "@/lib/country-theme";
import type { GlobeLocation } from "@/lib/globe-data";

type CountryGlobeProps = {
	className?: string;
	focusLocation: GlobeLocation | null;
	highlightShapeIds: string[];
	idleSpin: boolean;
	markerLocation: GlobeLocation | null;
	showMarker: boolean;
	theme: CountryBackdropTheme;
	variant: "compact" | "hero";
};

type ThemeStyle = CSSProperties & Record<`--${string}`, number | string>;

type AtlasGeometry = {
	id: number | string;
};

type GlobeRotation = {
	lng: number;
	lat: number;
};

const HERO_SIZE = 620;
const COMPACT_SIZE = 188;
const COUNTRY_SHAPE_IDS = new Set(
	(globeAtlas.objects.countries.geometries as AtlasGeometry[])
		.map((geometry) => normalizeShapeId(geometry.id))
		.filter((value): value is string => Boolean(value)),
);

export default function CountryGlobe({
	className,
	focusLocation,
	highlightShapeIds,
	idleSpin,
	markerLocation,
	showMarker,
	theme,
	variant,
}: CountryGlobeProps) {
	const prefersReducedMotion = useReducedMotion();
	const baseId = useId().replace(/:/g, "");
	const sphereId = `${baseId}-sphere`;
	const oceanGradientId = `${baseId}-ocean`;
	const highlightSet = useMemo(() => {
		return new Set(highlightShapeIds.filter((shapeId) => COUNTRY_SHAPE_IDS.has(shapeId)));
	}, [highlightShapeIds]);
	const surfaceStyle = useMemo<ThemeStyle>(
		() => ({
			"--country-globe-flag-image": theme.flagPath ? `url("${theme.flagPath}")` : "none",
			"--country-globe-flag-opacity": theme.flagOpacity,
			"--country-globe-glow-primary": theme.glowPrimary,
			"--country-globe-glow-secondary": theme.glowSecondary,
		}),
		[theme],
	);
	const targetRotation = useMemo<GlobeRotation>(() => {
		if (!focusLocation) {
			return variant === "hero" ? { lat: -18, lng: 12 } : { lat: -10, lng: 18 };
		}

		return {
			lat: -focusLocation.lat,
			lng: -focusLocation.lng,
		};
	}, [focusLocation, variant]);
	const animatedRotation = useAnimatedRotation(targetRotation);
	const idleOffset = useIdleSpin(idleSpin && variant === "hero" && !prefersReducedMotion);
	const projectionRotate = useMemo<[number, number, number]>(() => {
		return [animatedRotation.lng + idleOffset, animatedRotation.lat, 0];
	}, [animatedRotation.lat, animatedRotation.lng, idleOffset]);
	const size = variant === "hero" ? HERO_SIZE : COMPACT_SIZE;
	const showActiveHighlight = highlightSet.size > 0;
	const hasFocusedCountry = highlightSet.size === 1 && showMarker;
	const hasRegionFocus = focusLocation && highlightSet.size > 1;
	const showGraticule = variant === "hero";
	const oceanTop = lighten(theme.atlasOcean, variant === "hero" ? 12 : 5);
	const oceanMid = theme.atlasOcean;
	const oceanBottom = theme.atlasDeep;
	const activeFill = hasFocusedCountry
		? toRgba(theme.atlasHighlight, 0.42)
		: hasRegionFocus
		  ? toRgba(theme.atlasMarker, 0.2)
		  : toRgba(theme.atlasMarker, 0.16);
	const activeStroke = hasFocusedCountry
		? "#fff8e5"
		: hasRegionFocus
		  ? toRgba(theme.atlasStroke, 0.94)
		  : toRgba(theme.atlasStroke, 0.9);
	const inactiveFill = showActiveHighlight ? toRgba(theme.atlasLandMuted, 0.06) : toRgba(theme.atlasLand, 0.1);
	const inactiveStroke = showActiveHighlight ? toRgba(theme.atlasStroke, 0.12) : toRgba(theme.atlasStroke, 0.18);
	const projectionScale = variant === "hero" ? (hasFocusedCountry ? 760 : hasRegionFocus ? 332 : 284) : 96;

	return (
		<div className={`country-globe country-globe--${variant} ${className ?? ""}`.trim()} style={surfaceStyle}>
			<motion.div
				initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94, y: 18 }}
				animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
				transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
			>
				<ComposableMap
					className="country-globe__svg h-auto w-full"
					height={size}
					projection="geoOrthographic"
					projectionConfig={{
						rotate: projectionRotate,
						scale: projectionScale,
					}}
					width={size}
				>
					<defs>
						<radialGradient id={oceanGradientId} cx="45%" cy="35%">
							<stop offset="0%" stopColor={oceanTop} stopOpacity="0.98" />
							<stop offset="38%" stopColor={oceanMid} stopOpacity="0.98" />
							<stop offset="70%" stopColor={oceanMid} stopOpacity="1" />
							<stop offset="100%" stopColor={oceanBottom} />
						</radialGradient>
					</defs>

					<Sphere
						fill={`url(#${oceanGradientId})`}
						id={sphereId}
						stroke={toRgba(theme.atlasStroke, 0.48)}
						strokeWidth={variant === "hero" ? 1.15 : 0.95}
					/>
					<g className="pointer-events-none" clipPath={`url(#${sphereId})`}>
						{showGraticule ? <Graticule stroke={toRgba(theme.atlasStroke, 0.14)} strokeOpacity={1} /> : null}
						<Geographies geography={globeAtlas}>
							{({ geographies }) =>
								geographies.map((geo) => {
									const isActive = highlightSet.has(normalizeShapeId(geo.id) ?? "");

									return (
										<Geography
											key={geo.rsmKey}
											focusable={false}
											geography={geo}
											tabIndex={-1}
											style={{
												default: {
													fill: isActive ? activeFill : inactiveFill,
													stroke: isActive ? activeStroke : inactiveStroke,
													strokeWidth: isActive ? (variant === "hero" ? 1.35 : 1.05) : 0.3,
													outline: "none",
												},
												hover: {
													fill: isActive ? activeFill : inactiveFill,
													stroke: isActive ? activeStroke : inactiveStroke,
													strokeWidth: isActive ? (variant === "hero" ? 1.35 : 1.05) : 0.3,
													outline: "none",
												},
												pressed: {
													fill: isActive ? activeFill : inactiveFill,
													stroke: isActive ? activeStroke : inactiveStroke,
													strokeWidth: isActive ? (variant === "hero" ? 1.35 : 1.05) : 0.3,
													outline: "none",
												},
											}}
										/>
									);
								})
							}
						</Geographies>
					</g>

					{showMarker && markerLocation ? (
						<Marker coordinates={[markerLocation.lng, markerLocation.lat]}>
							<g className="pointer-events-none">
								<circle fill={toRgba(theme.atlasMarker, 0.22)} r={variant === "hero" ? 9 : 6} />
								<circle fill="#ffffff" opacity="0.96" r={variant === "hero" ? 3.8 : 2.8} />
								{prefersReducedMotion ? null : (
									<motion.circle
										key={`${markerLocation.lat}-${markerLocation.lng}-${variant}`}
										animate={{ opacity: [0.68, 0], r: variant === "hero" ? [7, 16] : [5, 10] }}
										fill="none"
										initial={{ opacity: 0.68, r: variant === "hero" ? 7 : 5 }}
										stroke={toRgba(theme.atlasMarker, 0.88)}
										strokeWidth={variant === "hero" ? 1.8 : 1.4}
										transition={{ duration: 0.88, ease: "easeOut", repeat: 1, repeatDelay: 0.12 }}
									/>
								)}
							</g>
						</Marker>
					) : null}
				</ComposableMap>
			</motion.div>
		</div>
	);
}

function toRgba(hex: string, alpha: number) {
	const normalized = hex.startsWith("#") ? hex.slice(1) : hex;
	const safeHex =
		normalized.length === 3
			? normalized
					.split("")
					.map((value) => value + value)
					.join("")
			: normalized;
	const value = Number.parseInt(safeHex, 16);
	const r = (value >> 16) & 255;
	const g = (value >> 8) & 255;
	const b = value & 255;
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lighten(hex: string, amount: number) {
	const normalized = hex.startsWith("#") ? hex.slice(1) : hex;
	const safeHex =
		normalized.length === 3
			? normalized
					.split("")
					.map((value) => value + value)
					.join("")
			: normalized;
	const value = Number.parseInt(safeHex, 16);
	const mix = (channel: number) => Math.max(0, Math.min(255, Math.round(channel + (255 - channel) * (amount / 100))));
	const r = mix((value >> 16) & 255);
	const g = mix((value >> 8) & 255);
	const b = mix(value & 255);
	return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function useAnimatedRotation(target: GlobeRotation) {
	const prefersReducedMotion = useReducedMotion();
	const [rotation, setRotation] = useState(target);
	const currentRef = useRef(target);

	useEffect(() => {
		if (prefersReducedMotion) {
			currentRef.current = target;
			setRotation(target);
			return;
		}

		const from = currentRef.current;
		const startedAt = performance.now();
		let frameId = 0;

		const step = (now: number) => {
			const progress = Math.min((now - startedAt) / 240, 1);
			const eased = 1 - (1 - progress) ** 3;
			const next = {
				lat: from.lat + (target.lat - from.lat) * eased,
				lng: from.lng + shortestAngleDelta(from.lng, target.lng) * eased,
			};

			currentRef.current = next;
			setRotation(next);

			if (progress < 1) {
				frameId = window.requestAnimationFrame(step);
			}
		};

		frameId = window.requestAnimationFrame(step);

		return () => window.cancelAnimationFrame(frameId);
	}, [prefersReducedMotion, target]);

	return rotation;
}

function useIdleSpin(enabled: boolean) {
	const [offset, setOffset] = useState(0);

	useEffect(() => {
		if (!enabled) {
			setOffset(0);
			return;
		}

		const startedAt = performance.now();
		let frameId = 0;

		const step = (now: number) => {
			const elapsed = now - startedAt;
			setOffset((elapsed * 0.0026) % 360);
			frameId = window.requestAnimationFrame(step);
		};

		frameId = window.requestAnimationFrame(step);

		return () => window.cancelAnimationFrame(frameId);
	}, [enabled]);

	return offset;
}

function shortestAngleDelta(from: number, to: number) {
	return ((to - from + 540) % 360) - 180;
}

function normalizeShapeId(value: unknown) {
	if (typeof value !== "number" && typeof value !== "string") {
		return null;
	}

	return String(value).padStart(3, "0");
}
