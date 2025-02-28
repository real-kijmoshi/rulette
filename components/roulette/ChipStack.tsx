import React from "react";
import { motion } from "framer-motion";

interface ChipStackProps {
  amount: number;
}

export default function ChipStack({ amount }: ChipStackProps) {
  // Determine chip color based on amount
  const getChipColor = () => {
    if (amount >= 500) return "bg-gradient-to-r from-purple-700 to-purple-500";
    if (amount >= 100) return "bg-gradient-to-r from-slate-700 to-slate-500";
    if (amount >= 50) return "bg-gradient-to-r from-green-700 to-green-500";
    if (amount >= 25) return "bg-gradient-to-r from-blue-700 to-blue-500";
    if (amount >= 10) return "bg-gradient-to-r from-red-700 to-red-500";
    return "bg-gradient-to-r from-amber-700 to-amber-500";
  };

  return (
    <motion.div 
      className="relative"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      {/* Stack of chips - decorative */}
      {[...Array(3)].map((_, i) => (
        <div 
          key={i} 
          className={`w-16 h-16 rounded-full ${getChipColor()} absolute border-2 border-white/20`}
          style={{ top: i * -4, left: i * -1 }}
        />
      ))}
      
      {/* Top chip with value */}
      <div className={`w-16 h-16 rounded-full ${getChipColor()} relative z-10 border-2 border-white/20 flex items-center justify-center`}>
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">
          ${amount}
        </div>
      </div>
    </motion.div>
  );
}