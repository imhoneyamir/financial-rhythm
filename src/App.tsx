import React, { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { DashboardScreen } from './components/DashboardScreen';

export const App: React.FC = () => {
  // Check if user has already onboarded previously
  const [screen, setScreen] = useState<'onboarding' | 'dashboard'>(() => {
    try {
      return localStorage.getItem('financial_rhythm_onboarded') === 'true' 
        ? 'dashboard' 
        : 'onboarding';
    } catch {
      return 'onboarding';
    }
  });

  const handleStartTracking = () => {
    try {
      localStorage.setItem('financial_rhythm_onboarded', 'true');
    } catch {}
    setScreen('dashboard');
  };

  const handleReplayOnboarding = () => {
    setScreen('onboarding');
  };

  const handleBackToDashboard = () => {
    setScreen('dashboard');
  };

  let hasOnboardedBefore = false;
  try {
    hasOnboardedBefore = localStorage.getItem('financial_rhythm_onboarded') === 'true';
  } catch {}

  return (
    <div className="w-full min-h-screen bg-[#FAF5EF] text-[#141414] font-sans flex flex-col justify-between overflow-x-hidden selection:bg-purple-200">
      <div className="w-full flex-1 flex flex-col max-w-md mx-auto relative bg-[#FAF5EF]">
        {screen === 'onboarding' ? (
          <OnboardingScreen
            onStartTracking={handleStartTracking}
            hasCompletedBefore={hasOnboardedBefore}
            onClose={hasOnboardedBefore ? handleBackToDashboard : undefined}
          />
        ) : (
          <DashboardScreen onReplayOnboarding={handleReplayOnboarding} />
        )}
      </div>
    </div>
  );
};

export default App;
