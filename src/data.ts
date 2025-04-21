// src/data.ts
// Import the flags from the svg-country-flags package
import countryList from 'world-countries';

export type CountryData = {
	country: string;
	capital: string;
	flagImage: string;
	similarCountries: string[];
	similarCapitals: string[];
};

// Override names for cases where world-countries names differ
const nameOverrides: Record<string, string> = {
  'DR Congo': 'Democratic Republic of the Congo',
  'Cape Verde': 'Cabo Verde',
  'Ivory Coast': "Côte d'Ivoire",
  'East Timor': 'Timor-Leste',
  'Russia': 'Russian Federation',
  'Vatican City': 'Holy See',
  'State of Palestine': 'Palestine, State of',
  'Micronesia': 'Federated States of Micronesia',
};

// Base country list derived from Phaser config
const baseCountryNames: string[] = [
  "Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi","Cameroon","Cape Verde","Central African Republic","Chad","Comoros","DR Congo","Djibouti","Egypt","Equatorial Guinea","Eritrea","Eswatini","Ethiopia","Gabon","Gambia","Ghana","Guinea","Guinea-Bissau","Ivory Coast","Kenya","Lesotho","Liberia","Libya","Madagascar","Malawi","Mali","Mauritania","Mauritius","Morocco","Mozambique","Namibia","Niger","Nigeria","Republic of the Congo","Rwanda","São Tomé and Príncipe","Senegal","Seychelles","Sierra Leone","Somalia","South Africa","South Sudan","Sudan","Tanzania","Togo","Tunisia","Uganda","Zambia","Zimbabwe",
  "Afghanistan","Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei","Cambodia","China","East Timor","Georgia","India","Indonesia","Iran","Iraq","Israel","Japan","Jordan","Kazakhstan","Kuwait","Kyrgyzstan","Laos","Lebanon","Malaysia","Maldives","Mongolia","Myanmar","Nepal","North Korea","Oman","Pakistan","State of Palestine","Philippines","Qatar","Russia","Saudi Arabia","Singapore","South Korea","Sri Lanka","Syria","Taiwan","Tajikistan","Thailand","Turkey","Turkmenistan","UAE","Uzbekistan","Vietnam","Yemen",
  "Antigua and Barbuda","Argentina","Bahamas","Barbados","Belize","Bolivia","Brazil","Canada","Chile","Colombia","Costa Rica","Cuba","Dominica","Dominican Republic","Ecuador","El Salvador","Grenada","Guatemala","Guyana","Haiti","Honduras","Jamaica","Mexico","Nicaragua","Panama","Paraguay","Peru","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and Grenadines","Suriname","Trinidad and Tobago","United States","Uruguay","Venezuela",
  "Albania","Andorra","Austria","Belarus","Belgium","Bosnia and Herzegovina","Bulgaria","Croatia","Cyprus","Czech Republic","Denmark","Estonia","Finland","France","Germany","Greece","Hungary","Iceland","Ireland","Italy","Kosovo","Latvia","Liechtenstein","Lithuania","Luxembourg","Malta","Moldova","Monaco","Montenegro","Netherlands","North Macedonia","Norway","Poland","Portugal","Romania","San Marino","Serbia","Slovakia","Slovenia","Spain","Sweden","Switzerland","Ukraine","United Kingdom","Vatican City",
  "Australia","Fiji","Kiribati","Marshall Islands","Micronesia","Nauru","New Zealand","Palau","Papua New Guinea","Samoa","Solomon Islands","Tonga","Tuvalu","Vanuatu"
];

const countriesData: CountryData[] = baseCountryNames
  .map((name) => {
    const lookupName = nameOverrides[name] || name;
    let found =
      countryList.find((c) => c.name.common === lookupName) ||
      countryList.find((c) => c.name.official === lookupName) ||
      countryList.find((c) =>
        c.name.common.toLowerCase().includes(name.toLowerCase())
      );
    if (!found) console.warn(`Country "${name}" not found`);
    return {
      country: name,
      capital: found?.capital?.[0] ?? 'Unknown',
      flagImage: found ? `/images/svg/${found.cca2.toLowerCase()}.svg` : '',
      similarCountries: [],
      similarCapitals: [],
    };
  })
  .filter((c) => c.capital !== 'Unknown' && c.capital);

export default countriesData;
