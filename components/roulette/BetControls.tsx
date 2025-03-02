import React from "react";
import { BetType } from "./types";
import BetButton from "./BetButton";
import { motion } from "framer-motion";
import { FaPlay, FaSpinner } from "react-icons/fa";
import ColumnBetSelector from "./ColumnBetSelector";
import DozensBetSelector from "./DozensBetSelector";

interface BetControlsProps {
  betType: BetType | null;
  betValue: string | null;
  onBetTypeSelect: (type: BetType) => void;
  onBetValueSelect: (value: string) => void;
  onPlaceBet: () => void;
  disabled: boolean;
  isSpinning: boolean;
}

export default function BetControls({
  betType,
  betValue,
  onBetTypeSelect,
  onBetValueSelect,
  onPlaceBet,
  disabled,
  isSpinning
}: BetControlsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <BetButton
          type="red"
          currentType={betType}
          onClick={onBetTypeSelect}
          disabled={isSpinning}
        >
          Red
        </BetButton>

        <BetButton
          type="black"
          currentType={betType}
          onClick={onBetTypeSelect}
          disabled={isSpinning}
        >
          Black
        </BetButton>

        <BetButton
          type="even"
          currentType={betType}
          onClick={onBetTypeSelect}
          disabled={isSpinning}
        >
          Even
        </BetButton>

        <BetButton
          type="odd"
          currentType={betType}
          onClick={onBetTypeSelect}
          disabled={isSpinning}
        >
          Odd
        </BetButton>

        <BetButton
          type="high"
          currentType={betType}
          onClick={onBetTypeSelect}
          disabled={isSpinning}
        >
          High (19-36)
        </BetButton>

        <BetButton
          type="low"
          currentType={betType}
          onClick={onBetTypeSelect}
          disabled={isSpinning}
        >
          Low (1-18)
        </BetButton>
      </div>

      {betType === 'dozens' && (
        <DozensBetSelector 
          selectedValue={betValue}
          onValueSelect={onBetValueSelect}
          disabled={isSpinning}
        />
      )}

      {betType === 'column' && (
        <ColumnBetSelector 
          selectedValue={betValue}
          onValueSelect={onBetValueSelect}
          disabled={isSpinning}
        />
      )}

      <motion.div 
        className="mt-8 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          onClick={onPlaceBet}
          disabled={disabled}
          className={`px-12 py-4 rounded-full text-xl font-bold shadow-lg
            flex items-center justify-center gap-2 transition-all 
            ${disabled 
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500'
            }`}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
        >
          {isSpinning ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Spinning...</span>
            </>
          ) : (
            <>
              <FaPlay />
              <span>Place Bet</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
