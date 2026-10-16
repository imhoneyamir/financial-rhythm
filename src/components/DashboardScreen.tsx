import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  MoreHorizontal, 
  Plus, 
  ChevronDown, 
  Wifi, 
  Battery, 
  ArrowRight
} from 'lucide-react';
import { NetflixIcon, FigmaIcon, SpotifyIcon, DropboxIcon, NotionIcon, AppleIcon, GoogleIcon, ChatGPTIcon } from './BrandIcons';
import { BudgetGauge } from './BudgetGauge';
import { SpendingRhythmChart } from './SpendingRhythmChart';
import { AddSubscriptionModal, type NewSubscriptionData } from './AddSubscriptionModal';
import { SubscriptionDetailModal } from './SubscriptionDetailModal';
import { BottomNav, type TabType } from './BottomNav';
import { SubscriptionsSection } from './sections/SubscriptionsSection';
import { AnalyticsSection } from './sections/AnalyticsSection';
import { TimelineSection } from './sections/TimelineSection';
import { ProfileSection } from './sections/ProfileSection';
import { AuthModal } from './AuthModal';
import { initialSubscriptions, defaultSettings } from '../data/mockData';
import { subscriptionService } from '../services/subscriptionService';
import type { Subscription, AppSettings } from '../types';

interface DashboardScreenProps {
  onBackToOnboarding?: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onBackToOnboarding }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    subscriptionService.getSubscriptions().then(setSubscriptions);
    setSettings(subscriptionService.getSettings());
  }, []);

  // Compute total monthly recurring spend (default matches mockup: $486.40, 62%)
  const newAddedCount = Math.max(0, subscriptions.length - initialSubscriptions.length);
  const addedSpend = newAddedCount > 0 
    ? subscriptions.slice(0, newAddedCount).reduce((acc, curr) => acc + curr.cost, 0) 
    : 0;
  const totalSpend = 486.40 + addedSpend;
  const budget = settings.monthlyBudget;
  const percentage = newAddedCount > 0 ? Math.min(100, Math.round((totalSpend / budget) * 100)) : 62;

  const handleAddSubscription = async (newSub: NewSubscriptionData) => {
    const item = await subscriptionService.addSubscription({
      name: newSub.name,
      category: newSub.category as any,
      cost: newSub.cost,
      date: newSub.date,
      billingCycle: newSub.billingCycle as any,
      iconType: newSub.iconType,
      isPaused: false,
    });
    setSubscriptions((prev) => [item, ...prev]);
  };

  const handleTogglePause = async (id: string) => {
    const target = subscriptions.find(s => s.id === id);
    if (!target) return;
    const newPaused = !target.isPaused;
    await subscriptionService.togglePause(id, newPaused);
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPaused: newPaused } : s))
    );
    if (selectedSub && selectedSub.id === id) {
      setSelectedSub((prev) => prev ? { ...prev, isPaused: newPaused } : null);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    await subscriptionService.deleteSubscription(id);
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleOpenDetail = (sub: Subscription) => {
    setSelectedSub(sub);
    setIsDetailModalOpen(true);
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      subscriptionService.saveSettings(updated);
      return updated;
    });
  };

  const renderIcon = (type: Subscription['iconType'], name: string) => {
    switch (type) {
      case 'netflix':
        return <NetflixIcon className="w-3.5 h-3.5" />;
      case 'figma':
        return <FigmaIcon className="w-3.5 h-3.5" />;
      case 'spotify':
        return <SpotifyIcon className="w-4 h-4" />;
      case 'dropbox':
        return <DropboxIcon className="w-4 h-4" />;
      case 'notion':
        return <NotionIcon className="w-4 h-4" />;
      case 'apple':
        return <AppleIcon className="w-4 h-4" />;
      case 'google':
        return <GoogleIcon className="w-4 h-4" />;
      case 'chatgpt':
        return <ChatGPTIcon className="w-4 h-4" />;
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full bg-[#FAF5EF] flex flex-col justify-between relative select-none overflow-hidden">
      {/* Scrollable Screen Content */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto no-scrollbar">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between text-[#1E1E1E] text-xs font-semibold px-1 pt-1 opacity-90 mb-2">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] tracking-tighter mr-0.5">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* TAB 1: OVERVIEW (Exact Screenshot UI) */}
        {activeTab === 'overview' && (
          <div className="space-y-3.5 pb-6 animate-fade-in">
            {/* User Profile Header */}
            <div className="flex items-center justify-between">
              <div 
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2.5 cursor-pointer group"
                title="View Alex's profile & settings"
              >
                <div className="relative">
                  <img 
                    src="/assets/alex-avatar.png" 
                    alt="Alex Avatar"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80 shadow-sm transition-transform group-hover:scale-105"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                </div>
                <div>
                  <p className="text-[11px] font-normal text-[#8A8780] leading-tight">Good morning,</p>
                  <h2 className="text-[15px] font-bold text-[#141414] leading-tight flex items-center gap-1">
                    {settings.userName}
                  </h2>
                </div>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center transition-all border border-black/5 shadow-subtle relative"
                >
                  <Bell className="w-3.5 h-3.5 text-[#161616]" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6339] ring-2 ring-[#FAF5EF]" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-black/5 p-3 z-30 animate-fade-in text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                      <span className="font-semibold text-neutral-800">Alerts</span>
                      <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">2 new</span>
                    </div>
                    <div className="space-y-2 mt-2">
                      <div className="p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                        <p className="font-medium text-neutral-800">Netflix renewal</p>
                        <p className="text-[11px] text-neutral-500">$15.99 due in 4 days (Apr 12)</p>
                      </div>
                      <div className="p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                        <p className="font-medium text-neutral-800">Budget update</p>
                        <p className="text-[11px] text-neutral-500">You're 8% below last month's pace 👏</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hero Card: Recurring this month */}
            <div className="hero-card-gradient rounded-[24px] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.03)] border border-white/80 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-[11.5px] font-medium text-[#7A7771]">Recurring this month</span>
                  <div className="text-[30px] font-extrabold text-[#111111] tracking-tight font-sans">
                    {settings.currency}{totalSpend.toFixed(2)}
                  </div>
                  <div className="inline-flex items-center gap-1 bg-[#E7F8EE] text-[#129A48] text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                    <ChevronDown className="w-3 h-3 stroke-[3]" />
                    <span>8% less than last month</span>
                  </div>
                </div>

                <BudgetGauge percentage={percentage} budget={budget} size={78} />
              </div>
            </div>

            {/* Section: Coming Up */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-[16px] font-bold text-[#141414] tracking-tight">Coming up</h3>
                <button 
                  onClick={() => setActiveTab('timeline')}
                  className="text-[11.5px] font-medium text-[#7D7A73] hover:text-[#181818] flex items-center gap-1 transition-colors"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Horizontal Cards (Netflix, Figma, Spotify) */}
              <div className="grid grid-cols-3 gap-2">
                {subscriptions.slice(0, 3).map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className="bg-white rounded-[20px] p-2.5 shadow-[0_3px_12px_rgba(0,0,0,0.02)] border border-black/[0.03] flex flex-col justify-between h-[116px] hover:shadow-md transition-shadow group cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      {renderIcon(item.iconType, item.name)}
                      <button className="text-[#B3B0A8] hover:text-[#525252] p-0.5">
                        <MoreHorizontal className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-[12.5px] font-bold text-[#141414] truncate leading-tight">{item.name}</h4>
                      <p className="text-[10.5px] font-medium text-[#8D8A83] leading-tight">{item.date}</p>
                      <p className="text-[12.5px] font-bold text-[#141414] leading-tight pt-0.5">${item.cost.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section: Spending Rhythm (Interactive Chart) */}
            <SpendingRhythmChart />

            {/* Section: Your Subscriptions (Dropbox, Notion) */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-2 px-1">
                <h3 className="text-[16px] font-bold text-[#141414] tracking-tight">Your subscriptions</h3>
                <button 
                  onClick={() => setActiveTab('subscriptions')}
                  className="text-[11.5px] font-medium text-[#7D7A73] hover:text-[#181818] flex items-center gap-1 transition-colors"
                >
                  <span>See all</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {subscriptions.slice(3, 5).map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className="bg-white rounded-[20px] px-3.5 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-black/[0.03] flex items-center justify-between hover:shadow-sm transition-shadow group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {renderIcon(item.iconType, item.name)}
                      <div>
                        <h4 className="text-[13.5px] font-bold text-[#141414] leading-tight">{item.name}</h4>
                        <p className="text-[10.5px] font-normal text-[#8A8780] leading-tight mt-0.5">{item.category}</p>
                      </div>
                    </div>

                    <div className="text-left hidden xs:block">
                      <p className="text-[12px] font-semibold text-[#161616] leading-tight">{item.date}</p>
                      <p className="text-[9.5px] font-normal text-[#8A8780] leading-tight mt-0.5">Next bill</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-[13px] font-bold text-[#141414] leading-tight">${item.cost.toFixed(2)}</p>
                        <p className="text-[9.5px] font-normal text-[#8A8780] leading-tight mt-0.5">{item.billingCycle}</p>
                      </div>
                      <button className="text-[#C2BFB8] hover:text-[#525252] p-0.5">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SPENDING RHYTHM / ANALYTICS */}
        {activeTab === 'rhythm' && (
          <div className="animate-fade-in">
            <AnalyticsSection subscriptions={subscriptions} />
          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS CATALOG */}
        {activeTab === 'subscriptions' && (
          <div className="animate-fade-in">
            <SubscriptionsSection
              subscriptions={subscriptions}
              onSelectSubscription={handleOpenDetail}
              renderIcon={renderIcon}
            />
          </div>
        )}

        {/* TAB 4: UPCOMING TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="animate-fade-in">
            <TimelineSection
              subscriptions={subscriptions}
              renderIcon={renderIcon}
            />
          </div>
        )}

        {/* TAB 5: PROFILE & SETTINGS */}
        {activeTab === 'profile' && (
          <div className="animate-fade-in">
            <ProfileSection
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onReplayOnboarding={() => onBackToOnboarding && onBackToOnboarding()}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              subscriptions={subscriptions}
            />
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) for Quick Add */}
      <div className="absolute bottom-16 right-4 z-40">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-[48px] h-[48px] rounded-full bg-[#181818] hover:bg-black text-white flex items-center justify-center shadow-fab active:scale-95 transition-all group ring-2 ring-white/10"
          title="Add subscription"
        >
          <Plus className="w-5 h-5 stroke-[2.2] transition-transform group-hover:rotate-90 duration-300" />
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />

      {/* Modals */}
      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSubscription}
      />

      <SubscriptionDetailModal
        subscription={selectedSub}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onTogglePause={handleTogglePause}
        onDelete={handleDeleteSubscription}
        renderIcon={renderIcon}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(userEmail) => {
          handleUpdateSettings({ userEmail });
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
};
