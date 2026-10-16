import React, { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import type { Subscription } from '../../types';

interface TimelineSectionProps {
  subscriptions: Subscription[];
  renderIcon: (type: Subscription['iconType'], name: string) => React.ReactNode;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  subscriptions,
  renderIcon,
}) => {
  const [reminders, setReminders] = useState<{ [id: string]: boolean }>({
    '1': true,
    '2': true,
    '3': true,
    '4': false,
    '5': true,
  });

  const toggleReminder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReminders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const upcomingItems = [
    { ...subscriptions[0], daysLeft: 2, statusTag: 'In 2 days', urgency: 'high' },
    { ...subscriptions[1], daysLeft: 4, statusTag: 'In 4 days', urgency: 'medium' },
    { ...subscriptions[2], daysLeft: 8, statusTag: 'Next week', urgency: 'normal' },
    { ...subscriptions[3], daysLeft: 10, statusTag: 'In 10 days', urgency: 'normal' },
    { ...subscriptions[4], daysLeft: 12, statusTag: 'In 12 days', urgency: 'normal' },
    ...(subscriptions.slice(5).map((s, idx) => ({
      ...s,
      daysLeft: 15 + idx * 3,
      statusTag: `In ${15 + idx * 3} days`,
      urgency: 'low',
    }))),
  ];

  const totalUpcomingCost = upcomingItems.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="px-1">
        <h2 className="text-[18px] font-extrabold text-[#141414] tracking-tight">Upcoming Renewals</h2>
        <p className="text-[11px] text-[#8C8880] font-medium">Next 30 days &bull; ${totalUpcomingCost.toFixed(2)} due</p>
      </div>

      {/* Timeline List */}
      <div className="space-y-2.5">
        {upcomingItems.map((item) => {
          const hasReminder = !!reminders[item.id];
          return (
            <div
              key={item.id}
              className="bg-white rounded-[22px] p-3.5 border border-black/[0.03] shadow-xs flex items-center justify-between hover:shadow-sm transition-all"
            >
              {/* Left: Icon & Title */}
              <div className="flex items-center gap-3">
                {renderIcon(item.iconType, item.name)}
                <div>
                  <h4 className="text-[13.5px] font-bold text-[#141414] leading-tight">{item.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-full">
                      {item.statusTag}
                    </span>
                    <span className="text-[10.5px] text-[#8A8780] font-normal">{item.date}</span>
                  </div>
                </div>
              </div>

              {/* Right: Cost & Reminder Toggle */}
              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <span className="text-[13.5px] font-extrabold text-[#141414]">${item.cost.toFixed(2)}</span>
                  <span className="text-[9.5px] text-[#8C8880] block">automatic</span>
                </div>

                <button
                  onClick={(e) => toggleReminder(item.id, e)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    hasReminder 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'bg-neutral-100 text-neutral-400 hover:text-neutral-600'
                  }`}
                  title={hasReminder ? 'Reminder enabled' : 'Set reminder'}
                >
                  {hasReminder ? <Bell className="w-3.5 h-3.5 fill-current" /> : <BellOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
