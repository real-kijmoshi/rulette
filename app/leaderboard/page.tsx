import { User } from '@/db';
import { Medal, Trophy } from 'lucide-react';

// Revalidate the page every 60 seconds (ISR)
export const revalidate = 60;

export default async function Leaderboard() {
  const users = await User.find()
    .select('name balance')
    .sort({ balance: -1 })
    .limit(50)
    .lean();

  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    name: user.name,
    balance: user.balance,
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-800 py-12 px-4">
      <div className="max-w-3xl w-full bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center text-white mb-6">🏆 Roulette Leaderboard</h1>
        <table className="w-full text-white">
          <thead>
            <tr className="bg-white bg-opacity-20 text-lg">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Winnings</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player) => (
              <tr key={player.rank} className="border-b border-white border-opacity-20 hover:bg-white hover:bg-opacity-10 transition">
                <td className="py-3 px-4 text-center font-semibold text-xl flex justify-center items-center">
                  {player.rank === 1 ? <Trophy className="text-yellow-400 w-6 h-6" /> :
                   player.rank === 2 ? <Medal className="text-gray-300 w-6 h-6" /> :
                   player.rank === 3 ? <Medal className="text-orange-400 w-6 h-6" /> :
                   player.rank}
                </td>
                <td className="py-3 px-4 text-center font-medium">{player.name}</td>
                <td className="py-3 px-4 text-center font-bold">${player.balance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
