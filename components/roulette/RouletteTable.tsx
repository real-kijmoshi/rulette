"use client";
import { useSession } from "next-auth/react";
import React, { useState, useCallback, useEffect } from "react";
import Header from "./Header";
import RouletteWheel from "./RouletteWheel";
import BetControls from "./BetControls";
import ResultModal from "./ResultModal";
import { BetType, GameResult } from "./types";
import BetAmountSelector from "./BetAmountSelector";
import { motion } from "framer-motion";
import ChipStack from "./ChipStack";

const fetchBalance = async () => {
  const response = await fetch("/api/balance");
  const data = await response.json();
  console.log("data", data);
  return data.balance;
}

export default function RouletteTable() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [betType, setBetType] = useState<BetType | null>(null);
  const [betValue, setBetValue] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<number>(10);
  const [balance, setBalance] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const { data: session, status } = useSession();


  console.log("status", status);
  useEffect(() => {
    if (status === "loading") return;

    if(!session?.user) {
      window.location.href = "/api/auth/signin";
    }
  }, [session, status]);

  useEffect(() => {
    fetchBalance().then(setBalance);
  }, []);
  

  // Simulate updating balance based on win/loss
  useEffect(() => {
    if (result) {
      const newBalance = result.win 
        ? balance + calculateWinnings(betType as BetType, betAmount)
        : balance - betAmount;
      setBalance(newBalance);
    }
  }, [result]);

  const calculateWinnings = (type: BetType, amount: number) => {
    // Return different multipliers based on bet type
    const multipliers: Record<BetType, number> = {
      'straight': 35,
      'red': 1,
      'black': 1,
      'even': 1,
      'odd': 1,
      'high': 1,
      'low': 1,
      'dozens': 2,
      'column': 2
    };
    
    return amount * multipliers[type];
  };

  const sendBet = useCallback(async () => {
    if (!betType) return alert("Please select a bet type");
    if ((betType === 'dozens' || betType === 'column') && !betValue) 
      return alert("Please select a bet value");
    if (betAmount <= 0) return alert("Please enter a valid bet amount");
    if (betAmount > balance) return alert("Insufficient balance");

    setIsSpinning(true);
    
    try {
      // Simulate API call with timeout for wheel animation
      try {
        const response = await fetch("/api/bet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            number: betType === 'straight' ? selectedNumber : null,
            betType,
            betValue,
            betAmount
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setResult(data);

        setTimeout(async () => {
  
          setShowModal(true);
          setIsSpinning(false);
        }, 2500); // animation
      } catch (error) {
        setIsSpinning(false);
        alert(error instanceof Error ? error.message : "Bet failed");
      }
    } catch (error) {
      setIsSpinning(false);
      alert(error instanceof Error ? error.message : "Bet failed");
    }
  }, [betType, betValue, selectedNumber, betAmount, balance]);

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
    setResult(null);
  };

  const canPlaceBet = betType !== null && betAmount > 0 && betAmount <= balance && 
    !((betType === 'dozens' || betType === 'column') && betValue === null) &&
    !(betType === 'straight' && selectedNumber === null);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-purple-900 text-white"
    >
      <Header 
        balance={balance} 
        username={session?.user?.name || 'Guest'} 
      />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-slate-800/60 p-6 rounded-2xl shadow-2xl mb-8">
              <h2 className="text-2xl font-bold mb-4 text-amber-300">Place Your Bets</h2>
              <div className="flex items-center gap-4 mb-6">
                <ChipStack amount={betAmount} />
                <BetAmountSelector 
                  value={betAmount}
                  onChange={setBetAmount}
                  options={[5, 10, 25, 50, 100, 500]}
                  max={balance}
                />
              </div>
              
              <BetControls
                betType={betType}
                betValue={betValue}
                onBetTypeSelect={handleBetTypeSelect}
                onBetValueSelect={setBetValue}
                onPlaceBet={sendBet}
                disabled={isSpinning || !canPlaceBet}
                isSpinning={isSpinning}
              />
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <motion.div 
              className="bg-slate-800/60 p-6 rounded-2xl shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-amber-300">Roulette Wheel</h2>
              <RouletteWheel 
                selectedNumber={selectedNumber}
                onNumberClick={handleNumberClick}
                isSpinning={isSpinning}
                result={result?.result || null}
              />
            </motion.div>
          </div>
        </div>
      </main>

      {showModal && result && (
        <ResultModal
          result={result}
          betAmount={betAmount}
          winAmount={result.win ? calculateWinnings(betType as BetType, betAmount) : 0}
          onClose={closeModal}
        />
      )}
    </motion.div>
  );
}