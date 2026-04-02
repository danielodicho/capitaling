"use client";

import { motion } from "framer-motion";
import { type CSSProperties } from "react";

import CountryGlobe from "@/components/country-globe";
import type { CountryBackdropTheme } from "@/lib/country-theme";
import type { CountryCard } from "@/lib/game-data";
import type { RevealState } from "@/lib/game-engine";

type CountryRevealPanelProps = {
	card: CountryCard;
	onAdvance: () => void;
	reveal: RevealState;
	theme: CountryBackdropTheme;
};

export default function CountryRevealPanel({ card, onAdvance, reveal, theme }: CountryRevealPanelProps) {
	const themedStyle = {
		"--country-reveal-flag-image": theme.flagPath ? `url("${theme.flagPath}")` : "none",
		"--country-reveal-flag-opacity": theme.flagOpacity,
		"--country-reveal-glow-primary": theme.glowPrimary,
		"--country-reveal-glow-secondary": theme.glowSecondary,
	} as CSSProperties;

	return (
		<motion.button
			type="button"
			onClick={onAdvance}
			initial={{ opacity: 0, y: 10, scale: 0.985 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: -8, scale: 0.985 }}
			transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
			whileHover={{ y: -1 }}
			whileTap={{ scale: 0.99 }}
			className={`country-reveal w-full max-w-[34rem] rounded-[1.5rem] border px-4 py-3 text-left sm:px-5 sm:py-3.5 ${
				reveal.correct ? "border-emerald-300/30 text-emerald-50" : "border-rose-300/35 text-rose-50"
			}`}
			style={themedStyle}
		>
			<div className="relative z-10 flex items-center gap-4">
				<div className="min-w-0 flex-1">
					<div className="flex flex-wrap items-center gap-2.5">
						<RevealBadge intent={reveal.correct ? "success" : "danger"} label={reveal.correct ? "Correct" : "Wrong"} />
						<span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-200/78">
							Tap to continue
						</span>
					</div>

					<p className="mt-2 text-lg font-semibold text-white sm:text-xl">
						{card.country} • {reveal.correctCapital}
					</p>
					<p className="mt-1.5 text-sm leading-6 text-slate-200/88">
						{reveal.correct
							? "Correct capital confirmed."
							: `${reveal.selectedCapital} missed. ${reveal.correctCapital} is correct.`}
					</p>
				</div>
				<div className="hidden shrink-0 sm:block">
					<CountryGlobe
						className="w-[7.75rem]"
						focusLocation={card.location}
						highlightShapeIds={card.countryShapeId ? [card.countryShapeId] : []}
						idleSpin={false}
						markerLocation={card.location}
						showMarker={Boolean(card.location)}
						theme={theme}
						variant="compact"
					/>
				</div>
			</div>
		</motion.button>
	);
}

function RevealBadge({
	intent,
	label,
}: {
	intent: "danger" | "neutral" | "success";
	label: string;
}) {
	const className =
		intent === "success"
			? "bg-emerald-400/12 text-emerald-50 ring-emerald-300/22"
			: intent === "danger"
			  ? "bg-rose-400/14 text-rose-50 ring-rose-300/22"
			  : "bg-white/8 text-slate-100 ring-white/10";

	return (
		<span
			className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ring-1 ${className}`}
		>
			{label}
		</span>
	);
}
