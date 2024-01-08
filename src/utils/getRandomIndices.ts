export default function getRandomIndices<T>(arrLength: number, x: number): number[] {
	const indices: Set<number> = new Set();

	if (x > arrLength) {
		throw new Error("Number of random indices requested exceeds the array length.");
	}

	while (indices.size < x) {
		const randomIndex = Math.floor(Math.random() * arrLength);
		indices.add(randomIndex);
	}

	return Array.from(indices);
}
