import React from "react";

interface RouletteWheelProps {
  selectedNumber: number | null;
  onNumberClick: (number: number) => void;
}

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function RouletteWheel({ selectedNumber, onNumberClick }: RouletteWheelProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      <div
        onClick={() => onNumberClick(0)}
        className={`col-span-1 row-span-3 flex items-center justify-center p-6 text-2xl font-bold 
          bg-green-700 rounded-lg cursor-pointer transition-transform hover:scale-105
          ${selectedNumber === 0 ? 'ring-4 ring-yellow-400' : ''}`}
      >
        0
      </div>

      {Array.from({ length: 36 }, (_, i) => i + 1).map((number) => (
        <div
          key={number}
          onClick={() => onNumberClick(number)}
          className={`flex items-center justify-center p-4 text-lg font-semibold rounded-lg cursor-pointer
            transition-transform hover:scale-105 ${selectedNumber === number ? 'ring-4 ring-yellow-400' : ''}
            ${RED_NUMBERS.includes(number) ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 hover:bg-slate-700'}`}
        >
          {number}
        </div>
      ))}
    </div>
  );
}
