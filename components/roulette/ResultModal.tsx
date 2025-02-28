import React from "react";
import { GameResult } from "./types";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface ResultModalProps {
  result: GameResult;
  betAmount: number;
  winAmount: number;
  onClose: () => void;
}

export default function ResultModal({
  result,
  betAmount,
  winAmount,
  onClose,
}: ResultModalProps) {
  // Trigger confetti on win
  React.useEffect(() => {
    if (result.win) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [result.win]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-700"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <motion.h2
          className={`text-3xl font-bold text-center ${result.win ? "text-green-400" : "text-red-400"}`}
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          {result.win ? "🎉 Winner! 🎉" : "💸 Try Again! 💸"}
        </motion.h2>

        <div className="space-y-4 bg-slate-800/50 p-4 rounded-xl">
          <div className="flex justify-between">
            <span className="text-slate-300">Result:</span>
            <span className="font-semibold">
              <span
                className={`inline-block w-8 h-8 text-center leading-8 rounded-full mr-2 ${result.isGreen ? "bg-green-600" : result.isRed ? "bg-red-600" : "bg-slate-900 border border-white"}`}
              >
                {result.result}
              </span>
              {result.isRed && "Red"}
              {result.isBlack && "Black"}
              {result.isGreen && "Green"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-300">Properties:</span>
            <span>
              {result.isEven && "Even "}
              {result.isOdd && "Odd "}
              {result.isHigh && "High "}
              {result.isLow && "Low "}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-300">Bet Amount:</span>
            <span className="font-semibold text-amber-400">${betAmount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-300">Winnings:</span>
            <span className={`font-semibold ${winAmount > 0 ? "text-green-400" : "text-red-400"}`}>
              {winAmount > 0 ? `+ $${winAmount}` : `$${winAmount}`}
            </span>
          </div>
        </div>

        <motion.button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-semibold text-lg bg-amber-500 hover:bg-amber-400 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Close
        </motion.button>
      </motion.div>
    </div>
  );
}