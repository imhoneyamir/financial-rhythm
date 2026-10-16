import React, { useState } from 'react';
import { 
  Download, 
  RotateCcw, 
  Check, 
  Smartphone,
  ChevronRight
} from 'lucide-react';
import type { AppSettings, Subscription } from '../../types';

interface ProfileSectionProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onReplayOnboarding: () => void;
  onOpenAuth?: () => void;
  subscriptions: Subscription[];
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  settings,
  onUpdateSettings,
  onReplayOnboarding,
  onOpenAuth,
  subscriptions,
}) => {
  const [budgetVal, setBudgetVal] = useState(settings.monthlyBudget);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const currencies: AppSettings['currency'][] = ['$', '€', '£', '¥'];

  const handleBudgetChange = (newVal: number) => {
    setBudgetVal(newVal);
    onUpdateSettings({ monthlyBudget: newVal });
  };

  const handleExportCSV = () => {
    const headers = 'Name,Category,Cost,BillingCycle,NextRenewal,Status\n';
    const rows = subscriptions
      .map(s => `"${s.name}","${s.category}",${s.cost},"${s.billingCycle}","${s.date}","${s.isPaused ? 'Paused' : 'Active'}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_rhythm_subscriptions_${Date.now()}.csv`;
    a.click();
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[24px] p-4 border border-black/[0.03] shadow-xs flex items-center gap-3.5">
        <div className="relative">
          <img
            src="/assets/alex-avatar.png"
            alt="Alex Avatar"
            className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500/20"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-extrabold text-[#141414] leading-tight">{settings.userName}</h3>
          <p className="text-xs text-[#8C8880] leading-tight mt-0.5">{settings.userEmail}</p>
          <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
            Android Premium Member
          </span>
        </div>
      </div>

      {/* Monthly Budget Setting */}
      <div className="bg-white rounded-[24px] p-4 border border-black/[0.03] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#141414]">Monthly Budget Limit</h4>
            <p className="text-[11px] text-[#8C8880]">Controls your spend gauge threshold</p>
          </div>
          <span className="text-base font-extrabold text-indigo-600">${budgetVal}</span>
        </div>

        <input
          type="range"
          min="300"
          max="2000"
          step="50"
          value={budgetVal}
          onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#A6A29A] font-mono">
          <span>$300/mo</span>
          <span>Target: ${budgetVal}/mo</span>
          <span>$2000/mo</span>
        </div>
      </div>

      {/* Currency Switcher */}
      <div className="bg-white rounded-[24px] p-4 border border-black/[0.03] shadow-xs space-y-2.5">
        <h4 className="text-sm font-bold text-[#141414]">Display Currency</h4>
        <div className="grid grid-cols-4 gap-2">
          {currencies.map((curr) => (
            <button
              key={curr}
              onClick={() => onUpdateSettings({ currency: curr })}
              className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                settings.currency === curr
                  ? 'bg-[#181818] text-white border-[#181818]'
                  : 'bg-neutral-50 text-[#68655F] border-neutral-200/60 hover:border-neutral-300'
              }`}
            >
              {curr} {curr === '$' ? 'USD' : curr === '€' ? 'EUR' : curr === '£' ? 'GBP' : 'JPY'}
            </button>
          ))}
        </div>
      </div>

      {/* Preferences & Actions */}
      <div className="bg-white rounded-[24px] p-2 border border-black/[0.03] shadow-xs divide-y divide-neutral-100">
        <button
          onClick={onOpenAuth}
          className="w-full px-3 py-3 flex items-center justify-between hover:bg-neutral-50 rounded-xl transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#141414] block">Account & Cloud Sync</span>
              <span className="text-[10px] text-[#8C8880]">Sign In with Supabase to sync your devices</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button
          onClick={handleExportCSV}
          className="w-full px-3 py-3 flex items-center justify-between hover:bg-neutral-50 rounded-xl transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#141414] block">Export All Subscriptions</span>
              <span className="text-[10px] text-[#8C8880]">Download CSV backup for Excel / Sheets</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        <button
          onClick={onReplayOnboarding}
          className="w-full px-3 py-3 flex items-center justify-between hover:bg-neutral-50 rounded-xl transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#141414] block">Replay Welcome Experience</span>
              <span className="text-[10px] text-[#8C8880]">View the 3D glass art onboarding</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {/* Android Package Info */}
      <div className="text-center pt-2 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-neutral-500">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android Package: com.financialrhythm.app</span>
        </div>
        <p className="text-[10px] text-neutral-400">Release v1.0.0 &bull; Capacitor Native Shell</p>
      </div>

      {/* Toast */}
      {showSavedToast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-[#181818] text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>CSV Exported Successfully!</span>
        </div>
      )}
    </div>
  );
};
