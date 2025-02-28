// src/app/roulette/page.tsx
"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import RouletteTable from "@/components/roulette/RouletteTable";




export default function RoulettePage() {
  return (
    <>
        <SessionProvider>
          <div className="bg-slate-900 min-h-screen">
            <RouletteTable />
          </div>
        </SessionProvider>
    </>
  );
}