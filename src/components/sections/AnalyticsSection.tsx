import React from 'react';
import { SpendingRhythmChart } from '../SpendingRhythmChart';
import { TrendingDown, Sparkles, ArrowUpRight } from 'lucide-react';
import type { Subscription } from '../../types';

interface AnalyticsSectionProps {
  subscriptions: Subscription[];
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({ subscriptions }) => {
  const activeSubs = subscriptions.filter(s => !s.isPaused);
  const monthlyTotal = 486.40;
  const annualTotal = monthlyTotal * 12;

  // Category breakdown calculation
  const categoryMap: { [cat: string]: number } = {};
  activeSubs.forEach(s => {
    categoryMap[s.category] = (categoryMap[s.category] || 0) + s.cost;
  });

  const categories = Object.keys(categoryMap).map(cat => ({
    name: cat,
    total: categoryMap[cat],
    percentage: Math.round((categoryMap[cat] / monthlyTotal) * 100),
  })).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="px-1">
        <h2 className="text-[18px] font-extrabold text-[#141414] tracking-tight">Spending Analytics</h2>
        <p className="text-[11px] text-[#8C8880] font-medium">Historical cash flow curves & category distribution</p>
      </div>

      {/* Main Rhythm Spline Chart */}
      <div className="bg-white rounded-[24px] p-4 border border-black/[0.03] shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
        <SpendingRhythmChart />
      </div>

      {/* Annual & Monthly Projections */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-white rounded-[20px] p-3.5 border border-black/[0.03] shadow-xs">
          <span className="text-[10.5px] font-medium text-[#8C8880] block">Average Monthly</span>
          <span className="text-[18px] font-extrabold text-[#141414] tracking-tight mt-0.5 block">$385.50</span>
          <span className="text-[9.5px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingDown className="w-3 h-3" />
            Within $800 target
          </span>
        </div>

        <div className="bg-white rounded-[20px] p-3.5 border border-black/[0.03] shadow-xs">
          <span className="text-[10.5px] font-medium text-[#8C8880] block">Projected Annual</span>
          <span className="text-[18px] font-extrabold text-[#141414] tracking-tight mt-0.5 block">${annualTotal.toFixed(2)}</span>
          <span className="text-[9.5px] text-indigo-600 font-semibold flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            Based on current tier
          </span>
        </div>
      </div>

      {/* Category Spend Distribution */}
      <div className="bg-white rounded-[24px] p-4 border border-black/[0.03] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#141414]">Spend by Category</h3>
          <span className="text-[10px] text-[#8C8880] font-medium">{categories.length} active sectors</span>
        </div>

        <div className="space-y-2.5">
          {categories.map((c, idx) => {
            const colors = ['bg-indigo-500', 'bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'];
            const barColor = colors[idx % colors.length];
            return (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-[#181818]">
                  <span>{c.name}</span>
                  <span>${c.total.toFixed(2)} <span className="text-[10px] text-[#8C8880] font-normal">({c.percentage}%)</span></span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} rounded-full`} style={{ width: `${Math.min(100, c.percentage * 1.5)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Optimization Insight */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[22px] p-4 border border-indigo-100/60 shadow-xs space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Smart Rhythm Insight</span>
        </div>
        <p className="text-[11.5px] text-indigo-800/80 leading-relaxed">
          Switching <strong>Notion</strong> and <strong>Figma</strong> to annual billing would save approximately <strong>$44.00/year</strong> while smoothing out your monthly cashflow rhythm.
        </p>
      </div>
    </div>
  );
};
