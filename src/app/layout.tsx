import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Capitaling — Flags Quiz",
	description: "A swipe-first geography game for learning world capitals from flags.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
