import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export interface NewSubscriptionData {
  name: string;
  category: string;
  cost: number;
  date: string;
  billingCycle: string;
  iconType: 'netflix' | 'figma' | 'spotify' | 'dropbox' | 'notion' | 'custom';
}

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sub: NewSubscriptionData) => void;
}

const presets = [
  { name: 'Netflix', category: 'Entertainment', cost: 15.99, iconType: 'netflix' as const },
  { name: 'Figma', category: 'Design Tool', cost: 12.00, iconType: 'figma' as const },
  { name: 'Spotify', category: 'Music Streaming', cost: 10.99, iconType: 'spotify' as const },
  { name: 'Dropbox', category: 'Cloud Storage', cost: 11.99, iconType: 'dropbox' as const },
  { name: 'Notion', category: 'Productivity', cost: 10.00, iconType: 'notion' as const },
  { name: 'ChatGPT Plus', category: 'AI Assistant', cost: 20.00, iconType: 'custom' as const },
  { name: 'iCloud+', category: 'Cloud Storage', cost: 2.99, iconType: 'custom' as const },
];

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('Apr 25');
  const [iconType, setIconType] = useState<'netflix' | 'figma' | 'spotify' | 'dropbox' | 'notion' | 'custom'>('custom');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cost) return;

    onAdd({
      name,
      category: category || 'Subscription',
      cost: parseFloat(cost) || 9.99,
      date: date || 'Apr 30',
      billingCycle: '/ month',
      iconType,
    });
    setName('');
    setCategory('');
    setCost('');
    onClose();
  };

  const handleSelectPreset = (p: typeof presets[0]) => {
    setName(p.name);
    setCategory(p.category);
    setCost(p.cost.toString());
    setIconType(p.iconType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-sm bg-[#FAF6EE] rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 border border-white/40 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ECE7DC]">
          <h3 className="text-lg font-bold text-[#141414]">New Subscription</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EDE8DE] hover:bg-[#E2DDD3] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-[#141414]" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="my-3">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8780] block mb-2">
            Quick Select
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {presets.slice(0, 5).map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleSelectPreset(p)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  name === p.name 
                    ? 'bg-[#181818] text-white border-[#181818]' 
                    : 'bg-white text-[#4A4741] border-[#E8E4DC] hover:border-[#CCC7BD]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
          <div>
            <label className="text-[11px] font-medium text-[#7C7972] block mb-1">Service Name</label>
            <input 
              type="text" 
              placeholder="e.g. YouTube Premium" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#181818] border border-[#E8E4DC] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-[#7C7972] block mb-1">Monthly Cost ($)</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="13.99" 
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                required
                className="w-full bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#181818] border border-[#E8E4DC] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[#7C7972] block mb-1">Next Billing</label>
              <input 
                type="text" 
                placeholder="Apr 28" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#181818] border border-[#E8E4DC] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-[#7C7972] block mb-1">Category</label>
            <input 
              type="text" 
              placeholder="Entertainment, Cloud, SaaS..." 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white rounded-xl px-3.5 py-2.5 text-sm text-[#181818] border border-[#E8E4DC] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-[#181818] hover:bg-black text-white py-3.5 rounded-full font-semibold text-sm transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Add to Subscriptions
          </button>
        </form>
      </div>
    </div>
  );
};
