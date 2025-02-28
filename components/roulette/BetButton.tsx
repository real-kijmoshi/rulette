import React from "react";
import { BetType } from "./types";
import { motion } from "framer-motion";

interface BetButtonProps {
  type: BetType;
  currentType: BetType | null;
  onClick: (type: BetType) => void;
  children: React.ReactNode;
  disabled: boolean;
}

export default function BetButton({
  type,
  currentType,
  onClick,
  children,
  disabled
}: BetButtonProps) {
  const getButtonColor = () => {
    if (disabled) return "bg-slate-700 text-slate-500";
    
    if (currentType === type) {
      switch (type) {
        case 'red': return 'bg-red-500 text-white';
        case 'black': return 'bg-slate-900 text-white ring-2 ring-white';
        case 'even':
        case 'odd': return 'bg-blue-500 text-white';
        default: return 'bg-emerald-500 text-white';
      }
    } else {
      switch (type) {
        case 'red': return 'bg-red-600/80 hover:bg-red-600';
        case 'black': return 'bg-slate-800/80 hover:bg-slate-800';
        case 'even':
        case 'odd': return 'bg-blue-600/80 hover:bg-blue-600';
        default: return 'bg-emerald-600/80 hover:bg-emerald-600';
      }
    }
  };

  return (
    <motion.button
      onClick={() => !disabled && onClick(type)}
      disabled={disabled}
      className={`p-4 rounded-xl font-semibold transition-all ${
        currentType === type && !disabled
          ? 'ring-2 ring-yellow-400 shadow-md shadow-amber-900/20' 
          : ''
      } ${getButtonColor()} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  );
}
