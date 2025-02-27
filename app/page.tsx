"use client";
import { useState, useCallback } from "react";

// Constants
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BET_TYPES = ['straight', 'red', 'black', 'even', 'odd', 'high', 'low', 'dozens', 'column'] as const;

type BetType = typeof BET_TYPES[number];

export default function RouletteTable() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betType, setBetType] = useState<BetType | null>(null);
  const [betValue, setBetValue] = useState<string | null>(null);
  const [result, setResult] = useState<{
    result: number;
    win: boolean;
    isRed: boolean;
    isBlack: boolean;
    isGreen: boolean;
    isEven: boolean;
    isOdd: boolean;
    isHigh: boolean;
    isLow: boolean;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const sendBet = useCallback(async () => {
    if (!betType) return alert("Please select a bet type");
    if ((betType === 'dozens' || betType === 'column') && !betValue) 
      return alert("Please select a bet value");

    try {
      const response = await fetch("/api/bet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number: betType === 'straight' ? selectedNumber : null,
          betType,
          betValue
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      console.log(data);

      setResult(data);
      setShowModal(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Bet failed");
    }
  }, [betType, betValue, selectedNumber]);

  const handleNumberClick = (number: number) => {
    setSelectedNumber(number);
    setBetType('straight');
    setBetValue(null);
  };

  const handleBetTypeSelect = (type: BetType) => {
    setBetType(type);
    setBetValue(null);
    if (type !== 'straight') setSelectedNumber(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNumber(null);
    setBetType(null);
    setBetValue(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-slate-900 text-white">
      <header className="p-6 bg-slate-800/50 shadow-xl">
        <h1 className="text-4xl font-bold text-center">Roulette Royale</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Roulette Wheel Display */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div
            onClick={() => handleNumberClick(0)}
            className={`col-span-1 row-span-3 flex items-center justify-center p-6 text-2xl font-bold 
              bg-green-700 rounded-lg cursor-pointer transition-transform hover:scale-105
              ${selectedNumber === 0 ? 'ring-4 ring-yellow-400' : ''}`}
          >
            0
          </div>

          {Array.from({ length: 36 }, (_, i) => i + 1).map((number) => (
            <div
              key={number}
              onClick={() => handleNumberClick(number)}
              className={`flex items-center justify-center p-4 text-lg font-semibold rounded-lg cursor-pointer
                transition-transform hover:scale-105 ${selectedNumber === number ? 'ring-4 ring-yellow-400' : ''}
                ${RED_NUMBERS.includes(number) ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              {number}
            </div>
          ))}
        </div>

        {/* Bet Controls */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <BetButton
              type="red"
              currentType={betType}
              onClick={handleBetTypeSelect}
            >
              Red
            </BetButton>

            <BetButton
              type="black"
              currentType={betType}
              onClick={handleBetTypeSelect}
            >
              Black
            </BetButton>

            <BetButton
              type="even"
              currentType={betType}
              onClick={handleBetTypeSelect}
            >
              Even
            </BetButton>

            <BetButton
              type="odd"
              currentType={betType}
              onClick={handleBetTypeSelect}
            >
              Odd
            </BetButton>

            <BetButton
              type="high"
              currentType={betType}
              onClick={handleBetTypeSelect}
            >
              High (19-36)
            </BetButton>

            <BetButton
              type="low"
              currentType={betType}
              onClick={handleBetTypeSelect}
            >
              Low (1-18)
            </BetButton>
          </div>

          {/* Special Bets */}
          {betType === 'dozens' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Select Dozen:</h3>
              <div className="flex gap-4 flex-wrap">
                {['1-12', '13-24', '25-36'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setBetValue(range)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors
                      ${betValue === range ? 'bg-amber-600' : 'bg-amber-700 hover:bg-amber-600'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          )}

          {betType === 'column' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Select Column:</h3>
              <div className="flex gap-4 flex-wrap">
                {['1', '2', '3'].map((col) => (
                  <button
                    key={col}
                    onClick={() => setBetValue(col)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors
                      ${betValue === col ? 'bg-purple-600' : 'bg-purple-700 hover:bg-purple-600'}`}
                  >
                    Column {col}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={sendBet}
            className="px-12 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full 
            text-xl font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Place Bet
          </button>
        </div>
      </main>

      {/* Result Modal */}
      {showModal && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-xl p-8 max-w-md w-full space-y-6 animate-pop-in">
            <h2 className={`text-3xl font-bold text-center ${result.win ? 'text-green-400' : 'text-red-400'}`}>
              {result.win ? '🎉 Winner! 🎉' : '💸 Try Again! 💸'}
            </h2>
            
            <div className="space-y-4">
              <p className="text-lg">
                Landed on: <span className="font-semibold">{result.result}</span>
                {result.isGreen && ' (Green)'}
                {result.isRed && ' (Red)'}
                {result.isBlack && ' (Black)'}
              </p>
              <p>
                {result.isEven && 'Even'}
                {result.isOdd && 'Odd'} | 
                {result.isHigh && ' High'} 
                {result.isLow && ' Low'}
              </p>
            </div>

            <button
              onClick={closeModal}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable Bet Button Component
const BetButton = ({
  type,
  currentType,
  onClick,
  children
}: {
  type: BetType;
  currentType: BetType | null;
  onClick: (type: BetType) => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={() => onClick(type)}
    className={`p-4 rounded-xl font-semibold transition-all ${
      currentType === type 
        ? 'ring-4 ring-yellow-400 scale-105' 
        : 'opacity-90 hover:opacity-100 hover:scale-105'
    } ${
      type === 'red' ? 'bg-red-600' :
      type === 'black' ? 'bg-slate-800' :
      type === 'even' || type === 'odd' ? 'bg-blue-600' :
      'bg-emerald-600'
    }`}
  >
    {children}
  </button>
);