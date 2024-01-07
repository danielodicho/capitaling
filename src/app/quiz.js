import React, { useState, useEffect } from 'react';
import styles from './quiz.module.css';
import countriesData from '../data'; // Import the countries data

export default function Quiz() {
  const defaultCountryData = {
    country: '',
    capital: '',
    flagImage: '',
    similarCountries: [],
    similarCapitals: []
  };
  // States to track the user's selections
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCapital, setSelectedCapital] = useState(null);
  const [currentCountryData, setCurrentCountryData] = useState(defaultCountryData);
  const [isCorrect, setIsCorrect] = useState(null); // null, true, or false

  // Assume the first country is the one to guess for simplicity
//   const currentCountryData = countriesData[0];
const selectRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countriesData.length);
    setCurrentCountryData(countriesData[randomIndex]);
  };

  // Effect hook to select a random country when the component mounts
  useEffect(() => {
    selectRandomCountry();
  }, []);

  // Event handlers for selecting country and capital
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsCorrect(null); // Reset the correctness state
  };

  const handleCapitalSelect = (capital) => {
    setSelectedCapital(capital);
    setIsCorrect(null); // Reset the correctness state
  };

  // Function to check answers
  // Function to check answers
const checkAnswers = () => {
    // Check if the selected country and capital match the current country data
    const isCountryCorrect = selectedCountry === currentCountryData.country;
    const isCapitalCorrect = selectedCapital === currentCountryData.capital;
  
    // Set the correctness state based on the user's selections
    setIsCorrect(isCountryCorrect && isCapitalCorrect);
  
    // If both guesses are correct, select a new random country
    if (isCountryCorrect && isCapitalCorrect) {
      selectRandomCountry();
      // Reset selections
      setSelectedCountry(null);
      setSelectedCapital(null);
    }
  };
  

  const resultClassNames = `${styles.result} ${isCorrect ? styles.correct : styles.incorrect}`;

  return (
    <div className={styles.container}>
      <div className={styles.flagContainer}>
        <img src={currentCountryData.flagImage} alt={`Flag of ${currentCountryData.country}`} className={styles.flagImage} />
      </div>
      <div className={styles.optionsContainer}>
        <div className={styles.column}>
        {[currentCountryData.country, ...currentCountryData.similarCountries].map((country) => (
            <button
              key={country}
              className={`${styles.option} ${selectedCountry === country ? styles.selected : ''}`}
              onClick={() => handleCountrySelect(country)}
            >
              {country}
            </button>
          ))}
        </div>
        <div className={styles.column}>
        {[currentCountryData.capital, ...currentCountryData.similarCapitals].map((capital) => (
            <button
              key={capital}
              className={`${styles.option} ${selectedCapital === capital ? styles.selected : ''}`}
              onClick={() => handleCapitalSelect(capital)}
            >
              {capital}
            </button>
          ))}
        </div>
      </div>
      <button onClick={checkAnswers} className={styles.submitButton}>
        Check Answers
      </button>
      {isCorrect !== null && (
  <div className={resultClassNames}>
  {isCorrect ? 'Correct! Next country!' : 'Incorrect, try again!'}
</div>
    )}
    </div>
  );
}
