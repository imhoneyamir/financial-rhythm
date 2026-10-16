import React from 'react';
import { Home, LineChart, CreditCard, Calendar, User } from 'lucide-react';

export type TabType = 'overview' | 'rhythm' | 'subscriptions' | 'timeline' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'overview' as const, label: 'Home', icon: Home },
    { id: 'rhythm' as const, label: 'Rhythm', icon: LineChart },
    { id: 'subscriptions' as const, label: 'Catalog', icon: CreditCard },
    { id: 'timeline' as const, label: 'Upcoming', icon: Calendar },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-t border-black/[0.04] px-3 py-2 flex items-center justify-around z-30 flex-shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all duration-200 relative ${
              isActive 
                ? 'text-[#141414] font-bold' 
                : 'text-[#9A9790] hover:text-[#525252]'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#FAF5EF]' : ''}`}>
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5] text-indigo-600' : 'stroke-[1.8]'}`} />
            </div>
            <span className="text-[9.5px] mt-0.5 tracking-tight leading-none">{tab.label}</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-600" />
            )}
          </button>
        );
      })}
    </div>
  );
};
