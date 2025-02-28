export const BET_TYPES = ['straight', 'red', 'black', 'even', 'odd', 'high', 'low', 'dozens', 'column'] as const;
export type BetType = typeof BET_TYPES[number];

export interface GameResult {
  result: number;
  win: boolean;
  isRed: boolean;
  isBlack: boolean;
  isGreen: boolean;
  isEven: boolean;
  isOdd: boolean;
  isHigh: boolean;
  isLow: boolean;
}