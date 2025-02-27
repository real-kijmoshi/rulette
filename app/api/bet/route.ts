import { NextResponse } from 'next/server';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const COLUMN_1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
const COLUMN_2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
const COLUMN_3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];

export async function POST(req: Request) {
  try {
    const { number, betType, betValue } = await req.json();

    // Validate bet type
    const validBetTypes = ['straight', 'red', 'black', 'even', 'odd', 'high', 'low', 'dozens', 'column'];
    if (!validBetTypes.includes(betType)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid bet type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate number for straight bets
    if (betType === 'straight' && (typeof number !== 'number' || number < 0 || number > 36)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid number for straight bet' }),
        { status: 400 }
      );
    }

    // Validate betValue for dozens/columns
    if (betType === 'dozens' && !['1-12', '13-24', '25-36'].includes(betValue)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid dozens range' }),
        { status: 400 }
      );
    }

    if (betType === 'column' && !['1', '2', '3'].includes(betValue)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid column selection' }),
        { status: 400 }
      );
    }

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

    return new NextResponse(JSON.stringify({
      result,
      isRed,
      isBlack: !isRed && result !== 0,
      isGreen: result === 0,
      isEven,
      isOdd: !isEven && result !== 0,
      isHigh,
      isLow: result >= 1 && result <= 18,
      win
    }), { status: 200 });

  } catch (error: unknown) {
    if(process.env.NODE_ENV === 'development') {
      console.error(error);
    }
    
    return new NextResponse(
      JSON.stringify({ error: 'Server error' }),
      { status: 500 }
    );
  }
}