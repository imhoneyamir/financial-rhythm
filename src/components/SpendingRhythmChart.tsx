import React, { useState } from 'react';

interface DataPoint {
  month: string;
  year: string;
  amount: number;
  secondaryAmount: number;
}

const defaultData: DataPoint[] = [
  { month: 'Jan', year: 'Jan 2025', amount: 320, secondaryAmount: 260 },
  { month: 'Feb', year: 'Feb 2025', amount: 330, secondaryAmount: 290 },
  { month: 'Mar', year: 'Mar 2025', amount: 360, secondaryAmount: 310 },
  { month: 'Apr', year: 'Apr 2025', amount: 486, secondaryAmount: 340 },
  { month: 'May', year: 'May 2025', amount: 380, secondaryAmount: 480 },
  { month: 'Jun', year: 'Jun 2025', amount: 350, secondaryAmount: 320 },
];

export const SpendingRhythmChart: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(3); // Apr default
  const [filterPeriod, setFilterPeriod] = useState<string>('6 months');
  const [showFilterMenu, setShowFilterMenu] = useState<boolean>(false);

  const data = defaultData;
  const activePoint = data[selectedIndex];

  // SVG dimensions
  const width = 295;
  const height = 98;
  const paddingX = 16;
  const maxVal = 800;

  // Calculate coordinates
  const getX = (index: number) => paddingX + (index / (data.length - 1)) * (width - 2 * paddingX);
  const getY = (val: number) => height - (val / maxVal) * (height - 18) - 10;

  // Generate smooth cubic bezier SVG path
  const createSpline = (key: 'amount' | 'secondaryAmount') => {
    const points = data.map((d, i) => ({ x: getX(i), y: getY(d[key]) }));
    if (points.length === 0) return '';

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const primaryPath = createSpline('amount');
  const secondaryPath = createSpline('secondaryAmount');

  // Closed area paths for gradient fill
  const primaryArea = `${primaryPath} L ${getX(data.length - 1)} ${height} L ${getX(0)} ${height} Z`;
  const secondaryArea = `${secondaryPath} L ${getX(data.length - 1)} ${height} L ${getX(0)} ${height} Z`;

  const activeX = getX(selectedIndex);
  const activeY = getY(activePoint.amount);

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-[16px] font-bold text-[#141414] tracking-tight">Spending rhythm</h3>
        <div className="relative">
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-1 text-[11.5px] font-medium text-[#7D7A73] hover:text-[#181818] transition-colors"
          >
            <span>{filterPeriod}</span>
            <svg className="w-3 h-3 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {showFilterMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-28 bg-white rounded-xl shadow-lg border border-black/5 py-1 z-30 text-xs">
              {['3 months', '6 months', '1 year'].map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setFilterPeriod(period);
                    setShowFilterMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-neutral-50 transition-colors ${filterPeriod === period ? 'font-semibold text-indigo-600' : 'text-neutral-600'}`}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full h-[126px] select-none">
        {/* Subtle Horizontal Y-Axis Labels on the Right */}
        <div className="absolute right-1 top-[14px] text-[9px] text-[#A6A39D] font-mono pointer-events-none">$800</div>
        <div className="absolute right-1 top-[46px] text-[9px] text-[#A6A39D] font-mono pointer-events-none">$400</div>
        <div className="absolute right-1 bottom-[20px] text-[9px] text-[#A6A39D] font-mono pointer-events-none">$0</div>

        <svg className="w-[88%] h-[98px] overflow-visible">
          <defs>
            {/* Primary Blue/Purple Gradient */}
            <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FAF5EF" stopOpacity="0.0" />
            </linearGradient>

            {/* Secondary Coral/Pink Gradient */}
            <linearGradient id="secondaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FB7185" stopOpacity="0.22" />
              <stop offset="70%" stopColor="#FDA4AF" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#FAF5EF" stopOpacity="0.0" />
            </linearGradient>

            {/* Stroke Line Gradients */}
            <linearGradient id="primaryStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="60%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>

            <linearGradient id="secondaryStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F472B6" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#FB7185" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Secondary Layer (Pink/Coral background wave) */}
          <path d={secondaryArea} fill="url(#secondaryAreaGrad)" />
          <path d={secondaryPath} fill="none" stroke="url(#secondaryStroke)" strokeWidth="1.8" strokeLinecap="round" />

          {/* Primary Layer (Violet/Indigo foreground wave) */}
          <path d={primaryArea} fill="url(#primaryAreaGrad)" />
          <path d={primaryPath} fill="none" stroke="url(#primaryStroke)" strokeWidth="2.2" strokeLinecap="round" />

          {/* Active Month Vertical Guide Line */}
          <line
            x1={activeX}
            y1={activeY + 4}
            x2={activeX}
            y2={height}
            stroke="#6366F1"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            opacity="0.5"
          />

          {/* Secondary Point on Active Column */}
          <circle
            cx={activeX}
            cy={getY(activePoint.secondaryAmount)}
            r="2.5"
            fill="#FB7185"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />

          {/* Active Highlight Dot on Main Wave */}
          <circle
            cx={activeX}
            cy={activeY}
            r="5.5"
            fill="#6366F1"
            fillOpacity="0.22"
          />
          <circle
            cx={activeX}
            cy={activeY}
            r="3.2"
            fill="#4F46E5"
            stroke="#FFFFFF"
            strokeWidth="1.8"
          />
        </svg>

        {/* Floating Tooltip Pill */}
        <div 
          className="absolute z-20 pointer-events-none transition-all duration-200 ease-out transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${activeX}px`,
            top: `${activeY + 4}px`,
          }}
        >
          <div className="bg-[#1F222E] text-white px-2 py-1 rounded-[10px] shadow-lg flex flex-col items-center min-w-[50px]">
            <span className="text-[10.5px] font-bold tracking-tight leading-none">${activePoint.amount}</span>
            <span className="text-[8px] text-[#A5AAB8] font-medium leading-none mt-0.5">{activePoint.year}</span>
          </div>
        </div>

        {/* X-Axis Month Selectors */}
        <div className="flex justify-between items-center w-[88%] px-2 mt-1">
          {data.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.month}
                onClick={() => setSelectedIndex(idx)}
                className={`text-[10px] font-medium transition-all relative py-0.5 px-1 ${
                  isSelected 
                    ? 'text-[#141414] font-bold' 
                    : 'text-[#A19D94] hover:text-[#525252]'
                }`}
              >
                {item.month}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
