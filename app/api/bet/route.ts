import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { User } from '@/db';

// Roulette constants
const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const COLUMN_1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
const COLUMN_2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
const COLUMN_3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];

// Payout ratios for different bet types
const PAYOUT_RATIOS = {
  'straight': 35,   // 35:1
  'red': 1,         // 1:1
  'black': 1,       // 1:1
  'even': 1,        // 1:1
  'odd': 1,         // 1:1
  'high': 1,        // 1:1
  'low': 1,         // 1:1
  'dozens': 2,      // 2:1
  'column': 2       // 2:1
};

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Parse request body
    const { number, betType, betValue, betAmount } = await req.json();

    // Validate bet amount
    if (!betAmount || typeof betAmount !== 'number' || betAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid bet amount' },
        { status: 400 }
      );
    }

    // Validate bet type
    const validBetTypes = ['straight', 'red', 'black', 'even', 'odd', 'high', 'low', 'dozens', 'column'];
    if (!validBetTypes.includes(betType)) {
      return NextResponse.json(
        { error: 'Invalid bet type' },
        { status: 400 }
      );
    }

    // Validate number for straight bets
    if (betType === 'straight' && (typeof number !== 'number' || number < 0 || number > 36)) {
      return NextResponse.json(
        { error: 'Invalid number for straight bet' },
        { status: 400 }
      );
    }

    // Validate betValue for dozens/columns
    if (betType === 'dozens' && !['1-12', '13-24', '25-36'].includes(betValue)) {
      return NextResponse.json(
        { error: 'Invalid dozens range' },
        { status: 400 }
      );
    }

    if (betType === 'column' && !['1', '2', '3'].includes(betValue)) {
      return NextResponse.json(
        { error: 'Invalid column selection' },
        { status: 400 }
      );
    }

    // Check user balance by id of user
    const user = await User.findOne({
      "_id": session.user.id
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Ensure user has enough balance
    if (user.balance < betAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Deduct bet amount from balance
    user.balance -= betAmount;
    await user.save();

    // Generate random result (0-36)
    const result = Math.floor(Math.random() * 37);
    const isRed = RED_NUMBERS.includes(result);
    const isEven = result !== 0 && result % 2 === 0;
    const isHigh = result >= 19 && result <= 36;

    // Determine win
    let win = false;
    switch(betType) {
      case 'straight':
        win = result === number;
        break;
      case 'red':
        win = isRed;
        break;
      case 'black':
        win = !isRed && result !== 0;
        break;
      case 'even':
        win = isEven;
        break;
      case 'odd':
        win = !isEven && result !== 0;
        break;
      case 'high':
        win = isHigh;
        break;
      case 'low':
        win = result >= 1 && result <= 18;
        break;
      case 'dozens':
        const [min, max] = betValue.split('-').map(Number);
        win = result >= min && result <= max;
        break;
      case 'column':
        win = (
          (betValue === '1' && COLUMN_1.includes(result)) ||
          (betValue === '2' && COLUMN_2.includes(result)) ||
          (betValue === '3' && COLUMN_3.includes(result))
        );
        break;
    }

    // Calculate winnings and update balance if won
    let winAmount = 0;
    if (win) {


      winAmount = betAmount * (PAYOUT_RATIOS[betType as keyof typeof PAYOUT_RATIOS] + 1);
      user.balance += winAmount;
      await user.save();
    }

    // Track bet in history (optional)
    if (!user.betHistory) {
      user.betHistory = [];
    }
    
    user.betHistory.push({
      betType,
      betAmount,
      result,
      win,
      winAmount: win ? winAmount : 0,
      timestamp: new Date()
    });
    
    await user.save();

    return NextResponse.json({
      result,
      isRed,
      isBlack: !isRed && result !== 0,
      isGreen: result === 0,
      isEven,
      isOdd: !isEven && result !== 0,
      isHigh,
      isLow: result >= 1 && result <= 18,
      win,
      winAmount: win ? winAmount : 0,
      newBalance: user.balance
    }, { status: 200 });

  } catch (error: unknown) {
    if(process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}