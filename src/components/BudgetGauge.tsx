import React from 'react';

interface BudgetGaugeProps {
  percentage?: number;
  budget?: number;
  size?: number;
  strokeWidth?: number;
}

export const BudgetGauge: React.FC<BudgetGaugeProps> = ({
  percentage = 62,
  budget = 800,
  size = 82,
  strokeWidth = 7.5,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="40%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        {/* Background Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#E0E7FF"
          strokeWidth={strokeWidth}
          opacity="0.8"
        />

        {/* Animated Progress Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Text Labels */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <span className="text-[16px] font-extrabold text-[#151515] leading-none tracking-tight">
          {percentage}%
        </span>
        <span className="text-[9px] text-[#78756F] font-medium leading-tight mt-1">
          of ${budget}
        </span>
        <span className="text-[9px] text-[#78756F] font-medium leading-none">
          budget
        </span>
      </div>
    </div>
  );
};
