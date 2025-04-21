"use client";
import React from "react";
import { motion } from "framer-motion";
import { CountryData } from "odicho/data";

interface FlagCardProps {
  country: CountryData;
  options: string[];
  onSwipe: (choice: string) => void;
  result?: 'correct' | 'wrong' | null;
}

export default function FlagCard({ country, options, onSwipe, result }: FlagCardProps) {
  return (
    <motion.div
      className={`w-full max-w-md bg-white rounded-lg shadow-lg p-6 ${
        result === 'correct' ? 'ring-4 ring-green-400' : result === 'wrong' ? 'ring-4 ring-red-400' : ''
      }`}
      whileDrag={{ scale: 1.05 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        // Swiping right should select the right-hand option (index 1), swiping left selects the left-hand option (index 0)
        if (info.offset.x > 100) onSwipe(options[1]);
        else if (info.offset.x < -100) onSwipe(options[0]);
      }}
      animate={
        result === 'wrong'
          ? { x: [0, -10, 10, -10, 10, 0] }
          : result === 'correct'
          ? { scale: [1, 1.05, 1] }
          : {}
      }
      transition={{ duration: 0.5 }}
    >
      <img src={country.flagImage} alt={`${country.country} flag`} className="w-full h-48 object-cover mb-4" />
      <div className="flex justify-between">
        {options.map((opt, idx) => (
          <div key={idx} className="px-4 py-2 bg-gray-200 rounded cursor-pointer" onClick={() => onSwipe(opt)}>
            {opt}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
