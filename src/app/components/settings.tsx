import { Button } from "@components/button";
import React from "react";

export const Settings = ({show, flagsPerQuiz, setFlagsPerQuiz}: {show: boolean, flagsPerQuiz:number, setFlagsPerQuiz: (flags: number) => void}) => {

    if(!show) return null

    const handleFlagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFlagsPerQuiz(Number(e.currentTarget.value));
      };

    return (
        <div className={`flex ${show ? "":"hidden"}  w-full h-full fixed justify-center items-center`}>
        <div className="flex gap-10 flex-col w-full px-4 sm:w-[400px] ">
        <p className="font-bold">Select the number of flags per quiz</p>
        <div className="relative w-full ">
        <input type="number" name="flags" id="flags" className="border border-black object-cover" onChange={handleFlagsChange}/>
        </div>
        </div>
        </div>
    )
}
