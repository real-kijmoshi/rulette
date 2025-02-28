"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await signIn("discord", { redirect: true, callbackUrl: "/dashboard" });
      
      if (result?.error) {
        setError(result.error);
        console.error(result.error);
      } else {
        window.location.href = "/dashboard"; 
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className="relative w-full flex items-center justify-center gap-3 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium transition-all hover:bg-indigo-700 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <>
            <Image src="/images/discord.png" alt="Discord Logo" width={24} height={24} />
            <span>Continue with Discord</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg w-full">
          <p className="text-red-500 text-sm font-medium text-center">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}