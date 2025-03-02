import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { User } from '@/db';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Use the ID from the session to find the user
        const user = await User.findOne({ 
            "_id": session.user.id
        }).lean();
        
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return user data (excluding sensitive information)
        return NextResponse.json({ 
            balance: (user as unknown as { balance: number}).balance||0,
        });
    } catch (error) {
        console.error("API route error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}