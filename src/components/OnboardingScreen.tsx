import React, { useState } from 'react';
import { ArrowRight, Sparkles, ChevronLeft } from 'lucide-react';
import { GlassSculpture } from './GlassSculpture';
import { AuthModal } from './AuthModal';

interface OnboardingScreenProps {
  onStartTracking: () => void;
  hasCompletedBefore?: boolean;
  onClose?: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ 
  onStartTracking,
  hasCompletedBefore = false,
  onClose
}) => {
  const [useLive3D, setUseLive3D] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  return (
    <div className="w-full min-h-screen bg-[#FAF5EF] flex flex-col justify-between px-6 pt-[max(env(safe-area-inset-top),20px)] pb-[max(env(safe-area-inset-bottom),24px)] relative select-none overflow-hidden">
      {/* Top Header Actions (No fake status bar) */}
      <div className="flex items-center justify-between w-full z-20 mb-1">
        {onClose ? (
          <button
            onClick={onClose}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-semibold text-[#181818] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        ) : (
          <div />
        )}

        {/* 3D Mode Toggle Badge */}
        <button
          onClick={() => setUseLive3D(!useLive3D)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-[11px] font-medium text-slate-700 backdrop-blur-md border border-black/5 shadow-sm transition-all"
          title="Toggle between photographic glass render and live Three.js 3D canvas"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>{useLive3D ? 'Live 3D' : 'HD Glass'}</span>
        </button>
      </div>

      {/* Top 3D Artwork */}
      <div className="flex-1 flex items-center justify-center my-auto min-h-[280px]">
        <GlassSculpture useLive3D={useLive3D} />
      </div>

      {/* Bottom Content & CTAs */}
      <div className="space-y-6 pb-2 z-10">
        {/* Headline */}
        <div className="space-y-1">
          <h1 className="text-[34px] sm:text-[38px] font-extrabold text-[#111111] leading-[1.08] tracking-[-0.03em]">
            <div>Know where</div>
            <div>
              your <span className="font-serif italic font-normal text-[#39428E] text-[38px] sm:text-[42px] px-1">money</span> goes.
            </div>
          </h1>
          <p className="text-[#78756F] text-[13.5px] sm:text-[14px] leading-relaxed pt-2 max-w-[300px]">
            Track recurring payments, spot unnecessary spending, and stay ahead of upcoming bills.
          </p>
        </div>

        {/* Action Button & Link */}
        <div className="space-y-3.5 pt-1">
          <button
            onClick={onStartTracking}
            className="w-full bg-[#181818] hover:bg-black text-white h-[54px] rounded-full px-6 font-semibold text-[15px] flex items-center justify-between shadow-[0_8px_20px_rgba(0,0,0,0.14)] active:scale-[0.98] transition-all group"
          >
            <span className="flex-1 text-center pl-4 font-medium tracking-tight">
              {hasCompletedBefore ? 'Return to dashboard' : 'Start tracking'}
            </span>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </button>

          <div className="text-center">
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-[12.5px] font-medium text-[#7A7770] hover:text-[#181818] underline underline-offset-4 transition-colors"
            >
              I already have an account
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
          onStartTracking();
        }}
      />
    </div>
  );
};

export default OnboardingScreen;
