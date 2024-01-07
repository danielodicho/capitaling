import countriesData from '../data'; // Import the countries data
import Quiz from './quiz';


export default function Page() {  
  const selectRandomCountry = () => {
      const randomIndex = Math.floor(Math.random() * countriesData.length);
      return countriesData[randomIndex];
    };

    const randomCountryData = selectRandomCountry();

    return <Quiz defaultCountryData={randomCountryData} />;
}

export const dynamic = 'force-dynamic';