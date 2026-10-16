import React, { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import type { Subscription, CategoryType } from '../../types';

interface SubscriptionsSectionProps {
  subscriptions: Subscription[];
  onSelectSubscription: (sub: Subscription) => void;
  renderIcon: (type: Subscription['iconType'], name: string) => React.ReactNode;
}

const categories: CategoryType[] = ['All', 'Entertainment', 'Design Tool', 'Cloud Storage', 'Productivity', 'AI & Tech'];

export const SubscriptionsSection: React.FC<SubscriptionsSectionProps> = ({
  subscriptions,
  onSelectSubscription,
  renderIcon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [sortBy, setSortBy] = useState<'date' | 'costHigh' | 'costLow'>('date');

  const filtered = subscriptions
    .filter((sub) => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            sub.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || sub.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'costHigh') return b.cost - a.cost;
      if (sortBy === 'costLow') return a.cost - b.cost;
      return a.date.localeCompare(b.date);
    });

  const totalFilteredCost = filtered.reduce((sum, s) => sum + (s.isPaused ? 0 : s.cost), 0);

  return (
    <div className="space-y-3.5 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-[18px] font-extrabold text-[#141414] tracking-tight">Subscriptions Catalog</h2>
          <p className="text-[11px] text-[#8C8880] font-medium">{filtered.length} active recurring services &bull; ${totalFilteredCost.toFixed(2)}/mo</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#9C988F] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#161616] border border-black/[0.04] shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#181818] text-white shadow-xs'
                : 'bg-white text-[#6E6B64] border border-black/[0.03] hover:text-[#181818]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sort row */}
      <div className="flex items-center justify-between text-[11px] text-[#8C8880] px-1 pt-1">
        <span className="font-semibold uppercase tracking-wider text-[10px]">All Services</span>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-[#181818] font-medium focus:outline-none cursor-pointer"
          >
            <option value="date">Sort by Date</option>
            <option value="costHigh">Cost: High to Low</option>
            <option value="costLow">Cost: Low to High</option>
          </select>
        </div>
      </div>

      {/* Subscription List */}
      <div className="space-y-2">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectSubscription(item)}
            className={`bg-white rounded-[20px] px-3.5 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-black/[0.03] flex items-center justify-between hover:shadow-sm transition-all cursor-pointer group ${
              item.isPaused ? 'opacity-50 bg-neutral-50' : ''
            }`}
          >
            {/* Left: Icon & Info */}
            <div className="flex items-center gap-3">
              {renderIcon(item.iconType, item.name)}
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[13.5px] font-bold text-[#141414] leading-tight">{item.name}</h4>
                  {item.isPaused && (
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded">
                      Paused
                    </span>
                  )}
                </div>
                <p className="text-[10.5px] font-normal text-[#8A8780] leading-tight mt-0.5">{item.category}</p>
              </div>
            </div>

            {/* Right: Price & Renewal */}
            <div className="text-right">
              <p className="text-[13px] font-bold text-[#141414] leading-tight">${item.cost.toFixed(2)}</p>
              <p className="text-[10px] font-medium text-[#8A8780] leading-tight mt-0.5">Renews {item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
