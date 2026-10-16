import React, { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { Smartphone, Layers, Eye, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'both' | 'onboarding' | 'dashboard'>('both');

  return (
    <div className="min-h-screen bg-[#D6D1CA] flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 font-sans text-[#141414]">
      {/* Top Floating Control Bar */}
      <header className="mb-5 z-30 flex items-center justify-between w-full max-w-4xl px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#181818] text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#181818] tracking-tight leading-none">
              Financial Rhythm
            </h1>
            <p className="text-[11px] text-[#78756F] font-medium leading-tight mt-0.5">
              Pixel-Perfect Reproduction &bull; Live Prototype
            </p>
          </div>
        </div>

        {/* View Switcher Pills */}
        <div className="bg-white/80 backdrop-blur-md p-1 rounded-full border border-black/5 shadow-subtle flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveView('both')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeView === 'both' 
                ? 'bg-[#181818] text-white shadow-sm' 
                : 'text-[#68655F] hover:text-[#181818]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side-by-Side</span>
          </button>

          <button
            onClick={() => setActiveView('onboarding')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeView === 'onboarding' 
                ? 'bg-[#181818] text-white shadow-sm' 
                : 'text-[#68655F] hover:text-[#181818]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Onboarding</span>
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
              activeView === 'dashboard' 
                ? 'bg-[#181818] text-white shadow-sm' 
                : 'text-[#68655F] hover:text-[#181818]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="w-full max-w-5xl flex items-center justify-center">
        {/* SIDE BY SIDE PRESENTATION (Exact Match to Screenshot) */}
        {activeView === 'both' && (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 w-full animate-fade-in">
            {/* Phone 1: Onboarding */}
            <div className="relative group">
              <div className="w-[330px] sm:w-[350px] h-[800px] rounded-[48px] bg-[#FAF5EF] shadow-phone ring-1 ring-black/[0.04] p-2 flex flex-col justify-between overflow-hidden relative border-[6px] border-[#FAF5EF]">
                <div className="w-full h-full rounded-[42px] overflow-hidden relative">
                  <OnboardingScreen onStartTracking={() => setActiveView('dashboard')} />
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/20 rounded-full z-40 pointer-events-none" />
              </div>
            </div>

            {/* Phone 2: Dashboard */}
            <div className="relative group">
              <div className="w-[330px] sm:w-[350px] h-[800px] rounded-[48px] bg-[#FAF5EF] shadow-phone ring-1 ring-black/[0.04] p-2 flex flex-col justify-between overflow-hidden relative border-[6px] border-[#FAF5EF]">
                <div className="w-full h-full rounded-[42px] overflow-hidden relative">
                  <DashboardScreen onBackToOnboarding={() => setActiveView('onboarding')} />
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/20 rounded-full z-40 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* SINGLE PHONE: ONBOARDING */}
        {activeView === 'onboarding' && (
          <div className="w-[330px] sm:w-[365px] h-[800px] rounded-[50px] bg-[#FAF5EF] shadow-phone ring-1 ring-black/[0.04] p-2 flex flex-col justify-between overflow-hidden relative border-[7px] border-[#FAF5EF] animate-fade-in">
            <div className="w-full h-full rounded-[44px] overflow-hidden relative">
              <OnboardingScreen onStartTracking={() => setActiveView('dashboard')} />
            </div>
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full z-40 pointer-events-none" />
          </div>
        )}

        {/* SINGLE PHONE: DASHBOARD */}
        {activeView === 'dashboard' && (
          <div className="w-[330px] sm:w-[365px] h-[800px] rounded-[50px] bg-[#FAF5EF] shadow-phone ring-1 ring-black/[0.04] p-2 flex flex-col justify-between overflow-hidden relative border-[7px] border-[#FAF5EF] animate-fade-in">
            <div className="w-full h-full rounded-[44px] overflow-hidden relative">
              <DashboardScreen onBackToOnboarding={() => setActiveView('onboarding')} />
            </div>
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full z-40 pointer-events-none" />
          </div>
        )}
      </main>

      {/* Footer credits */}
      <footer className="mt-6 text-center text-xs text-[#8A8780] font-medium">
        Matching user reference screenshot &bull; Built with React, Tailwind CSS & Three.js
      </footer>
    </div>
  );
};

export default App;
