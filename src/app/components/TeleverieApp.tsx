import { useState } from 'react';
import { Home, TrendingUp, Calendar, User, Map } from 'lucide-react';
import { MachineCard, Machine } from './MachineCard';
import televerieLogoImg from 'figma:asset/f61791ebff5af6fe1de02e99017ea28c7a1938bf.png';
import { userProfileImage } from '../assets/images';

const profileImage = userProfileImage;

const machines: Machine[] = [
  { id: '1', number: 'L1', type: 'washer', status: 'available' },
  { id: '2', number: 'L2', type: 'washer', status: 'in-use', timeRemaining: '17m', progress: 65 },
  { id: '3', number: 'L3', type: 'washer', status: 'reserved' },
  { id: '4', number: 'S1', type: 'dryer', status: 'offline', progress: 50 },
  { id: '5', number: 'S2', type: 'dryer', status: 'offline', progress: 50 },
  { id: '6', number: 'L4', type: 'washer', status: 'in-use', timeRemaining: '8m', progress: 85 },
  { id: '7', number: 'L5', type: 'washer', status: 'available' },
  { id: '8', number: 'S3', type: 'dryer', status: 'available' },
];

type FilterType = 'all' | 'washer' | 'dryer';

export function TeleverieApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredMachines = machines.filter(machine => {
    if (filter === 'all') return true;
    return machine.type === filter;
  });

  const counts = {
    all: machines.length,
    washer: machines.filter(m => m.type === 'washer').length,
    dryer: machines.filter(m => m.type === 'dryer').length,
  };

  return (
    <div className="h-full bg-[#F8F9FA] flex flex-col relative">
      {/* Header */}
      <div className="bg-white pt-16 pb-6 px-6">
        {/* Greeting */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-[17px] text-gray-600">Bonjour, Amina</div>
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* App Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full overflow-hidden shadow-sm">
            <img src={televerieLogoImg} alt="Televerie Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-[28px] font-bold text-gray-900 leading-none mb-1">televerie</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2ECC71]" />
              <span className="text-[15px] text-gray-600">Ouverte</span>
              <span className="text-[15px] text-gray-400 mx-1">·</span>
              <span className="text-[15px] text-gray-600">Laverie de Kergoat</span>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 text-[15px] text-[#466478] font-medium ml-auto">
          <Map className="w-4 h-4" />
          Vue Plan
        </button>
      </div>

      {/* Filter Pills */}
      <div className="bg-white px-6 pb-5 flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-full text-[15px] font-medium whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-[#466478] text-white shadow-sm'
              : 'bg-[#F8F9FA] text-gray-600'
          }`}
        >
          Tout ({counts.all})
        </button>
        <button
          onClick={() => setFilter('washer')}
          className={`px-5 py-2.5 rounded-full text-[15px] font-medium whitespace-nowrap transition-all ${
            filter === 'washer'
              ? 'bg-[#466478] text-white shadow-sm'
              : 'bg-[#F8F9FA] text-gray-600'
          }`}
        >
          Lave-linge ({counts.washer})
        </button>
        <button
          onClick={() => setFilter('dryer')}
          className={`px-5 py-2.5 rounded-full text-[15px] font-medium whitespace-nowrap transition-all ${
            filter === 'dryer'
              ? 'bg-[#466478] text-white shadow-sm'
              : 'bg-[#F8F9FA] text-gray-600'
          }`}
        >
          Sèche-linge ({counts.dryer})
        </button>
      </div>

      {/* Machine List */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-28">
        <div className="space-y-3">
          {filteredMachines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
        </div>
      </div>

      {/* Floating Reserve Button */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center px-6 pointer-events-none">
        <button className="pointer-events-auto bg-[#466478] text-white px-8 py-4 rounded-[28px] shadow-[0_8px_24px_rgba(70,100,120,0.3)] text-[17px] font-semibold flex items-center gap-2 transition-all active:scale-95">
          Réserver une machine
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 pb-8 pt-2">
        <div className="flex items-center justify-around px-6">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 py-2 transition-colors ${
              activeTab === 'home' ? 'text-[#466478]' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[11px] font-medium">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex flex-col items-center gap-1 py-2 transition-colors ${
              activeTab === 'leaderboard' ? 'text-[#466478]' : 'text-gray-400'
            }`}
          >
            <TrendingUp className="w-6 h-6" strokeWidth={activeTab === 'leaderboard' ? 2.5 : 2} />
            <span className="text-[11px] font-medium">Classement</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1 py-2 transition-colors ${
              activeTab === 'calendar' ? 'text-[#466478]' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-6 h-6" strokeWidth={activeTab === 'calendar' ? 2.5 : 2} />
            <span className="text-[11px] font-medium">Réservations</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 py-2 transition-colors ${
              activeTab === 'profile' ? 'text-[#466478]' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
            <span className="text-[11px] font-medium">Profil</span>
          </button>
        </div>
      </div>

      {/* iOS Home Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-gray-900 rounded-full" />
    </div>
  );
}