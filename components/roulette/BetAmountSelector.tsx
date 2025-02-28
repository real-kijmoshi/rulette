import React from "react";
import { motion } from "framer-motion";

interface BetAmountSelectorProps {
  value: number;
  onChange: (amount: number) => void;
  options: number[];
  max: number;
}

export default function BetAmountSelector({ 
  value, 
  onChange, 
  options,
  max
}: BetAmountSelectorProps) {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex items-center">
        <label className="text-sm text-slate-300 mr-2">Bet Amount:</label>
        <input
          type="number"
          min={1}
          max={max}
          value={value}
          onChange={(e) => onChange(Math.min(Number(e.target.value), max))}
          className="w-24 p-2 bg-slate-700 text-amber-300 font-bold rounded-lg border border-slate-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((amount) => (
          <motion.button
            key={amount}
            onClick={() => onChange(amount > max ? max : amount)}
            disabled={amount > max}
            className={`px-3 py-1 rounded-full font-semibold text-sm transition-colors
              ${value === amount ? 'bg-amber-500 text-slate-900' : ''}
              ${amount > max ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600'}`}
            whileHover={amount <= max ? { scale: 1.05 } : {}}
            whileTap={amount <= max ? { scale: 0.95 } : {}}
          >
            ${amount}
          </motion.button>
        ))}
        
        <motion.button
          onClick={() => onChange(max)}
          className={`px-3 py-1 rounded-full font-semibold text-sm 
            ${value === max ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 hover:bg-slate-600'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          All In
        </motion.button>
      </div>
    </div>
  );
}
