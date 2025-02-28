import React from "react";
import { motion } from "framer-motion";

interface DozensBetSelectorProps {
  selectedValue: string | null;
  onValueSelect: (value: string) => void;
  disabled: boolean;
}

export default function DozensBetSelector({ 
  selectedValue, 
  onValueSelect,
  disabled
}: DozensBetSelectorProps) {
  return (
    <motion.div 
      className="space-y-4 bg-slate-700/50 p-4 rounded-xl"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <h3 className="text-xl font-semibold text-amber-300">Select Dozen:</h3>
      <div className="flex gap-4 flex-wrap">
        {['1-12', '13-24', '25-36'].map((range) => (
          <motion.button
            key={range}
            onClick={() => !disabled && onValueSelect(range)}
            disabled={disabled}
            className={`px-6 py-3 rounded-lg font-semibold transition-all
              ${selectedValue === range ? 'bg-amber-500 text-slate-900' : ''}
              ${disabled 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-amber-700/70 hover:bg-amber-600'
              }`}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
          >
            {range}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}