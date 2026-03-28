import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bodyFont = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-body",
});

const displayFont = Fraunces({
	subsets: ["latin"],
	variable: "--font-display",
});

export const metadata: Metadata = {
	title: "Capitaling",
	description: "A swipe-first geography game for learning world capitals from flags.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={`${bodyFont.variable} ${displayFont.variable}`}>{children}</body>
		</html>
	);
}
