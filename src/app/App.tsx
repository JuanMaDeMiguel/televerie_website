import { useState } from 'react';
import { PhoneMockup } from './components/PhoneMockup';
import { HomeScreen } from './screens/HomeScreen';
import { RankingScreen } from './screens/RankingScreen';
import { ReservationsScreen } from './screens/ReservationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BottomNavigation } from './components/BottomNavigation';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <PhoneMockup>
      <div className="h-full relative">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'ranking' && <RankingScreen />}
        {activeTab === 'reservations' && <ReservationsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
        
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </PhoneMockup>
  );
}