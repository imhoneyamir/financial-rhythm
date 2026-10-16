import React from 'react';
import { X, Trash2, PauseCircle, PlayCircle, Calendar, Tag, DollarSign, FileText } from 'lucide-react';
import type { Subscription } from '../types';

interface SubscriptionDetailModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onTogglePause: (id: string) => void;
  onDelete: (id: string) => void;
  renderIcon: (type: Subscription['iconType'], name: string) => React.ReactNode;
}

export const SubscriptionDetailModal: React.FC<SubscriptionDetailModalProps> = ({
  subscription,
  isOpen,
  onClose,
  onTogglePause,
  onDelete,
  renderIcon,
}) => {
  if (!isOpen || !subscription) return null;

  const annualCost = (subscription.cost * 12).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-sm bg-[#FAF6EE] rounded-t-[32px] sm:rounded-[32px] shadow-2xl p-6 border border-white/40 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ECE7DC]">
          <div className="flex items-center gap-3">
            {renderIcon(subscription.iconType, subscription.name)}
            <div>
              <h3 className="text-lg font-bold text-[#141414] leading-tight">{subscription.name}</h3>
              <span className="text-xs text-[#8A8780] font-medium">{subscription.category}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EDE8DE] hover:bg-[#E2DDD3] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-[#141414]" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="my-5 space-y-3">
          <div className="bg-white rounded-2xl p-3.5 border border-black/[0.03] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-[#706D66]">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              <span>Cost breakdown</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-extrabold text-[#141414]">${subscription.cost.toFixed(2)}/mo</span>
              <span className="text-[10px] text-[#8C8880] block">${annualCost}/year</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-black/[0.03] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-[#706D66]">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Next billing renewal</span>
            </div>
            <span className="text-xs font-bold text-[#141414]">{subscription.date}</span>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-black/[0.03] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs text-[#706D66]">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Status</span>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${subscription.isPaused ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {subscription.isPaused ? 'Paused' : 'Active'}
            </span>
          </div>

          {subscription.notes && (
            <div className="bg-white rounded-2xl p-3.5 border border-black/[0.03] shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#706D66]">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-medium">Plan details</span>
              </div>
              <p className="text-xs text-[#44423D] pl-5">{subscription.notes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          <button
            onClick={() => onTogglePause(subscription.id)}
            className="flex-1 py-3 rounded-full bg-white hover:bg-neutral-100 border border-[#DDD8CE] text-xs font-semibold text-[#181818] flex items-center justify-center gap-1.5 transition-colors"
          >
            {subscription.isPaused ? <PlayCircle className="w-4 h-4 text-emerald-600" /> : <PauseCircle className="w-4 h-4 text-amber-600" />}
            {subscription.isPaused ? 'Resume Plan' : 'Pause Plan'}
          </button>

          <button
            onClick={() => {
              onDelete(subscription.id);
              onClose();
            }}
            className="w-12 h-11 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors"
            title="Delete subscription"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
