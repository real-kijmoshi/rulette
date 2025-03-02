import React, { useRef, useEffect, useState } from "react";

interface RouletteWheelProps {
  selectedNumber: number | null;
  onNumberClick: (number: number) => void;
  isSpinning: boolean;
  result: number | null;
}

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function RouletteWheel({ selectedNumber, onNumberClick, isSpinning, result }: RouletteWheelProps) {
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const spinSpeedRef = useRef<number>(100); // Initial speed in ms
  const spinningTimeRef = useRef<number>(0);
  const maxSpinningTime = 2000; // Max time in ms
  const transitionSteps = 10; // Steps to smoothly transition to result

  useEffect(() => {
    if (isSpinning) {
      spinningTimeRef.current = 0;
      spinSpeedRef.current = 100;
      let stepsRemaining = transitionSteps;
      
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
      
      spinIntervalRef.current = setInterval(() => {
        if (spinningTimeRef.current < maxSpinningTime * 0.9) {
          setHighlightedNumber(Math.floor(Math.random() * 37));
          spinningTimeRef.current += spinSpeedRef.current;
          spinSpeedRef.current += 15; // Gradual slowdown
        } else if (result !== null && stepsRemaining > 0) {
          setHighlightedNumber(result);
          stepsRemaining--;
          spinSpeedRef.current += 30;
        } else {
          clearInterval(spinIntervalRef.current!);
          spinIntervalRef.current = null;
          console.log("Spinning stopped", result);
          setHighlightedNumber(result);
        }
      }, spinSpeedRef.current);

      return () => {
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current);
          spinIntervalRef.current = null;
        }
      };
    } else {
      if (result !== null) {
        setHighlightedNumber(result);
      }
    }
  }, [isSpinning, result]);

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div
        onClick={() => !isSpinning && onNumberClick(0)}
        className={`col-span-1 row-span-3 flex items-center justify-center p-6 text-2xl font-bold 
          bg-green-700 rounded-lg cursor-pointer transition-transform hover:scale-105
          ${selectedNumber === 0 ? 'ring-4 ring-yellow-400' : ''}
          ${highlightedNumber === 0 ? 'ring-4 ring-white animate-pulse' : ''}`}
      >
        0
      </div>

      {Array.from({ length: 36 }, (_, i) => i + 1).map((number) => (
        <div
          key={number}
          onClick={() => !isSpinning && onNumberClick(number)}
          className={`flex items-center justify-center p-4 text-lg font-semibold rounded-lg cursor-pointer
            transition-transform hover:scale-105 
            ${selectedNumber === number ? 'ring-4 ring-yellow-400' : ''}
            ${highlightedNumber === number ? 'ring-4 ring-white animate-pulse' : ''}
            ${RED_NUMBERS.includes(number) ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 hover:bg-slate-700'}`}
        >
          {number}
        </div>
      ))}
    </div>
  );
}
