import React from "react";
import { motion } from "framer-motion";

interface ColumnBetSelectorProps {
  selectedValue: string | null;
  onValueSelect: (value: string) => void;
  disabled: boolean;
}

export default function ColumnBetSelector({ 
  selectedValue, 
  onValueSelect,
  disabled
}: ColumnBetSelectorProps) {
  return (
    <motion.div 
      className="space-y-4 bg-slate-700/50 p-4 rounded-xl"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <h3 className="text-xl font-semibold text-amber-300">Select Column:</h3>
      <div className="flex gap-4 flex-wrap">
        {['1', '2', '3'].map((col) => (
          <motion.button
            key={col}
            onClick={() => !disabled && onValueSelect(col)}
            disabled={disabled}
            className={`px-6 py-3 rounded-lg font-semibold transition-all
              ${selectedValue === col ? 'bg-purple-500 text-white' : ''}
              ${disabled 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-purple-700/70 hover:bg-purple-600'
              }`}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
          >
            Column {col}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
