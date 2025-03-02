import { User } from '@/db';

export default async function Leaderboard() {
  const users = await User.find()
    .select('name balance')
    .sort({ balance: -1 }) // Sort by balance (descending)
    .limit(50) // Limit to top 50 users
    .lean(); // Convert to plain JavaScript objects
  
  // Add ranking numbers
  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    name: user.name,
    balance: user.balance,
  }));

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <h1 className="text-2xl font-bold text-center bg-gray-800 text-white py-4">
          Roulette Leaderboard
        </h1>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">Username</th>
              <th className="py-2 px-4">Winnings</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player) => (
              <tr key={player.rank} className="border-b">
                <td className="py-2 px-4 text-center">{player.rank}</td>
                <td className="py-2 px-4 text-center">{player.name}</td>
                <td className="py-2 px-4 text-center">${player.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
