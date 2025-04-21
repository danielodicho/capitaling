import countriesData from "../data"; // Import the countries data
import Game from "@components/Game";
import getRandomIndices from "@utils/getRandomIndices";

export default function Page() {
  return <Game />;
}

export const dynamic = "force-dynamic";

export type SimilarCountriesAndCitiesIndices = { similarCountriesIndices: number[]; similarCitiesIndices: number[] }[];
