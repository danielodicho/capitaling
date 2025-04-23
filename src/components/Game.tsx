"use client";
import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import countriesData, { CountryData } from "../data";
import FlagCard from "./FlagCard";
import Leaderboard from "./Leaderboard";

const TOTAL_TIME = 30;

export default function Game() {
  const [time, setTime] = useState(TOTAL_TIME);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);

  // Shuffle flag order once on mount
  const [shuffledCountries] = useState<CountryData[]>(() => [...countriesData].sort(() => Math.random() - 0.5));

  useEffect(() => {
    setOptions(generateOptions());
  }, [currentIndex]);

  useEffect(() => {
    if (time <= 0) return;
    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [time]);

  function generateOptions(): string[] {
    const current = shuffledCountries[currentIndex];
    // Collect capitals of other countries
    const wrongs = shuffledCountries
      .filter((_, i) => i !== currentIndex)
      .map((c) => c.capital)
      .filter((cap) => cap && cap !== current.capital);
    // Pick a random wrong option
    const randomWrong = wrongs[Math.floor(Math.random() * wrongs.length)];
    const options = [current.capital, randomWrong];
    // Shuffle positions
    return options.sort(() => Math.random() - 0.5);
  }

  function playSound(correct: boolean) {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    const now = ctx.currentTime;
    if (correct) {
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, now);
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else {
      osc.type = "square";
      osc.frequency.setValueAtTime(200, now);
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  }

  function handleSwipe(choice: string) {
    const current = shuffledCountries[currentIndex];
    const correct = choice === current.capital;
    setLastResult(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore((s) => s + 1);
      setShowConfetti(true);
      playSound(true);
      setTimeout(() => setShowConfetti(false), 500);
    } else {
      playSound(false);
      // Penalize 2 seconds on wrong answer
      setTime((t) => Math.max(0, t - 2));
    }
    setTimeout(() => {
      setLastResult(null);
      if (currentIndex < shuffledCountries.length - 1) setCurrentIndex((i) => i + 1);
      else setTime(0);
    }, 600);
  }

  if (time <= 0) {
    return (
      <Leaderboard
        score={score}
        onPlayAgain={() => {
          setScore(0);
          setTime(TOTAL_TIME);
          setCurrentIndex(0);
        }}
      />
    );
  }

  const current = shuffledCountries[currentIndex];

  return (
    <div className="relative flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      {showConfetti && <Confetti />}
      <div className="absolute top-4 left-4 text-xl font-medium">Time: {time}s</div>
      <div className="absolute top-4 right-4 text-xl font-medium">Score: {score}</div>
      <FlagCard country={current} options={options} onSwipe={handleSwipe} result={lastResult} />
    </div>
  );
}
