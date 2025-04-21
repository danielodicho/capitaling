"use client";
import React, { useState, useEffect } from "react";

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

interface LeaderboardProps {
  score: number;
  onPlayAgain: () => void;
}

export default function Leaderboard({ score, onPlayAgain }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("capitaling_leaderboard");
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch {}
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newEntry: LeaderboardEntry = { name: name || "Anonymous", score, date: new Date().toISOString() };
    const updated = [...entries, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setEntries(updated);
    localStorage.setItem("capitaling_leaderboard", JSON.stringify(updated));
    setSubmitted(true);
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
      {!submitted && (
        <form onSubmit={handleSubmit} className="mb-4 flex flex-col items-center">
          <label className="mb-2">Enter your name:</label>
          <div className="flex">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-2 py-1 mr-2"
              placeholder="You"
            />
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
              Submit Score
            </button>
          </div>
        </form>
      )}
      <table className="table-auto border-collapse mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2 border">#</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={i} className="odd:bg-white even:bg-gray-50">
              <td className="px-4 py-2 border text-center">{i + 1}</td>
              <td className="px-4 py-2 border">{e.name}</td>
              <td className="px-4 py-2 border text-center">{e.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onPlayAgain} className="px-4 py-2 bg-blue-500 text-white rounded">
        Play Again
      </button>
    </div>
  );
}
