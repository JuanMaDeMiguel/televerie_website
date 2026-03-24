import { Trophy, Medal, Award } from 'lucide-react';
import { userProfileImage } from '../assets/images';

const leaderboardData = [
  { rank: 1, name: 'Sophie Martin', residence: 'Résidence Océan', score: 12450, avatar: 'https://images.unsplash.com/photo-1690444963408-9573a17a8058?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHNtaWxpbmclMjBmYWNlfGVufDF8fHx8MTc3MzcyMTA3N3ww&ixlib=rb-4.1.0&q=80&w=1080' },
  { rank: 2, name: 'Thomas Dubois', residence: 'Résidence Plage', score: 11320, avatar: 'https://images.unsplash.com/photo-1656857783579-bc7cd0d61a06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBzdHVkZW50JTIwY2FzdWFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczNjgzNDU1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { rank: 3, name: 'Marie Chen', residence: 'Résidence Campus', score: 10890, avatar: 'https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczNjA2Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { rank: 4, name: 'Lucas Bernard', residence: 'Résidence Sud', score: 9560, avatar: 'https://images.unsplash.com/photo-1609126396762-542d99fc7a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG1hbiUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzM2ODM0NTV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { rank: 5, name: 'Emma Garcia', residence: 'Résidence Nord', score: 9120, avatar: 'https://images.unsplash.com/photo-1618622127587-3261f2b2f553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXRpbmElMjB3b21hbiUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzM2ODM0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { rank: 6, name: 'Pierre Leroy', residence: 'Résidence Est', score: 8760, avatar: 'https://images.unsplash.com/photo-1656857783579-bc7cd0d61a06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBzdHVkZW50JTIwY2FzdWFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczNjgzNDU1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { rank: 7, name: 'Amina Rahmani', residence: 'Résidence Kergoat', score: 8450, avatar: userProfileImage, isCurrentUser: true },
  { rank: 8, name: 'Julie Rousseau', residence: 'Résidence Ouest', score: 8120, avatar: 'https://images.unsplash.com/photo-1581065178026-390bc4e78dad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzczNjA2Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { rank: 9, name: 'Alexandre Moreau', residence: 'Résidence Centre', score: 7890, avatar: 'https://images.unsplash.com/photo-1609126396762-542d99fc7a07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG1hbiUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzM2ODM0NTV8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { rank: 10, name: 'Camille Laurent', residence: 'Résidence Horizon', score: 7560, avatar: 'https://images.unsplash.com/photo-1618622127587-3261f2b2f553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXRpbmElMjB3b21hbiUyMHN0dWRlbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzM2ODM0NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
];

export function RankingScreen() {
  const currentUserScore = 8450;
  const maxScore = 1000;
  const percentage = (currentUserScore / maxScore) * 100;

  return (
    <div className="h-full bg-[#F2F2F7] flex flex-col overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <div className="bg-white pt-16 pb-6 px-6 shadow-sm">
        <h1 className="text-[28px] font-bold text-gray-900">Mon Score de Crédit</h1>
      </div>

      {/* Score Gauge */}
      <div className="px-6 pt-6">
        <div className="bg-white rounded-[20px] p-8 shadow-[0_2px_12px_rgba(0,0,0,0.05)] mb-6">
          <div className="flex flex-col items-center">
            {/* Circular Gauge */}
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="#F2F2F7"
                  strokeWidth="16"
                />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="#0066FF"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={`${percentage * 5.34} 534`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[48px] font-bold text-gray-900">{currentUserScore}</div>
                <div className="text-[15px] text-gray-500">pts</div>
              </div>
            </div>
            <p className="text-[15px] text-gray-600 text-center">
              Excellent score ! Vous êtes dans le top 10% des utilisateurs.
            </p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="px-6 pb-6">
        <h2 className="text-[20px] font-bold text-gray-900 mb-4">Top 10 Résidence</h2>
        <div className="space-y-2">
          {leaderboardData.map((user) => (
            <div
              key={user.rank}
              className={`rounded-[16px] p-4 flex items-center gap-4 transition-all ${
                user.isCurrentUser
                  ? 'bg-gray-900 text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)]'
                  : 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]'
              }`}
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-[15px]"
                style={{
                  background: user.rank === 1 ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' :
                             user.rank === 2 ? 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)' :
                             user.rank === 3 ? 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)' :
                             user.isCurrentUser ? '#0066FF' : '#F2F2F7',
                  color: user.rank <= 3 ? '#fff' : user.isCurrentUser ? '#fff' : '#666'
                }}
              >
                {user.rank <= 3 ? (
                  user.rank === 1 ? <Trophy className="w-5 h-5" /> :
                  user.rank === 2 ? <Medal className="w-5 h-5" /> :
                  <Award className="w-5 h-5" />
                ) : (
                  `#${user.rank}`
                )}
              </div>

              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/20">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-[15px] truncate ${user.isCurrentUser ? 'text-white' : 'text-gray-900'}`}>
                  {user.name}
                </div>
                <div className={`text-[13px] truncate ${user.isCurrentUser ? 'text-gray-300' : 'text-gray-500'}`}>
                  {user.residence}
                </div>
              </div>

              {/* Score */}
              <div className={`font-bold text-[17px] ${user.isCurrentUser ? 'text-white' : 'text-[#0066FF]'}`}>
                {user.score.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}