export type CountryCardData = {
	code: string;
	country: string;
	capital: string;
	region: "Africa" | "Americas" | "Asia" | "Europe" | "Oceania";
	subregion: string;
	flagPath: string;
	location: {
		lat: number;
		lng: number;
	} | null;
	countryShapeId: string | null;
};

export const countryCardData: CountryCardData[] = [
	{
		"code": "af",
		"country": "Afghanistan",
		"capital": "Kabul",
		"region": "Asia",
		"subregion": "Southern Asia",
		"flagPath": "/images/svg/af.svg",
		"location": {
			"lat": 33,
			"lng": 65
		},
		"countryShapeId": "004"
	},
	{
		"code": "al",
		"country": "Albania",
		"capital": "Tirana",
		"region": "Europe",
		"subregion": "Southeast Europe",
		"flagPath": "/images/svg/al.svg",
		"location": {
			"lat": 41,
			"lng": 20
		},
		"countryShapeId": "008"
	},
	{
		"code": "dz",
		"country": "Algeria",
		"capital": "Algiers",
		"region": "Africa",
		"subregion": "Northern Africa",
		"flagPath": "/images/svg/dz.svg",
		"location": {
			"lat": 28,
			"lng": 3
		},
		"countryShapeId": "012"
	},
	{
		"code": "ad",
		"country": "Andorra",
		"capital": "Andorra la Vella",
		"region": "Europe",
		"subregion": "Southern Europe",
		"flagPath": "/images/svg/ad.svg",
		"location": {
			"lat": 42.5,
			"lng": 1.5
		},
		"countryShapeId": "020"
	},
	{
		"code": "ao",
		"country": "Angola",
		"capital": "Luanda",
		"region": "Africa",
		"subregion": "Middle Africa",
		"flagPath": "/images/svg/ao.svg",
		"location": {
			"lat": -12.5,
			"lng": 18.5
		},
		"countryShapeId": "024"
	},
	{
		"code": "ag",
		"country": "Antigua and Barbuda",
		"capital": "Saint John's",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/ag.svg",
		"location": {
			"lat": 17.05,
			"lng": -61.8
		},
		"countryShapeId": "028"
	},
	{
		"code": "ar",
		"country": "Argentina",
		"capital": "Buenos Aires",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/ar.svg",
		"location": {
			"lat": -34,
			"lng": -64
		},
		"countryShapeId": "032"
	},
	{
		"code": "am",
		"country": "Armenia",
		"capital": "Yerevan",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/am.svg",
		"location": {
			"lat": 40,
			"lng": 45
		},
		"countryShapeId": "051"
	},
	{
		"code": "au",
		"country": "Australia",
		"capital": "Canberra",
		"region": "Oceania",
		"subregion": "Australia and New Zealand",
		"flagPath": "/images/svg/au.svg",
		"location": {
			"lat": -27,
			"lng": 133
		},
		"countryShapeId": "036"
	},
	{
		"code": "at",
		"country": "Austria",
		"capital": "Vienna",
		"region": "Europe",
		"subregion": "Central Europe",
		"flagPath": "/images/svg/at.svg",
		"location": {
			"lat": 47.33333333,
			"lng": 13.33333333
		},
		"countryShapeId": "040"
	},
	{
		"code": "az",
		"country": "Azerbaijan",
		"capital": "Baku",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/az.svg",
		"location": {
			"lat": 40.5,
			"lng": 47.5
		},
		"countryShapeId": "031"
	},
	{
		"code": "bh",
		"country": "Bahrain",
		"capital": "Manama",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/bh.svg",
		"location": {
			"lat": 26,
			"lng": 50.55
		},
		"countryShapeId": "048"
	},
	{
		"code": "bd",
		"country": "Bangladesh",
		"capital": "Dhaka",
		"region": "Asia",
		"subregion": "Southern Asia",
		"flagPath": "/images/svg/bd.svg",
		"location": {
			"lat": 24,
			"lng": 90
		},
		"countryShapeId": "050"
	},
	{
		"code": "bb",
		"country": "Barbados",
		"capital": "Bridgetown",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/bb.svg",
		"location": {
			"lat": 13.16666666,
			"lng": -59.53333333
		},
		"countryShapeId": "052"
	},
	{
		"code": "by",
		"country": "Belarus",
		"capital": "Minsk",
		"region": "Europe",
		"subregion": "Eastern Europe",
		"flagPath": "/images/svg/by.svg",
		"location": {
			"lat": 53,
			"lng": 28
		},
		"countryShapeId": "112"
	},
	{
		"code": "be",
		"country": "Belgium",
		"capital": "Brussels",
		"region": "Europe",
		"subregion": "Western Europe",
		"flagPath": "/images/svg/be.svg",
		"location": {
			"lat": 50.83333333,
			"lng": 4
		},
		"countryShapeId": "056"
	},
	{
		"code": "bz",
		"country": "Belize",
		"capital": "Belmopan",
		"region": "Americas",
		"subregion": "Central America",
		"flagPath": "/images/svg/bz.svg",
		"location": {
			"lat": 17.25,
			"lng": -88.75
		},
		"countryShapeId": "084"
	},
	{
		"code": "bj",
		"country": "Benin",
		"capital": "Porto-Novo",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/bj.svg",
		"location": {
			"lat": 9.5,
			"lng": 2.25
		},
		"countryShapeId": "204"
	},
	{
		"code": "bt",
		"country": "Bhutan",
		"capital": "Thimphu",
		"region": "Asia",
		"subregion": "Southern Asia",
		"flagPath": "/images/svg/bt.svg",
		"location": {
			"lat": 27.5,
			"lng": 90.5
		},
		"countryShapeId": "064"
	},
	{
		"code": "bo",
		"country": "Bolivia",
		"capital": "Sucre",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/bo.svg",
		"location": {
			"lat": -17,
			"lng": -65
		},
		"countryShapeId": "068"
	},
	{
		"code": "ba",
		"country": "Bosnia and Herzegovina",
		"capital": "Sarajevo",
		"region": "Europe",
		"subregion": "Southeast Europe",
		"flagPath": "/images/svg/ba.svg",
		"location": {
			"lat": 44,
			"lng": 18
		},
		"countryShapeId": "070"
	},
	{
		"code": "bw",
		"country": "Botswana",
		"capital": "Gaborone",
		"region": "Africa",
		"subregion": "Southern Africa",
		"flagPath": "/images/svg/bw.svg",
		"location": {
			"lat": -22,
			"lng": 24
		},
		"countryShapeId": "072"
	},
	{
		"code": "br",
		"country": "Brazil",
		"capital": "Brasília",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/br.svg",
		"location": {
			"lat": -10,
			"lng": -55
		},
		"countryShapeId": "076"
	},
	{
		"code": "bn",
		"country": "Brunei",
		"capital": "Bandar Seri Begawan",
		"region": "Asia",
		"subregion": "South-Eastern Asia",
		"flagPath": "/images/svg/bn.svg",
		"location": {
			"lat": 4.5,
			"lng": 114.66666666
		},
		"countryShapeId": "096"
	},
	{
		"code": "bg",
		"country": "Bulgaria",
		"capital": "Sofia",
		"region": "Europe",
		"subregion": "Southeast Europe",
		"flagPath": "/images/svg/bg.svg",
		"location": {
			"lat": 43,
			"lng": 25
		},
		"countryShapeId": "100"
	},
	{
		"code": "bf",
		"country": "Burkina Faso",
		"capital": "Ouagadougou",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/bf.svg",
		"location": {
			"lat": 13,
			"lng": -2
		},
		"countryShapeId": "854"
	},
	{
		"code": "bi",
		"country": "Burundi",
		"capital": "Gitega",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/bi.svg",
		"location": {
			"lat": -3.5,
			"lng": 30
		},
		"countryShapeId": "108"
	},
	{
		"code": "kh",
		"country": "Cambodia",
		"capital": "Phnom Penh",
		"region": "Asia",
		"subregion": "South-Eastern Asia",
		"flagPath": "/images/svg/kh.svg",
		"location": {
			"lat": 13,
			"lng": 105
		},
		"countryShapeId": "116"
	},
	{
		"code": "cm",
		"country": "Cameroon",
		"capital": "Yaoundé",
		"region": "Africa",
		"subregion": "Middle Africa",
		"flagPath": "/images/svg/cm.svg",
		"location": {
			"lat": 6,
			"lng": 12
		},
		"countryShapeId": "120"
	},
	{
		"code": "ca",
		"country": "Canada",
		"capital": "Ottawa",
		"region": "Americas",
		"subregion": "North America",
		"flagPath": "/images/svg/ca.svg",
		"location": {
			"lat": 60,
			"lng": -95
		},
		"countryShapeId": "124"
	},
	{
		"code": "cv",
		"country": "Cape Verde",
		"capital": "Praia",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/cv.svg",
		"location": {
			"lat": 16,
			"lng": -24
		},
		"countryShapeId": "132"
	},
	{
		"code": "cf",
		"country": "Central African Republic",
		"capital": "Bangui",
		"region": "Africa",
		"subregion": "Middle Africa",
		"flagPath": "/images/svg/cf.svg",
		"location": {
			"lat": 7,
			"lng": 21
		},
		"countryShapeId": "140"
	},
	{
		"code": "td",
		"country": "Chad",
		"capital": "N'Djamena",
		"region": "Africa",
		"subregion": "Middle Africa",
		"flagPath": "/images/svg/td.svg",
		"location": {
			"lat": 15,
			"lng": 19
		},
		"countryShapeId": "148"
	},
	{
		"code": "cl",
		"country": "Chile",
		"capital": "Santiago",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/cl.svg",
		"location": {
			"lat": -30,
			"lng": -71
		},
		"countryShapeId": "152"
	},
	{
		"code": "cn",
		"country": "China",
		"capital": "Beijing",
		"region": "Asia",
		"subregion": "Eastern Asia",
		"flagPath": "/images/svg/cn.svg",
		"location": {
			"lat": 35,
			"lng": 105
		},
		"countryShapeId": "156"
	},
	{
		"code": "co",
		"country": "Colombia",
		"capital": "Bogotá",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/co.svg",
		"location": {
			"lat": 4,
			"lng": -72
		},
		"countryShapeId": "170"
	},
	{
		"code": "km",
		"country": "Comoros",
		"capital": "Moroni",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/km.svg",
		"location": {
			"lat": -12.16666666,
			"lng": 44.25
		},
		"countryShapeId": "174"
	},
	{
		"code": "cr",
		"country": "Costa Rica",
		"capital": "San José",
		"region": "Americas",
		"subregion": "Central America",
		"flagPath": "/images/svg/cr.svg",
		"location": {
			"lat": 10,
			"lng": -84
		},
		"countryShapeId": "188"
	},
	{
		"code": "hr",
		"country": "Croatia",
		"capital": "Zagreb",
		"region": "Europe",
		"subregion": "Southeast Europe",
		"flagPath": "/images/svg/hr.svg",
		"location": {
			"lat": 45.16666666,
			"lng": 15.5
		},
		"countryShapeId": "191"
	},
	{
		"code": "cu",
		"country": "Cuba",
		"capital": "Havana",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/cu.svg",
		"location": {
			"lat": 21.5,
			"lng": -80
		},
		"countryShapeId": "192"
	},
	{
		"code": "cy",
		"country": "Cyprus",
		"capital": "Nicosia",
		"region": "Europe",
		"subregion": "Southern Europe",
		"flagPath": "/images/svg/cy.svg",
		"location": {
			"lat": 35,
			"lng": 33
		},
		"countryShapeId": "196"
	},
	{
		"code": "cz",
		"country": "Czech Republic",
		"capital": "Prague",
		"region": "Europe",
		"subregion": "Central Europe",
		"flagPath": "/images/svg/cz.svg",
		"location": {
			"lat": 49.75,
			"lng": 15.5
		},
		"countryShapeId": "203"
	},
	{
		"code": "dk",
		"country": "Denmark",
		"capital": "Copenhagen",
		"region": "Europe",
		"subregion": "Northern Europe",
		"flagPath": "/images/svg/dk.svg",
		"location": {
			"lat": 56,
			"lng": 10
		},
		"countryShapeId": "208"
	},
	{
		"code": "dj",
		"country": "Djibouti",
		"capital": "Djibouti",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/dj.svg",
		"location": {
			"lat": 11.5,
			"lng": 43
		},
		"countryShapeId": "262"
	},
	{
		"code": "dm",
		"country": "Dominica",
		"capital": "Roseau",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/dm.svg",
		"location": {
			"lat": 15.41666666,
			"lng": -61.33333333
		},
		"countryShapeId": "212"
	},
	{
		"code": "do",
		"country": "Dominican Republic",
		"capital": "Santo Domingo",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/do.svg",
		"location": {
			"lat": 19,
			"lng": -70.66666666
		},
		"countryShapeId": "214"
	},
	{
		"code": "cd",
		"country": "DR Congo",
		"capital": "Kinshasa",
		"region": "Africa",
		"subregion": "Middle Africa",
		"flagPath": "/images/svg/cd.svg",
		"location": {
			"lat": 0,
			"lng": 25
		},
		"countryShapeId": "180"
	},
	{
		"code": "ec",
		"country": "Ecuador",
		"capital": "Quito",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/ec.svg",
		"location": {
			"lat": -2,
			"lng": -77.5
		},
		"countryShapeId": "218"
	},
	{
		"code": "eg",
		"country": "Egypt",
		"capital": "Cairo",
		"region": "Africa",
		"subregion": "Northern Africa",
		"flagPath": "/images/svg/eg.svg",
		"location": {
			"lat": 27,
			"lng": 30
		},
		"countryShapeId": "818"
	},
	{
		"code": "sv",
		"country": "El Salvador",
		"capital": "San Salvador",
		"region": "Americas",
		"subregion": "Central America",
		"flagPath": "/images/svg/sv.svg",
		"location": {
			"lat": 13.83333333,
			"lng": -88.91666666
		},
		"countryShapeId": "222"
	},
	{
		"code": "gq",
		"country": "Equatorial Guinea",
		"capital": "Malabo",
		"region": "Africa",
		"subregion": "Middle Africa",
		"flagPath": "/images/svg/gq.svg",
		"location": {
			"lat": 2,
			"lng": 10
		},
		"countryShapeId": "226"
	},
	{
		"code": "er",
		"country": "Eritrea",
		"capital": "Asmara",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/er.svg",
		"location": {
			"lat": 15,
			"lng": 39
		},
		"countryShapeId": "232"
	},
	{
		"code": "ee",
		"country": "Estonia",
		"capital": "Tallinn",
		"region": "Europe",
		"subregion": "Northern Europe",
		"flagPath": "/images/svg/ee.svg",
		"location": {
			"lat": 59,
			"lng": 26
		},
		"countryShapeId": "233"
	},
	{
		"code": "sz",
		"country": "Eswatini",
		"capital": "Lobamba",
		"region": "Africa",
		"subregion": "Southern Africa",
		"flagPath": "/images/svg/sz.svg",
		"location": {
			"lat": -26.5,
			"lng": 31.5
		},
		"countryShapeId": "748"
	},
	{
		"code": "et",
		"country": "Ethiopia",
		"capital": "Addis Ababa",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/et.svg",
		"location": {
			"lat": 8,
			"lng": 38
		},
		"countryShapeId": "231"
	},
	{
		"code": "fj",
		"country": "Fiji",
		"capital": "Suva",
		"region": "Oceania",
		"subregion": "Melanesia",
		"flagPath": "/images/svg/fj.svg",
		"location": {
			"lat": -18,
			"lng": 175
		},
		"countryShapeId": "242"
	},
	{
		"code": "fi",
		"country": "Finland",
		"capital": "Helsinki",
		"region": "Europe",
		"subregion": "Northern Europe",
		"flagPath": "/images/svg/fi.svg",
		"location": {
			"lat": 64,
			"lng": 26
		},
		"countryShapeId": "246"
	},
	{
		"code": "fr",
		"country": "France",
		"capital": "Paris",
		"region": "Europe",
		"subregion": "Western Europe",
		"flagPath": "/images/svg/fr.svg",
		"location": {
			"lat": 46,
			"lng": 2
		},
		"countryShapeId": "250"
	},
	{
		"code": "ga",
		"country": "Gabon",
		"capital": "Libreville",
		"region": "Africa",
		"subregion": "Middle Africa",
		"flagPath": "/images/svg/ga.svg",
		"location": {
			"lat": -1,
			"lng": 11.75
		},
		"countryShapeId": "266"
	},
	{
		"code": "ge",
		"country": "Georgia",
		"capital": "Tbilisi",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/ge.svg",
		"location": {
			"lat": 42,
			"lng": 43.5
		},
		"countryShapeId": "268"
	},
	{
		"code": "de",
		"country": "Germany",
		"capital": "Berlin",
		"region": "Europe",
		"subregion": "Western Europe",
		"flagPath": "/images/svg/de.svg",
		"location": {
			"lat": 51,
			"lng": 9
		},
		"countryShapeId": "276"
	},
	{
		"code": "gh",
		"country": "Ghana",
		"capital": "Accra",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/gh.svg",
		"location": {
			"lat": 8,
			"lng": -2
		},
		"countryShapeId": "288"
	},
	{
		"code": "gr",
		"country": "Greece",
		"capital": "Athens",
		"region": "Europe",
		"subregion": "Southern Europe",
		"flagPath": "/images/svg/gr.svg",
		"location": {
			"lat": 39,
			"lng": 22
		},
		"countryShapeId": "300"
	},
	{
		"code": "gd",
		"country": "Grenada",
		"capital": "St. George's",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/gd.svg",
		"location": {
			"lat": 12.11666666,
			"lng": -61.66666666
		},
		"countryShapeId": "308"
	},
	{
		"code": "gt",
		"country": "Guatemala",
		"capital": "Guatemala City",
		"region": "Americas",
		"subregion": "Central America",
		"flagPath": "/images/svg/gt.svg",
		"location": {
			"lat": 15.5,
			"lng": -90.25
		},
		"countryShapeId": "320"
	},
	{
		"code": "gn",
		"country": "Guinea",
		"capital": "Conakry",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/gn.svg",
		"location": {
			"lat": 11,
			"lng": -10
		},
		"countryShapeId": "324"
	},
	{
		"code": "gw",
		"country": "Guinea-Bissau",
		"capital": "Bissau",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/gw.svg",
		"location": {
			"lat": 12,
			"lng": -15
		},
		"countryShapeId": "624"
	},
	{
		"code": "gy",
		"country": "Guyana",
		"capital": "Georgetown",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/gy.svg",
		"location": {
			"lat": 5,
			"lng": -59
		},
		"countryShapeId": "328"
	},
	{
		"code": "ht",
		"country": "Haiti",
		"capital": "Port-au-Prince",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/ht.svg",
		"location": {
			"lat": 19,
			"lng": -72.41666666
		},
		"countryShapeId": "332"
	},
	{
		"code": "hn",
		"country": "Honduras",
		"capital": "Tegucigalpa",
		"region": "Americas",
		"subregion": "Central America",
		"flagPath": "/images/svg/hn.svg",
		"location": {
			"lat": 15,
			"lng": -86.5
		},
		"countryShapeId": "340"
	},
	{
		"code": "hu",
		"country": "Hungary",
		"capital": "Budapest",
		"region": "Europe",
		"subregion": "Central Europe",
		"flagPath": "/images/svg/hu.svg",
		"location": {
			"lat": 47,
			"lng": 20
		},
		"countryShapeId": "348"
	},
	{
		"code": "is",
		"country": "Iceland",
		"capital": "Reykjavik",
		"region": "Europe",
		"subregion": "Northern Europe",
		"flagPath": "/images/svg/is.svg",
		"location": {
			"lat": 65,
			"lng": -18
		},
		"countryShapeId": "352"
	},
	{
		"code": "in",
		"country": "India",
		"capital": "New Delhi",
		"region": "Asia",
		"subregion": "Southern Asia",
		"flagPath": "/images/svg/in.svg",
		"location": {
			"lat": 20,
			"lng": 77
		},
		"countryShapeId": "356"
	},
	{
		"code": "id",
		"country": "Indonesia",
		"capital": "Jakarta",
		"region": "Asia",
		"subregion": "South-Eastern Asia",
		"flagPath": "/images/svg/id.svg",
		"location": {
			"lat": -5,
			"lng": 120
		},
		"countryShapeId": "360"
	},
	{
		"code": "ir",
		"country": "Iran",
		"capital": "Tehran",
		"region": "Asia",
		"subregion": "Southern Asia",
		"flagPath": "/images/svg/ir.svg",
		"location": {
			"lat": 32,
			"lng": 53
		},
		"countryShapeId": "364"
	},
	{
		"code": "iq",
		"country": "Iraq",
		"capital": "Baghdad",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/iq.svg",
		"location": {
			"lat": 33,
			"lng": 44
		},
		"countryShapeId": "368"
	},
	{
		"code": "ie",
		"country": "Ireland",
		"capital": "Dublin",
		"region": "Europe",
		"subregion": "Northern Europe",
		"flagPath": "/images/svg/ie.svg",
		"location": {
			"lat": 53,
			"lng": -8
		},
		"countryShapeId": "372"
	},
	{
		"code": "il",
		"country": "Israel",
		"capital": "Jerusalem",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/il.svg",
		"location": {
			"lat": 31.47,
			"lng": 35.13
		},
		"countryShapeId": "376"
	},
	{
		"code": "it",
		"country": "Italy",
		"capital": "Rome",
		"region": "Europe",
		"subregion": "Southern Europe",
		"flagPath": "/images/svg/it.svg",
		"location": {
			"lat": 42.83333333,
			"lng": 12.83333333
		},
		"countryShapeId": "380"
	},
	{
		"code": "ci",
		"country": "Ivory Coast",
		"capital": "Yamoussoukro",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/ci.svg",
		"location": {
			"lat": 8,
			"lng": -5
		},
		"countryShapeId": "384"
	},
	{
		"code": "jm",
		"country": "Jamaica",
		"capital": "Kingston",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/jm.svg",
		"location": {
			"lat": 18.25,
			"lng": -77.5
		},
		"countryShapeId": "388"
	},
	{
		"code": "jp",
		"country": "Japan",
		"capital": "Tokyo",
		"region": "Asia",
		"subregion": "Eastern Asia",
		"flagPath": "/images/svg/jp.svg",
		"location": {
			"lat": 36,
			"lng": 138
		},
		"countryShapeId": "392"
	},
	{
		"code": "jo",
		"country": "Jordan",
		"capital": "Amman",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/jo.svg",
		"location": {
			"lat": 31,
			"lng": 36
		},
		"countryShapeId": "400"
	},
	{
		"code": "kz",
		"country": "Kazakhstan",
		"capital": "Astana",
		"region": "Asia",
		"subregion": "Central Asia",
		"flagPath": "/images/svg/kz.svg",
		"location": {
			"lat": 48,
			"lng": 68
		},
		"countryShapeId": "398"
	},
	{
		"code": "ke",
		"country": "Kenya",
		"capital": "Nairobi",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/ke.svg",
		"location": {
			"lat": 1,
			"lng": 38
		},
		"countryShapeId": "404"
	},
	{
		"code": "ki",
		"country": "Kiribati",
		"capital": "South Tarawa",
		"region": "Oceania",
		"subregion": "Micronesia",
		"flagPath": "/images/svg/ki.svg",
		"location": {
			"lat": 1.41666666,
			"lng": 173
		},
		"countryShapeId": "296"
	},
	{
		"code": "xk",
		"country": "Kosovo",
		"capital": "Pristina",
		"region": "Europe",
		"subregion": "Southeast Europe",
		"flagPath": "/images/svg/xk.svg",
		"location": {
			"lat": 42.666667,
			"lng": 21.166667
		},
		"countryShapeId": null
	},
	{
		"code": "kw",
		"country": "Kuwait",
		"capital": "Kuwait City",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/kw.svg",
		"location": {
			"lat": 29.5,
			"lng": 45.75
		},
		"countryShapeId": "414"
	},
	{
		"code": "kg",
		"country": "Kyrgyzstan",
		"capital": "Bishkek",
		"region": "Asia",
		"subregion": "Central Asia",
		"flagPath": "/images/svg/kg.svg",
		"location": {
			"lat": 41,
			"lng": 75
		},
		"countryShapeId": "417"
	},
	{
		"code": "la",
		"country": "Laos",
		"capital": "Vientiane",
		"region": "Asia",
		"subregion": "South-Eastern Asia",
		"flagPath": "/images/svg/la.svg",
		"location": {
			"lat": 18,
			"lng": 105
		},
		"countryShapeId": "418"
	},
	{
		"code": "lv",
		"country": "Latvia",
		"capital": "Riga",
		"region": "Europe",
		"subregion": "Northern Europe",
		"flagPath": "/images/svg/lv.svg",
		"location": {
			"lat": 57,
			"lng": 25
		},
		"countryShapeId": "428"
	},
	{
		"code": "lb",
		"country": "Lebanon",
		"capital": "Beirut",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/lb.svg",
		"location": {
			"lat": 33.83333333,
			"lng": 35.83333333
		},
		"countryShapeId": "422"
	},
	{
		"code": "ls",
		"country": "Lesotho",
		"capital": "Maseru",
		"region": "Africa",
		"subregion": "Southern Africa",
		"flagPath": "/images/svg/ls.svg",
		"location": {
			"lat": -29.5,
			"lng": 28.5
		},
		"countryShapeId": "426"
	},
	{
		"code": "lr",
		"country": "Liberia",
		"capital": "Monrovia",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/lr.svg",
		"location": {
			"lat": 6.5,
			"lng": -9.5
		},
		"countryShapeId": "430"
	},
	{
		"code": "ly",
		"country": "Libya",
		"capital": "Tripoli",
		"region": "Africa",
		"subregion": "Northern Africa",
		"flagPath": "/images/svg/ly.svg",
		"location": {
			"lat": 25,
			"lng": 17
		},
		"countryShapeId": "434"
	},
	{
		"code": "li",
		"country": "Liechtenstein",
		"capital": "Vaduz",
		"region": "Europe",
		"subregion": "Western Europe",
		"flagPath": "/images/svg/li.svg",
		"location": {
			"lat": 47.26666666,
			"lng": 9.53333333
		},
		"countryShapeId": "438"
	},
	{
		"code": "lt",
		"country": "Lithuania",
		"capital": "Vilnius",
		"region": "Europe",
		"subregion": "Northern Europe",
		"flagPath": "/images/svg/lt.svg",
		"location": {
			"lat": 56,
			"lng": 24
		},
		"countryShapeId": "440"
	},
	{
		"code": "lu",
		"country": "Luxembourg",
		"capital": "Luxembourg",
		"region": "Europe",
		"subregion": "Western Europe",
		"flagPath": "/images/svg/lu.svg",
		"location": {
			"lat": 49.75,
			"lng": 6.16666666
		},
		"countryShapeId": "442"
	},
	{
		"code": "mg",
		"country": "Madagascar",
		"capital": "Antananarivo",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/mg.svg",
		"location": {
			"lat": -20,
			"lng": 47
		},
		"countryShapeId": "450"
	},
	{
		"code": "mw",
		"country": "Malawi",
		"capital": "Lilongwe",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/mw.svg",
		"location": {
			"lat": -13.5,
			"lng": 34
		},
		"countryShapeId": "454"
	},
	{
		"code": "my",
		"country": "Malaysia",
		"capital": "Kuala Lumpur",
		"region": "Asia",
		"subregion": "South-Eastern Asia",
		"flagPath": "/images/svg/my.svg",
		"location": {
			"lat": 2.5,
			"lng": 112.5
		},
		"countryShapeId": "458"
	},
	{
		"code": "mv",
		"country": "Maldives",
		"capital": "Malé",
		"region": "Asia",
		"subregion": "Southern Asia",
		"flagPath": "/images/svg/mv.svg",
		"location": {
			"lat": 3.25,
			"lng": 73
		},
		"countryShapeId": "462"
	},
	{
		"code": "ml",
		"country": "Mali",
		"capital": "Bamako",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/ml.svg",
		"location": {
			"lat": 17,
			"lng": -4
		},
		"countryShapeId": "466"
	},
	{
		"code": "mt",
		"country": "Malta",
		"capital": "Valletta",
		"region": "Europe",
		"subregion": "Southern Europe",
		"flagPath": "/images/svg/mt.svg",
		"location": {
			"lat": 35.83333333,
			"lng": 14.58333333
		},
		"countryShapeId": "470"
	},
	{
		"code": "mh",
		"country": "Marshall Islands",
		"capital": "Majuro",
		"region": "Oceania",
		"subregion": "Micronesia",
		"flagPath": "/images/svg/mh.svg",
		"location": {
			"lat": 9,
			"lng": 168
		},
		"countryShapeId": "584"
	},
	{
		"code": "mr",
		"country": "Mauritania",
		"capital": "Nouakchott",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/mr.svg",
		"location": {
			"lat": 20,
			"lng": -12
		},
		"countryShapeId": "478"
	},
	{
		"code": "mu",
		"country": "Mauritius",
		"capital": "Port Louis",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/mu.svg",
		"location": {
			"lat": -20.28333333,
			"lng": 57.55
		},
		"countryShapeId": "480"
	},
	{
		"code": "mx",
		"country": "Mexico",
		"capital": "Mexico City",
		"region": "Americas",
		"subregion": "North America",
		"flagPath": "/images/svg/mx.svg",
		"location": {
			"lat": 23,
			"lng": -102
		},
		"countryShapeId": "484"
	},
	{
		"code": "fm",
		"country": "Micronesia",
		"capital": "Palikir",
		"region": "Oceania",
		"subregion": "Micronesia",
		"flagPath": "/images/svg/fm.svg",
		"location": {
			"lat": 6.91666666,
			"lng": 158.25
		},
		"countryShapeId": "583"
	},
	{
		"code": "md",
		"country": "Moldova",
		"capital": "Chișinău",
		"region": "Europe",
		"subregion": "Eastern Europe",
		"flagPath": "/images/svg/md.svg",
		"location": {
			"lat": 47,
			"lng": 29
		},
		"countryShapeId": "498"
	},
	{
		"code": "mc",
		"country": "Monaco",
		"capital": "Monaco",
		"region": "Europe",
		"subregion": "Western Europe",
		"flagPath": "/images/svg/mc.svg",
		"location": {
			"lat": 43.73333333,
			"lng": 7.4
		},
		"countryShapeId": "492"
	},
	{
		"code": "mn",
		"country": "Mongolia",
		"capital": "Ulan Bator",
		"region": "Asia",
		"subregion": "Eastern Asia",
		"flagPath": "/images/svg/mn.svg",
		"location": {
			"lat": 46,
			"lng": 105
		},
		"countryShapeId": "496"
	},
	{
		"code": "me",
		"country": "Montenegro",
		"capital": "Podgorica",
		"region": "Europe",
		"subregion": "Southeast Europe",
		"flagPath": "/images/svg/me.svg",
		"location": {
			"lat": 42.5,
			"lng": 19.3
		},
		"countryShapeId": "499"
	},
	{
		"code": "ma",
		"country": "Morocco",
		"capital": "Rabat",
		"region": "Africa",
		"subregion": "Northern Africa",
		"flagPath": "/images/svg/ma.svg",
		"location": {
			"lat": 32,
			"lng": -5
		},
		"countryShapeId": "504"
	},
	{
		"code": "mz",
		"country": "Mozambique",
		"capital": "Maputo",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/mz.svg",
		"location": {
			"lat": -18.25,
			"lng": 35
		},
		"countryShapeId": "508"
	},
	{
		"code": "mm",
		"country": "Myanmar",
		"capital": "Naypyidaw",
		"region": "Asia",
		"subregion": "South-Eastern Asia",
		"flagPath": "/images/svg/mm.svg",
		"location": {
			"lat": 22,
			"lng": 98
		},
		"countryShapeId": "104"
	},
	{
		"code": "na",
		"country": "Namibia",
		"capital": "Windhoek",
		"region": "Africa",
		"subregion": "Southern Africa",
		"flagPath": "/images/svg/na.svg",
		"location": {
			"lat": -22,
			"lng": 17
		},
		"countryShapeId": "516"
	},
	{
		"code": "nr",
		"country": "Nauru",
		"capital": "Yaren",
		"region": "Oceania",
		"subregion": "Micronesia",
		"flagPath": "/images/svg/nr.svg",
		"location": {
			"lat": -0.53333333,
			"lng": 166.91666666
		},
		"countryShapeId": "520"
	},
	{
		"code": "np",
		"country": "Nepal",
		"capital": "Kathmandu",
		"region": "Asia",
		"subregion": "Southern Asia",
		"flagPath": "/images/svg/np.svg",
		"location": {
			"lat": 28,
			"lng": 84
		},
		"countryShapeId": "524"
	},
	{
		"code": "nl",
		"country": "Netherlands",
		"capital": "Amsterdam",
		"region": "Europe",
		"subregion": "Western Europe",
		"flagPath": "/images/svg/nl.svg",
		"location": {
			"lat": 52.5,
			"lng": 5.75
		},
		"countryShapeId": "528"
	},
	{
		"code": "nz",
		"country": "New Zealand",
		"capital": "Wellington",
		"region": "Oceania",
		"subregion": "Australia and New Zealand",
		"flagPath": "/images/svg/nz.svg",
		"location": {
			"lat": -41,
			"lng": 174
		},
		"countryShapeId": "554"
	},
	{
		"code": "ni",
		"country": "Nicaragua",
		"capital": "Managua",
		"region": "Americas",
		"subregion": "Central America",
		"flagPath": "/images/svg/ni.svg",
		"location": {
			"lat": 13,
			"lng": -85
		},
		"countryShapeId": "558"
	},
	{
		"code": "ne",
		"country": "Niger",
		"capital": "Niamey",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/ne.svg",
		"location": {
			"lat": 16,
			"lng": 8
		},
		"countryShapeId": "562"
	},
	{
		"code": "ng",
		"country": "Nigeria",
		"capital": "Abuja",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/ng.svg",
		"location": {
			"lat": 10,
			"lng": 8
		},
		"countryShapeId": "566"
	},
	{
		"code": "kp",
		"country": "North Korea",
		"capital": "Pyongyang",
		"region": "Asia",
		"subregion": "Eastern Asia",
		"flagPath": "/images/svg/kp.svg",
		"location": {
			"lat": 40,
			"lng": 127
		},
		"countryShapeId": "408"
	},
	{
		"code": "mk",
		"country": "North Macedonia",
		"capital": "Skopje",
		"region": "Europe",
		"subregion": "Southeast Europe",
		"flagPath": "/images/svg/mk.svg",
		"location": {
			"lat": 41.83333333,
			"lng": 22
		},
		"countryShapeId": "807"
	},
	{
		"code": "no",
		"country": "Norway",
		"capital": "Oslo",
		"region": "Europe",
		"subregion": "Northern Europe",
		"flagPath": "/images/svg/no.svg",
		"location": {
			"lat": 62,
			"lng": 10
		},
		"countryShapeId": "578"
	},
	{
		"code": "om",
		"country": "Oman",
		"capital": "Muscat",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/om.svg",
		"location": {
			"lat": 21,
			"lng": 57
		},
		"countryShapeId": "512"
	},
	{
		"code": "pk",
		"country": "Pakistan",
		"capital": "Islamabad",
		"region": "Asia",
		"subregion": "Southern Asia",
		"flagPath": "/images/svg/pk.svg",
		"location": {
			"lat": 30,
			"lng": 70
		},
		"countryShapeId": "586"
	},
	{
		"code": "pw",
		"country": "Palau",
		"capital": "Ngerulmud",
		"region": "Oceania",
		"subregion": "Micronesia",
		"flagPath": "/images/svg/pw.svg",
		"location": {
			"lat": 7.5,
			"lng": 134.5
		},
		"countryShapeId": "585"
	},
	{
		"code": "pa",
		"country": "Panama",
		"capital": "Panama City",
		"region": "Americas",
		"subregion": "Central America",
		"flagPath": "/images/svg/pa.svg",
		"location": {
			"lat": 9,
			"lng": -80
		},
		"countryShapeId": "591"
	},
	{
		"code": "pg",
		"country": "Papua New Guinea",
		"capital": "Port Moresby",
		"region": "Oceania",
		"subregion": "Melanesia",
		"flagPath": "/images/svg/pg.svg",
		"location": {
			"lat": -6,
			"lng": 147
		},
		"countryShapeId": "598"
	},
	{
		"code": "py",
		"country": "Paraguay",
		"capital": "Asunción",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/py.svg",
		"location": {
			"lat": -23,
			"lng": -58
		},
		"countryShapeId": "600"
	},
	{
		"code": "pe",
		"country": "Peru",
		"capital": "Lima",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/pe.svg",
		"location": {
			"lat": -10,
			"lng": -76
		},
		"countryShapeId": "604"
	},
	{
		"code": "ph",
		"country": "Philippines",
		"capital": "Manila",
		"region": "Asia",
		"subregion": "South-Eastern Asia",
		"flagPath": "/images/svg/ph.svg",
		"location": {
			"lat": 13,
			"lng": 122
		},
		"countryShapeId": "608"
	},
	{
		"code": "pl",
		"country": "Poland",
		"capital": "Warsaw",
		"region": "Europe",
		"subregion": "Central Europe",
		"flagPath": "/images/svg/pl.svg",
		"location": {
			"lat": 52,
			"lng": 20
		},
		"countryShapeId": "616"
	},
	{
		"code": "pt",
		"country": "Portugal",
		"capital": "Lisbon",
		"region": "Europe",
		"subregion": "Southern Europe",
		"flagPath": "/images/svg/pt.svg",
		"location": {
			"lat": 39.5,
			"lng": -8
		},
		"countryShapeId": "620"
	},
	{
		"code": "qa",
		"country": "Qatar",
		"capital": "Doha",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/qa.svg",
		"location": {
			"lat": 25.5,
			"lng": 51.25
		},
		"countryShapeId": "634"
	},
	{
		"code": "cg",
		"country": "Republic of the Congo",
		"capital": "Brazzaville",
		"region": "Africa",
		"subregion": "Middle Africa",
		"flagPath": "/images/svg/cg.svg",
		"location": {
			"lat": -1,
			"lng": 15
		},
		"countryShapeId": "178"
	},
	{
		"code": "ro",
		"country": "Romania",
		"capital": "Bucharest",
		"region": "Europe",
		"subregion": "Southeast Europe",
		"flagPath": "/images/svg/ro.svg",
		"location": {
			"lat": 46,
			"lng": 25
		},
		"countryShapeId": "642"
	},
	{
		"code": "ru",
		"country": "Russia",
		"capital": "Moscow",
		"region": "Europe",
		"subregion": "Eastern Europe",
		"flagPath": "/images/svg/ru.svg",
		"location": {
			"lat": 60,
			"lng": 100
		},
		"countryShapeId": "643"
	},
	{
		"code": "rw",
		"country": "Rwanda",
		"capital": "Kigali",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/rw.svg",
		"location": {
			"lat": -2,
			"lng": 30
		},
		"countryShapeId": "646"
	},
	{
		"code": "kn",
		"country": "Saint Kitts and Nevis",
		"capital": "Basseterre",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/kn.svg",
		"location": {
			"lat": 17.33333333,
			"lng": -62.75
		},
		"countryShapeId": "659"
	},
	{
		"code": "lc",
		"country": "Saint Lucia",
		"capital": "Castries",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/lc.svg",
		"location": {
			"lat": 13.88333333,
			"lng": -60.96666666
		},
		"countryShapeId": "662"
	},
	{
		"code": "vc",
		"country": "Saint Vincent and the Grenadines",
		"capital": "Kingstown",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/vc.svg",
		"location": {
			"lat": 13.25,
			"lng": -61.2
		},
		"countryShapeId": "670"
	},
	{
		"code": "ws",
		"country": "Samoa",
		"capital": "Apia",
		"region": "Oceania",
		"subregion": "Polynesia",
		"flagPath": "/images/svg/ws.svg",
		"location": {
			"lat": -13.58333333,
			"lng": -172.33333333
		},
		"countryShapeId": "882"
	},
	{
		"code": "sm",
		"country": "San Marino",
		"capital": "City of San Marino",
		"region": "Europe",
		"subregion": "Southern Europe",
		"flagPath": "/images/svg/sm.svg",
		"location": {
			"lat": 43.76666666,
			"lng": 12.41666666
		},
		"countryShapeId": "674"
	},
	{
		"code": "st",
		"country": "São Tomé and Príncipe",
		"capital": "São Tomé",
		"region": "Africa",
		"subregion": "Middle Africa",
		"flagPath": "/images/svg/st.svg",
		"location": {
			"lat": 1,
			"lng": 7
		},
		"countryShapeId": "678"
	},
	{
		"code": "sa",
		"country": "Saudi Arabia",
		"capital": "Riyadh",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/sa.svg",
		"location": {
			"lat": 25,
			"lng": 45
		},
		"countryShapeId": "682"
	},
	{
		"code": "sn",
		"country": "Senegal",
		"capital": "Dakar",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/sn.svg",
		"location": {
			"lat": 14,
			"lng": -14
		},
		"countryShapeId": "686"
	},
	{
		"code": "rs",
		"country": "Serbia",
		"capital": "Belgrade",
		"region": "Europe",
		"subregion": "Southeast Europe",
		"flagPath": "/images/svg/rs.svg",
		"location": {
			"lat": 44,
			"lng": 21
		},
		"countryShapeId": "688"
	},
	{
		"code": "sc",
		"country": "Seychelles",
		"capital": "Victoria",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/sc.svg",
		"location": {
			"lat": -4.58333333,
			"lng": 55.66666666
		},
		"countryShapeId": "690"
	},
	{
		"code": "sl",
		"country": "Sierra Leone",
		"capital": "Freetown",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/sl.svg",
		"location": {
			"lat": 8.5,
			"lng": -11.5
		},
		"countryShapeId": "694"
	},
	{
		"code": "sg",
		"country": "Singapore",
		"capital": "Singapore",
		"region": "Asia",
		"subregion": "South-Eastern Asia",
		"flagPath": "/images/svg/sg.svg",
		"location": {
			"lat": 1.36666666,
			"lng": 103.8
		},
		"countryShapeId": "702"
	},
	{
		"code": "sk",
		"country": "Slovakia",
		"capital": "Bratislava",
		"region": "Europe",
		"subregion": "Central Europe",
		"flagPath": "/images/svg/sk.svg",
		"location": {
			"lat": 48.66666666,
			"lng": 19.5
		},
		"countryShapeId": "703"
	},
	{
		"code": "si",
		"country": "Slovenia",
		"capital": "Ljubljana",
		"region": "Europe",
		"subregion": "Central Europe",
		"flagPath": "/images/svg/si.svg",
		"location": {
			"lat": 46.11666666,
			"lng": 14.81666666
		},
		"countryShapeId": "705"
	},
	{
		"code": "sb",
		"country": "Solomon Islands",
		"capital": "Honiara",
		"region": "Oceania",
		"subregion": "Melanesia",
		"flagPath": "/images/svg/sb.svg",
		"location": {
			"lat": -8,
			"lng": 159
		},
		"countryShapeId": "090"
	},
	{
		"code": "so",
		"country": "Somalia",
		"capital": "Mogadishu",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/so.svg",
		"location": {
			"lat": 10,
			"lng": 49
		},
		"countryShapeId": "706"
	},
	{
		"code": "za",
		"country": "South Africa",
		"capital": "Pretoria",
		"region": "Africa",
		"subregion": "Southern Africa",
		"flagPath": "/images/svg/za.svg",
		"location": {
			"lat": -29,
			"lng": 24
		},
		"countryShapeId": "710"
	},
	{
		"code": "kr",
		"country": "South Korea",
		"capital": "Seoul",
		"region": "Asia",
		"subregion": "Eastern Asia",
		"flagPath": "/images/svg/kr.svg",
		"location": {
			"lat": 37,
			"lng": 127.5
		},
		"countryShapeId": "410"
	},
	{
		"code": "ss",
		"country": "South Sudan",
		"capital": "Juba",
		"region": "Africa",
		"subregion": "Middle Africa",
		"flagPath": "/images/svg/ss.svg",
		"location": {
			"lat": 7,
			"lng": 30
		},
		"countryShapeId": "728"
	},
	{
		"code": "es",
		"country": "Spain",
		"capital": "Madrid",
		"region": "Europe",
		"subregion": "Southern Europe",
		"flagPath": "/images/svg/es.svg",
		"location": {
			"lat": 40,
			"lng": -4
		},
		"countryShapeId": "724"
	},
	{
		"code": "lk",
		"country": "Sri Lanka",
		"capital": "Colombo",
		"region": "Asia",
		"subregion": "Southern Asia",
		"flagPath": "/images/svg/lk.svg",
		"location": {
			"lat": 7,
			"lng": 81
		},
		"countryShapeId": "144"
	},
	{
		"code": "sd",
		"country": "Sudan",
		"capital": "Khartoum",
		"region": "Africa",
		"subregion": "Northern Africa",
		"flagPath": "/images/svg/sd.svg",
		"location": {
			"lat": 15,
			"lng": 30
		},
		"countryShapeId": "729"
	},
	{
		"code": "sr",
		"country": "Suriname",
		"capital": "Paramaribo",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/sr.svg",
		"location": {
			"lat": 4,
			"lng": -56
		},
		"countryShapeId": "740"
	},
	{
		"code": "se",
		"country": "Sweden",
		"capital": "Stockholm",
		"region": "Europe",
		"subregion": "Northern Europe",
		"flagPath": "/images/svg/se.svg",
		"location": {
			"lat": 62,
			"lng": 15
		},
		"countryShapeId": "752"
	},
	{
		"code": "ch",
		"country": "Switzerland",
		"capital": "Bern",
		"region": "Europe",
		"subregion": "Western Europe",
		"flagPath": "/images/svg/ch.svg",
		"location": {
			"lat": 47,
			"lng": 8
		},
		"countryShapeId": "756"
	},
	{
		"code": "sy",
		"country": "Syria",
		"capital": "Damascus",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/sy.svg",
		"location": {
			"lat": 35,
			"lng": 38
		},
		"countryShapeId": "760"
	},
	{
		"code": "tj",
		"country": "Tajikistan",
		"capital": "Dushanbe",
		"region": "Asia",
		"subregion": "Central Asia",
		"flagPath": "/images/svg/tj.svg",
		"location": {
			"lat": 39,
			"lng": 71
		},
		"countryShapeId": "762"
	},
	{
		"code": "tz",
		"country": "Tanzania",
		"capital": "Dodoma",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/tz.svg",
		"location": {
			"lat": -6,
			"lng": 35
		},
		"countryShapeId": "834"
	},
	{
		"code": "th",
		"country": "Thailand",
		"capital": "Bangkok",
		"region": "Asia",
		"subregion": "South-Eastern Asia",
		"flagPath": "/images/svg/th.svg",
		"location": {
			"lat": 15,
			"lng": 100
		},
		"countryShapeId": "764"
	},
	{
		"code": "bs",
		"country": "The Bahamas",
		"capital": "Nassau",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/bs.svg",
		"location": {
			"lat": 24.25,
			"lng": -76
		},
		"countryShapeId": "044"
	},
	{
		"code": "gm",
		"country": "The Gambia",
		"capital": "Banjul",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/gm.svg",
		"location": {
			"lat": 13.46666666,
			"lng": -16.56666666
		},
		"countryShapeId": "270"
	},
	{
		"code": "tl",
		"country": "Timor-Leste",
		"capital": "Dili",
		"region": "Asia",
		"subregion": "South-Eastern Asia",
		"flagPath": "/images/svg/tl.svg",
		"location": {
			"lat": -8.83333333,
			"lng": 125.91666666
		},
		"countryShapeId": "626"
	},
	{
		"code": "tg",
		"country": "Togo",
		"capital": "Lomé",
		"region": "Africa",
		"subregion": "Western Africa",
		"flagPath": "/images/svg/tg.svg",
		"location": {
			"lat": 8,
			"lng": 1.16666666
		},
		"countryShapeId": "768"
	},
	{
		"code": "to",
		"country": "Tonga",
		"capital": "Nuku'alofa",
		"region": "Oceania",
		"subregion": "Polynesia",
		"flagPath": "/images/svg/to.svg",
		"location": {
			"lat": -20,
			"lng": -175
		},
		"countryShapeId": "776"
	},
	{
		"code": "tt",
		"country": "Trinidad and Tobago",
		"capital": "Port of Spain",
		"region": "Americas",
		"subregion": "Caribbean",
		"flagPath": "/images/svg/tt.svg",
		"location": {
			"lat": 11,
			"lng": -61
		},
		"countryShapeId": "780"
	},
	{
		"code": "tn",
		"country": "Tunisia",
		"capital": "Tunis",
		"region": "Africa",
		"subregion": "Northern Africa",
		"flagPath": "/images/svg/tn.svg",
		"location": {
			"lat": 34,
			"lng": 9
		},
		"countryShapeId": "788"
	},
	{
		"code": "tr",
		"country": "Türkiye",
		"capital": "Ankara",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/tr.svg",
		"location": {
			"lat": 39,
			"lng": 35
		},
		"countryShapeId": "792"
	},
	{
		"code": "tm",
		"country": "Turkmenistan",
		"capital": "Ashgabat",
		"region": "Asia",
		"subregion": "Central Asia",
		"flagPath": "/images/svg/tm.svg",
		"location": {
			"lat": 40,
			"lng": 60
		},
		"countryShapeId": "795"
	},
	{
		"code": "tv",
		"country": "Tuvalu",
		"capital": "Funafuti",
		"region": "Oceania",
		"subregion": "Polynesia",
		"flagPath": "/images/svg/tv.svg",
		"location": {
			"lat": -8,
			"lng": 178
		},
		"countryShapeId": "798"
	},
	{
		"code": "ug",
		"country": "Uganda",
		"capital": "Kampala",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/ug.svg",
		"location": {
			"lat": 1,
			"lng": 32
		},
		"countryShapeId": "800"
	},
	{
		"code": "ua",
		"country": "Ukraine",
		"capital": "Kyiv",
		"region": "Europe",
		"subregion": "Eastern Europe",
		"flagPath": "/images/svg/ua.svg",
		"location": {
			"lat": 49,
			"lng": 32
		},
		"countryShapeId": "804"
	},
	{
		"code": "ae",
		"country": "United Arab Emirates",
		"capital": "Abu Dhabi",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/ae.svg",
		"location": {
			"lat": 24,
			"lng": 54
		},
		"countryShapeId": "784"
	},
	{
		"code": "gb",
		"country": "United Kingdom",
		"capital": "London",
		"region": "Europe",
		"subregion": "Northern Europe",
		"flagPath": "/images/svg/gb.svg",
		"location": {
			"lat": 54,
			"lng": -2
		},
		"countryShapeId": "826"
	},
	{
		"code": "us",
		"country": "United States",
		"capital": "Washington D.C.",
		"region": "Americas",
		"subregion": "North America",
		"flagPath": "/images/svg/us.svg",
		"location": {
			"lat": 38,
			"lng": -97
		},
		"countryShapeId": "840"
	},
	{
		"code": "uy",
		"country": "Uruguay",
		"capital": "Montevideo",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/uy.svg",
		"location": {
			"lat": -33,
			"lng": -56
		},
		"countryShapeId": "858"
	},
	{
		"code": "uz",
		"country": "Uzbekistan",
		"capital": "Tashkent",
		"region": "Asia",
		"subregion": "Central Asia",
		"flagPath": "/images/svg/uz.svg",
		"location": {
			"lat": 41,
			"lng": 64
		},
		"countryShapeId": "860"
	},
	{
		"code": "vu",
		"country": "Vanuatu",
		"capital": "Port Vila",
		"region": "Oceania",
		"subregion": "Melanesia",
		"flagPath": "/images/svg/vu.svg",
		"location": {
			"lat": -16,
			"lng": 167
		},
		"countryShapeId": "548"
	},
	{
		"code": "va",
		"country": "Vatican City",
		"capital": "Vatican City",
		"region": "Europe",
		"subregion": "Southern Europe",
		"flagPath": "/images/svg/va.svg",
		"location": {
			"lat": 41.9,
			"lng": 12.45
		},
		"countryShapeId": "336"
	},
	{
		"code": "ve",
		"country": "Venezuela",
		"capital": "Caracas",
		"region": "Americas",
		"subregion": "South America",
		"flagPath": "/images/svg/ve.svg",
		"location": {
			"lat": 8,
			"lng": -66
		},
		"countryShapeId": "862"
	},
	{
		"code": "vn",
		"country": "Vietnam",
		"capital": "Hanoi",
		"region": "Asia",
		"subregion": "South-Eastern Asia",
		"flagPath": "/images/svg/vn.svg",
		"location": {
			"lat": 16.16666666,
			"lng": 107.83333333
		},
		"countryShapeId": "704"
	},
	{
		"code": "ye",
		"country": "Yemen",
		"capital": "Sana'a",
		"region": "Asia",
		"subregion": "Western Asia",
		"flagPath": "/images/svg/ye.svg",
		"location": {
			"lat": 15,
			"lng": 48
		},
		"countryShapeId": "887"
	},
	{
		"code": "zm",
		"country": "Zambia",
		"capital": "Lusaka",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/zm.svg",
		"location": {
			"lat": -15,
			"lng": 30
		},
		"countryShapeId": "894"
	},
	{
		"code": "zw",
		"country": "Zimbabwe",
		"capital": "Harare",
		"region": "Africa",
		"subregion": "Eastern Africa",
		"flagPath": "/images/svg/zw.svg",
		"location": {
			"lat": -20,
			"lng": 30
		},
		"countryShapeId": "716"
	}
]
;
