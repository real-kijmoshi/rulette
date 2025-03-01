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
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spinSpeedRef = useRef<number>(100); // Initial speed in ms
  const spinningTimeRef = useRef<number>(0);
  const maxSpinningTime = 5000; // 5 seconds total spinning time

  // Function to get a random number between 0-36
  const getRandomNumber = () => Math.floor(Math.random() * 37);

  // Start, manage and stop the spinning animation
  useEffect(() => {
    if (isSpinning) {
      // Reset refs at the start of spinning
      spinningTimeRef.current = 0;
      spinSpeedRef.current = 100;
      
      // Clear any existing interval
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
      
      // Start the spinning animation
      spinIntervalRef.current = setInterval(() => {
        // Highlight a random number
        setHighlightedNumber(getRandomNumber());
        
        // Increase the spinning time
        spinningTimeRef.current += spinSpeedRef.current;
        
        // Gradually slow down the spinning
        if (spinningTimeRef.current > maxSpinningTime * 0.5) {
          spinSpeedRef.current = Math.min(spinSpeedRef.current + 10, 500);
          
          // Update the interval with the new speed
          clearInterval(spinIntervalRef.current!);
          spinIntervalRef.current = setInterval(() => {
            setHighlightedNumber(getRandomNumber());
            spinningTimeRef.current += spinSpeedRef.current;
            
            // If approaching the end and result is provided, make sure we land on it
            if (spinningTimeRef.current > maxSpinningTime * 0.9 && result !== null) {
              setHighlightedNumber(result);
            }
            
            // Stop spinning after reaching max time
            if (spinningTimeRef.current >= maxSpinningTime) {
              if (spinIntervalRef.current) {
                clearInterval(spinIntervalRef.current);
                spinIntervalRef.current = null;
              }
              // Ensure we end by highlighting the result
              if (result !== null) {
                setHighlightedNumber(result);
              }
            }
          }, spinSpeedRef.current);
        }
      }, spinSpeedRef.current);
      
      // Clean up the interval when spinning stops
      return () => {
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current);
          spinIntervalRef.current = null;
        }
      };
    } else {
      // When not spinning, clear interval and reset highlight
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
      
      // If there's a result and we're not spinning, show the result
      if (result !== null && !isSpinning) {
        setHighlightedNumber(result);
      } else if (!isSpinning) {
        setHighlightedNumber(null);
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