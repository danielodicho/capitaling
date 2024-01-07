// src/data.js
// Import the flags from the svg-country-flags package
import flags from "svg-country-flags/countries.json";

const countriesData = [
	{
		country: "Norway",
		capital: "Oslo",
		flagImage: "/images/svg/ch.svg",
		similarCountries: ["Sweden", "Denmark", "Finland"],
		similarCapitals: ["Stockholm", "Copenhagen", "Helsinki"],
	},
	{
		country: "France",
		capital: "Paris",
		flagImage: "/images/svg/fr.svg",
		similarCountries: ["Spain", "Italy", "Germany"],
		similarCapitals: ["Madrid", "Rome", "Berlin"],
	},
	{
		country: "Spain",
		capital: "Madrid",
		flagImage: "/images/svg/es.svg",
		similarCountries: ["France", "Italy", "Germany"],
		similarCapitals: ["Paris", "Rome", "Berlin"],
	},
	{
		country: "Germany",
		capital: "Berlin",
		flagImage: "/images/svg/de.svg",
		similarCountries: ["France", "Italy", "Spain"],
		similarCapitals: ["Paris", "Rome", "Madrid"],
	},
	{
		country: "Italy",
		capital: "Rome",
		flagImage: "/images/svg/it.svg",
		similarCountries: ["France", "Spain", "Germany"],
		similarCapitals: ["Paris", "Madrid", "Berlin"],
	},
	{
		country: "United Kingdom",
		capital: "London",
		flagImage: "/images/svg/gb-eng.svg",
		similarCountries: ["France", "Spain", "Germany"],
		similarCapitals: ["Paris", "Madrid", "Berlin"],
	},
	{
		country: "Sweden",
		capital: "Stockholm",
		flagImage: "/images/svg/se.svg",
		similarCountries: ["Norway", "Denmark", "Finland"],
		similarCapitals: ["Oslo", "Copenhagen", "Helsinki"],
	},
	{
		country: "Denmark",
		capital: "Copenhagen",
		flagImage: "/images/svg/dk.svg",
		similarCountries: ["Norway", "Sweden", "Finland"],
		similarCapitals: ["Oslo", "Stockholm", "Helsinki"],
	},
	{
		country: "Finland",
		capital: "Helsinki",
		flagImage: "/images/svg/fi.svg",
		similarCountries: ["Norway", "Sweden", "Denmark"],
		similarCapitals: ["Oslo", "Stockholm", "Copenhagen"],
	},
	{
		country: "Portugal",
		capital: "Lisbon",
		flagImage: "/images/svg/pt.svg",
		similarCountries: ["Spain", "Italy", "Germany"],
		similarCapitals: ["Madrid", "Rome", "Berlin"],
	},
	{
		country: "Ireland",
		capital: "Dublin",
		flagImage: "/images/svg/ie.svg",
		similarCountries: ["France", "Spain", "Germany"],
		similarCapitals: ["Paris", "Madrid", "Berlin"],
	},
	{
		country: "Greece",
		capital: "Athens",
		flagImage: "/images/svg/gr.svg",
		similarCountries: ["France", "Spain", "Germany"],
		similarCapitals: ["Paris", "Madrid", "Berlin"],
	},
	{
		country: "Poland",
		capital: "Warsaw",
		flagImage: "/images/svg/pl.svg",
		similarCountries: ["Monaco", "Malta", "Indonesia"],
		similarCapitals: ["Monaco", "Valletta", "Jakarta"],
	},
];

export default countriesData;
