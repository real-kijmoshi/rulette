"use client";
import { SessionProvider } from 'next-auth/react';
import RouletteTable from '@/components/roulette/RouletteTable';

export default function page() {
    return (
        <div>
        <main className="container mx-auto px-4 py-8">
            <SessionProvider>
                <RouletteTable />
            </SessionProvider>
        </main>
        </div>
    )
}