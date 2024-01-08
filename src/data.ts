// src/data.js
// Import the flags from the svg-country-flags package
//gibraltar missing?
//greenland
//guam
//hong kong hk
// macedonia mk

export type CountryData = {
	country: string;
	capital: string;
	flagImage: string;
	similarCountries: string[];
	similarCapitals: string[];
};

const countriesData: CountryData[] = [
	{
		country: "Algeria",
		capital: "TBA",
		flagImage: "/images/svg/dz.svg",
		similarCountries: ["Pakistan"],
		similarCapitals: [],
	},
	{
		country: "Benin",
		capital: "TBA",
		flagImage: "/images/svg/bj.svg",
		similarCountries: ["Guinea-Bissau"],
		similarCapitals: [],
	},
	{
		country: "Cameroon",
		capital: "TBA",
		flagImage: "/images/svg/cm.svg",
		similarCountries: ["Mali", "Senegal", "Guinea"],
		similarCapitals: [],
	},
	{
		country: "Chad",
		capital: "TBA",
		flagImage: "/images/svg/td.svg",
		similarCountries: ["Andorra", "Moldova", "Armenia"],
		similarCapitals: [],
	},
	{
		country: "Gabon",
		capital: "TBA",
		flagImage: "/images/svg/ga.svg",
		similarCountries: ["Sierra Leone"],
		similarCapitals: [],
	},
	{
		country: "Ghana",
		capital: "TBA",
		flagImage: "/images/svg/gh.svg",
		similarCountries: ["São Tomé  and Príncipe"],
		similarCapitals: [],
	},
	{
		country: "Guinea",
		capital: "TBA",
		flagImage: "/images/svg/gn.svg",
		similarCountries: ["Mali", "Senegal", "Cameroon"],
		similarCapitals: [],
	},
	{
		country: "Guinea-Bissau",
		capital: "TBA",
		flagImage: "/images/svg/gw.svg",
		similarCountries: ["Benin"],
		similarCapitals: [],
	},
	{
		country: "Ivory Coast",
		capital: "TBA",
		flagImage: "/images/svg/ci.svg",
		similarCountries: ["Ireland", "Italy"],
		similarCapitals: [],
	},
	{
		country: "Liberia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Malaysia"],
		similarCapitals: [],
	},
	{
		country: "Mali",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Senegal", "Guinea", "Cameroon"],
		similarCapitals: [],
	},
	{
		country: "Morocco",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["China"],
		similarCapitals: [],
	},
	{
		country: "Niger",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["India"],
		similarCapitals: [],
	},
	{
		country: "São Tomé  and Príncipe",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Ghana"],
		similarCapitals: [],
	},
	{
		country: "Senegal",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Mali", "Guinea", "Cameroon"],
		similarCapitals: [],
	},
	{
		country: "Sierra Leone",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Gabon"],
		similarCapitals: [],
	},
	{
		country: "Somalia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Micronesia"],
		similarCapitals: [],
	},
	{
		country: "South Africa",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Vanuatu"],
		similarCapitals: [],
	},
	{
		country: "Tanzania",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Saint Kitts and Nevis"],
		similarCapitals: [],
	},
	{
		country: "Tunisia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Turkey"],
		similarCapitals: [],
	},
	{
		country: "Armenia",
		capital: "TBA",
		flagImage: "/images/svg/am.svg",
		similarCountries: ["Lithuania"],
		similarCapitals: [],
	},
	{
		country: "Bahrain",
		capital: "TBA",
		flagImage: "/images/svg/bh.svg",
		similarCountries: ["Qatar"],
		similarCapitals: [],
	},
	{
		country: "China",
		capital: "TBA",
		flagImage: "/images/svg/cn.svg",
		similarCountries: ["Vietnam", "Morocco"],
		similarCapitals: [],
	},
	{
		country: "India",
		capital: "TBA",
		flagImage: "/images/svg/in.svg",
		similarCountries: ["Niger"],
		similarCapitals: [],
	},
	{
		country: "Indonesia",
		capital: "TBA",
		flagImage: "/images/svg/id.svg",
		similarCountries: ["Poland", "Bahrain", "Pakistan"],
		similarCapitals: [],
	},
	{
		country: "Iran",
		capital: "TBA",
		flagImage: "/images/svg/ir.svg",
		similarCountries: ["Tajikistan"],
		similarCapitals: [],
	},
	{
		country: "Iraq",
		capital: "TBA",
		flagImage: "/images/svg/iq.svg",
		similarCountries: ["Syria", "Yemen"],
		similarCapitals: [],
	},
	{
		country: "Jordan",
		capital: "TBA",
		flagImage: "/images/svg/jo.svg",
		similarCountries: ["State of Palestine", "UAE"],
		similarCapitals: [],
	},
	{
		country: "Laos",
		capital: "TBA",
		flagImage: "/images/svg/la.svg",
		similarCountries: ["North Korea"],
		similarCapitals: [],
	},
	{
		country: "Malaysia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Liberia"],
		similarCapitals: [],
	},
	{
		country: "North Korea",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Laos"],
		similarCapitals: [],
	},
	{
		country: "Pakistan",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Algeria"],
		similarCapitals: [],
	},
	{
		country: "State of Palestine",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Jordan", "UAE"],
		similarCapitals: [],
	},
	{
		country: "Qatar",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Bahrain"],
		similarCapitals: [],
	},
	{
		country: "Russia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Slovakia", "Slovenia"],
		similarCapitals: [],
	},
	{
		country: "Syria",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Iraq", "Yemen"],
		similarCapitals: [],
	},
	{
		country: "Taiwan",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Samoa"],
		similarCapitals: [],
	},
	{
		country: "Tajikistan",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Iran"],
		similarCapitals: [],
	},
	{
		country: "Thailand",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Costa Rica"],
		similarCapitals: [],
	},
	{
		country: "Turkey",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Tunisia"],
		similarCapitals: [],
	},
	{
		country: "UAE",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Jordan", "State of Palestine"],
		similarCapitals: [],
	},
	{
		country: "Vietnam",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["China"],
		similarCapitals: [],
	},
	{
		country: "Yemen",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Iraq", "Syria"],
		similarCapitals: [],
	},
	{
		country: "Albania",
		capital: "TBA",
		flagImage: "/images/svg/al.svg",
		similarCountries: ["Montenegro"],
		similarCapitals: [],
	},
	{
		country: "Andorra",
		capital: "TBA",
		flagImage: "/images/svg/ad.svg",
		similarCountries: ["Romania", "Moldova"],
		similarCapitals: [],
	},
	{
		country: "Austria",
		capital: "TBA",
		flagImage: "/images/svg/at.svg",
		similarCountries: ["Latvia"],
		similarCapitals: [],
	},
	{
		country: "Belgium",
		capital: "TBA",
		flagImage: "/images/svg/be.svg",
		similarCountries: ["Germany"],
		similarCapitals: [],
	},
	{
		country: "Bulgaria",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Hungary"],
		similarCapitals: [],
	},
	{
		country: "Croatia",
		capital: "TBA",
		flagImage: "/images/svg/hr.svg",
		similarCountries: ["Netherlands"],
		similarCapitals: [],
	},
	{
		country: "Denmark",
		capital: "TBA",
		flagImage: "/images/svg/dk.svg",
		similarCountries: ["Norway"],
		similarCapitals: [],
	},
	{
		country: "Germany",
		capital: "TBA",
		flagImage: "/images/svg/de.svg",
		similarCountries: ["Belgium"],
		similarCapitals: [],
	},
	{
		country: "Greece",
		capital: "TBA",
		flagImage: "/images/svg/gr.svg",
		similarCountries: ["Uruguay"],
		similarCapitals: [],
	},
	{
		country: "Hungary",
		capital: "TBA",
		flagImage: "/images/svg/hu.svg",
		similarCountries: ["Bulgaria"],
		similarCapitals: [],
	},
	{
		country: "Iceland",
		capital: "TBA",
		flagImage: "/images/svg/is.svg",
		similarCountries: ["Sweden"],
		similarCapitals: [],
	},
	{
		country: "Ireland",
		capital: "TBA",
		flagImage: "/images/svg/ie.svg",
		similarCountries: ["Italy", "Ivory Coast"],
		similarCapitals: [],
	},
	{
		country: "Italy",
		capital: "TBA",
		flagImage: "/images/svg/it.svg",
		similarCountries: ["Ireland", "Mexico"],
		similarCapitals: [],
	},
	{
		country: "Latvia",
		capital: "TBA",
		flagImage: "/images/svg/lv.svg",
		similarCountries: ["Austria"],
		similarCapitals: [],
	},
	{
		country: "Liechtenstein",
		capital: "TBA",
		flagImage: "/images/svg/li.svg",
		similarCountries: ["Haiti"],
		similarCapitals: [],
	},
	{
		country: "Lithuania",
		capital: "TBA",
		flagImage: "/images/svg/lt.svg",
		similarCountries: ["Armenia"],
		similarCapitals: [],
	},
	{
		country: "Luxembourg",
		capital: "TBA",
		flagImage: "/images/svg/lu.svg",
		similarCountries: ["Netherlands"],
		similarCapitals: [],
	},
	{
		country: "Moldova",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Andorra", "Romania"],
		similarCapitals: [],
	},
	{
		country: "Monaco",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Poland", "Malta", "San Marino"],
		similarCapitals: [],
	},
	{
		country: "Montenegro",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Albania"],
		similarCapitals: [],
	},
	{
		country: "Netherlands",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Luxembourg"],
		similarCapitals: [],
	},
	{
		country: "Norway",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Iceland", "Denmark"],
		similarCapitals: [],
	},
	{
		country: "Poland",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Monaco", "Indonesia"],
		similarCapitals: [],
	},
	{
		country: "Romania",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Andorra", "Moldova", "Belgium"],
		similarCapitals: [],
	},
	{
		country: "Serbia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Slovakia"],
		similarCapitals: [],
	},
	{
		country: "Slovakia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Slovenia", "Russia"],
		similarCapitals: [],
	},
	{
		country: "Slovenia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Russia", "Slovakia"],
		similarCapitals: [],
	},
	{
		country: "Sweden",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Iceland"],
		similarCapitals: [],
	},
	{
		country: "Australia",
		capital: "TBA",
		flagImage: "/images/svg/au.svg",
		similarCountries: ["New Zealand"],
		similarCapitals: [],
	},
	{
		country: "Fiji",
		capital: "TBA",
		flagImage: "/images/svg/fj.svg",
		similarCountries: ["Vanuatu"],
		similarCapitals: [],
	},
	{
		country: "Micronesia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Somalia"],
		similarCapitals: [],
	},
	{
		country: "New Zealand",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Australia"],
		similarCapitals: [],
	},
	{
		country: "Samoa",
		capital: "TBA",
		flagImage: "/images/svg/as.svg", // i think
		similarCountries: ["Taiwan"],
		similarCapitals: [],
	},
	{
		country: "Tuvalu",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Fiji"],
		similarCapitals: [],
	},
	{
		country: "Vanuatu",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["South Africa"],
		similarCapitals: [],
	},
	{
		country: "Argentina",
		capital: "TBA",
		flagImage: "/images/svg/ar.svg",
		similarCountries: ["Guatemala"],
		similarCapitals: [],
	},
	{
		country: "Colombia",
		capital: "TBA",
		flagImage: "/images/svg/co.svg",
		similarCountries: ["Ecuador", "Venezuela"],
		similarCapitals: [],
	},
	{
		country: "Ecuador",
		capital: "TBA",
		flagImage: "/images/svg/ec.svg",
		similarCountries: ["Venezuela", "Colombia"],
		similarCapitals: [],
	},
	{
		country: "Paraguay",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Netherlands", "Croatia"],
		similarCapitals: [],
	},
	{
		country: "Uruguay",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Greece"],
		similarCapitals: [],
	},
	{
		country: "Venezuela",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Ecuador", "Colombia"],
		similarCapitals: [],
	},
	{
		country: "Costa Rica",
		capital: "TBA",
		flagImage: "/images/svg/cr.svg",
		similarCountries: ["Thailand"],
		similarCapitals: [],
	},
	{
		country: "El Salvador",
		capital: "TBA",
		flagImage: "/images/svg/sv.svg",
		similarCountries: ["Nicaragua", "Honduras"],
		similarCapitals: [],
	},
	{
		country: "Guatemala",
		capital: "TBA",
		flagImage: "/images/svg/gt.svg",
		similarCountries: ["Argentina"],
		similarCapitals: [],
	},
	{
		country: "Haiti",
		capital: "TBA",
		flagImage: "/images/svg/ht.svg",
		similarCountries: ["Liechtenstein"],
		similarCapitals: [],
	},
	{
		country: "Honduras",
		capital: "TBA",
		flagImage: "/images/svg/hn.svg",
		similarCountries: ["El Salvador", "Nicaragua"],
		similarCapitals: [],
	},
	{
		country: "Mexico",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Italy"],
		similarCapitals: [],
	},
	{
		country: "Nicaragua",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["El Salvador", "Honduras"],
		similarCapitals: [],
	},
	{
		country: "Saint Kitts and Nevis",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: ["Tanzania"],
		similarCapitals: [],
	},
	{ country: "Angola", capital: "TBA", flagImage: "/images/svg/ao.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Botswana", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Burkina Faso",
		capital: "TBA",
		flagImage: "/images/svg/bf.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Burundi", capital: "TBA", flagImage: "/images/svg/bi.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Cape Verde",
		capital: "TBA",
		flagImage: "/images/svg/cv.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{
		country: "Central African Republic",
		capital: "TBA",
		flagImage: "/images/svg/cf.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Comoros", capital: "TBA", flagImage: "/images/svg/km.svg", similarCountries: [], similarCapitals: [] },
	{ country: "DR Congo", capital: "TBA", flagImage: "/images/svg/cd.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Djibouti", capital: "TBA", flagImage: "/images/svg/dj.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Egypt", capital: "TBA", flagImage: "/images/svg/eg.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Equatorial Guinea",
		capital: "TBA",
		flagImage: "/images/svg/gq.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Eritrea", capital: "TBA", flagImage: "/images/svg/er.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Eswatini", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Ethiopia", capital: "TBA", flagImage: "/images/svg/et.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Gambia", capital: "TBA", flagImage: "/images/svg/gm.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Kenya", capital: "TBA", flagImage: "/images/svg/ke.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Lesotho", capital: "TBA", flagImage: "/images/svg/ls.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Libya", capital: "TBA", flagImage: "/images/svg/ly.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Madagascar",
		capital: "TBA",
		flagImage: "/images/svg/mg.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Malawi", capital: "TBA", flagImage: "/images/svg/mw.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Mauritania",
		capital: "TBA",
		flagImage: "/images/svg/mr.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Mauritius", capital: "TBA", flagImage: "/images/svg/mu.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Mozambique",
		capital: "TBA",
		flagImage: "/images/svg/mz.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Namibia", capital: "TBA", flagImage: "/images/svg/na.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Nigeria", capital: "TBA", flagImage: "/images/svg/ng.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Republic of the Congo",
		capital: "TBA",
		flagImage: "/images/svg/cg.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Rwanda", capital: "TBA", flagImage: "/images/svg/rw.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Seychelles",
		capital: "TBA",
		flagImage: "/images/svg/sc.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{
		country: "South Sudan",
		capital: "TBA",
		flagImage: "/images/svg/ss.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Sudan", capital: "TBA", flagImage: "/images/svg/sd.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Togo", capital: "TBA", flagImage: "/images/svg/tg.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Uganda", capital: "TBA", flagImage: "/images/svg/ug.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Zambia", capital: "TBA", flagImage: "/images/svg/zm.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Zimbabwe", capital: "TBA", flagImage: "/images/svg/zw.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Afghanistan",
		capital: "TBA",
		flagImage: "/images/svg/af.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{
		country: "Azerbaijan",
		capital: "TBA",
		flagImage: "/images/svg/az.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{
		country: "Bangladesh",
		capital: "TBA",
		flagImage: "/images/svg/bd.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Bhutan", capital: "TBA", flagImage: "/images/svg/bt.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Brunei", capital: "TBA", flagImage: "/images/svg/bn.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Cambodia", capital: "TBA", flagImage: "/images/svg/kh.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "East Timor",
		capital: "TBA",
		flagImage: "/images/svg/tl.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Georgia", capital: "TBA", flagImage: "/images/svg/ge.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Israel", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Japan", capital: "TBA", flagImage: "/images/svg/jp.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Kazakhstan",
		capital: "TBA",
		flagImage: "/images/svg/kz.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Kuwait", capital: "TBA", flagImage: "/images/svg/kw.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Kyrgyzstan",
		capital: "TBA",
		flagImage: "/images/svg/kg.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Lebanon", capital: "TBA", flagImage: "/images/svg/lb.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Maldives", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Mongolia", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Myanmar", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Nepal", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Oman", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Philippines",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{
		country: "Saudi Arabia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Singapore", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "South Korea",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Sri Lanka", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Turkmenistan",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{
		country: "Uzbekistan",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{
		country: "Antigua and Barbuda",
		capital: "TBA",
		flagImage: "/images/svg/ag.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Bahamas", capital: "TBA", flagImage: "/images/svg/bs.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Barbados", capital: "TBA", flagImage: "/images/svg/bb.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Belize", capital: "TBA", flagImage: "/images/svg/bz.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Bolivia", capital: "TBA", flagImage: "/images/svg/bo.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Brazil", capital: "TBA", flagImage: "/images/svg/br.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Canada", capital: "TBA", flagImage: "/images/svg/ca.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Chile", capital: "TBA", flagImage: "/images/svg/cl.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Cuba", capital: "TBA", flagImage: "/images/svg/cu.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Dominica", capital: "TBA", flagImage: "/images/svg/dm.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Dominican Republic",
		capital: "TBA",
		flagImage: "/images/svg/do.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Grenada", capital: "TBA", flagImage: "/images/svg/gd.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Guyana", capital: "TBA", flagImage: "/images/svg/gy.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Jamaica", capital: "TBA", flagImage: "/images/svg/jm.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Panama", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Peru", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Saint Lucia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{
		country: "Saint Vincent and Grenadines",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Suriname", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Trinidad and Tobago",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{
		country: "United States",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Belarus", capital: "TBA", flagImage: "/images/svg/by.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Bosnia and Herzegovina",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Cyprus", capital: "TBA", flagImage: "/images/svg/cy.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Czech Republic",
		capital: "TBA",
		flagImage: "/images/svg/cz.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Estonia", capital: "TBA", flagImage: "/images/svg/ee.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Finland", capital: "TBA", flagImage: "/images/svg/fi.svg", similarCountries: [], similarCapitals: [] },
	{ country: "France", capital: "TBA", flagImage: "/images/svg/fr.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Kosovo", capital: "TBA", flagImage: "/images/svg/xk.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Malta", capital: "TBA", flagImage: "/images/svg/mt.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "North Macedonia",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Portugal", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "San Marino",
		capital: "",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Spain", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Switzerland",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Ukraine", capital: "TBA", flagImage: "/images/svg/XXX.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "United Kingdom",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{
		country: "Vatican City",
		capital: "TBA",
		flagImage: "/images/svg/XXX.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Kiribati", capital: "TBA", flagImage: "/images/svg/ki.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Marshall Islands",
		capital: "TBA",
		flagImage: "/images/svg/mh.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Nauru", capital: "TBA", flagImage: "/images/svg/nr.svg", similarCountries: [], similarCapitals: [] },
	{ country: "Palau", capital: "TBA", flagImage: "/images/svg/pw.svg", similarCountries: [], similarCapitals: [] },
	{
		country: "Papua New Guinea",
		capital: "TBA",
		flagImage: "/images/svg/pg.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{
		country: "Solomon Islands",
		capital: "TBA",
		flagImage: "/images/svg/sb.svg",
		similarCountries: [],
		similarCapitals: [],
	},
	{ country: "Tonga", capital: "TBA", flagImage: "/images/svg/to.svg", similarCountries: [], similarCapitals: [] },
];

export default countriesData;
