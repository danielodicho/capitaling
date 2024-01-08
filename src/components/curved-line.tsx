import React, { useState, useEffect, useLayoutEffect } from "react";

const CurvedLine = ({
	start,
	end,
	curveOffsetStart,
	curveOffsetEnd,
}: {
	start: DOMRect | null;
	end: DOMRect | null;
	curveOffsetStart?: number;
	curveOffsetEnd?: number;
}) => {
	const [path, setPath] = useState("");

	useLayoutEffect(() => {
		const calculatePath = () => {
			if (start && end) {
				const startX = start.right + window.scrollX;
				const startY = start.top + start.height / 2 + window.scrollY;
				const endX = end.left + window.scrollX;
				const endY = end.top + end.height / 2 + window.scrollY;

				const controlPointStartX = startX + (endX - startX) / 2 + (curveOffsetStart || 0);
				const controlPointStartY = startY;

				const controlPointEndX = endX - (endX - startX) / 2 + (curveOffsetEnd || 0);
				const controlPointEndY = endY;

				const curvePath = `M${startX},${startY} C${controlPointStartX},${controlPointStartY} ${controlPointEndX},${controlPointEndY} ${endX},${endY}`;
				setPath(curvePath);
			}
		};

		calculatePath();

		// Recalculate path if window is resized
		window.addEventListener("resize", calculatePath);

		return () => {
			window.removeEventListener("resize", calculatePath);
		};
	}, [start, end, curveOffsetStart, curveOffsetEnd]);

	return (
		<svg className="absolute inset-0 pointer-events-none h-full w-full">
			<title>Line between country and capital</title>;
			<path d={path} fill="transparent" strokeWidth="3" className="stroke-blue-600" />
		</svg>
	);
};

export default CurvedLine;
