"use client";

import { SignInButton } from "@/components/signin-button";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="rounded-md bg-gray-800 p-6 shadow-md">
        <h1 className="mb-4 text-center text-xl font-semibold text-white">
          Log In
        </h1>
        <SignInButton />
      </div>
    </main>
  );
}
