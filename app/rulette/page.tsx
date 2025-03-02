"use client";
import { SessionProvider } from 'next-auth/react';
import RouletteTable from '@/components/roulette/RouletteTable';

export default function page() {
    return (
        <div>
        <main>
            <SessionProvider>
                <RouletteTable />
            </SessionProvider>
        </main>
        </div>
    )
}

page.auth = true;