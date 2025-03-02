import React from "react";
import { motion } from "framer-motion";
import { FaUser, FaCoins, FaSignOutAlt } from "react-icons/fa";

interface HeaderProps {
  balance: number;
  username: string;
}

export default function Header({ balance, username }: HeaderProps) {
  return (
    <header className="bg-slate-900/90 shadow-xl backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <motion.h1
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-red-500"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Roulette Royale
          </motion.h1>

          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <motion.div 
              className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <FaCoins className="text-amber-400" />
              <span className="font-bold">${(balance||0).toLocaleString()}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <FaUser className="text-sky-400" />
              <span>{username}</span>
            </motion.div>

            <motion.button
              className="flex items-center gap-2 bg-red-600/80 px-4 py-2 rounded-full font-semibold hover:bg-red-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Logout user
                window.location.href = '/api/auth/signout';
              }}
            >
              <FaSignOutAlt />
              <span className="hidden md:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
