import { Home, Trophy, Calendar, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <>
      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 pb-8 pt-2 z-50">
        <div className="flex items-center justify-around px-6">
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center gap-1 py-2 transition-colors ${
              activeTab === 'home' ? 'text-[#0066FF]' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[11px] font-medium">Accueil</span>
          </button>

          <button
            onClick={() => onTabChange('ranking')}
            className={`flex flex-col items-center gap-1 py-2 transition-colors ${
              activeTab === 'ranking' ? 'text-[#0066FF]' : 'text-gray-400'
            }`}
          >
            <Trophy className="w-6 h-6" strokeWidth={activeTab === 'ranking' ? 2.5 : 2} />
            <span className="text-[11px] font-medium">Classement</span>
          </button>

          <button
            onClick={() => onTabChange('reservations')}
            className={`flex flex-col items-center gap-1 py-2 transition-colors ${
              activeTab === 'reservations' ? 'text-[#0066FF]' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-6 h-6" strokeWidth={activeTab === 'reservations' ? 2.5 : 2} />
            <span className="text-[11px] font-medium">Réservations</span>
          </button>

          <button
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center gap-1 py-2 transition-colors ${
              activeTab === 'profile' ? 'text-[#0066FF]' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[11px] font-medium">Profil</span>
          </button>
        </div>
      </div>

      {/* iOS Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-gray-900 rounded-full z-50" />
    </>
  );
}
