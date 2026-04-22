'use client';

interface DonutSlice {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  slices: DonutSlice[];
  total: string;
  totalLabel: string;
  size?: number;
  strokeWidth?: number;
}

export default function DonutChart({
  slices,
  total,
  totalLabel,
  size = 160,
  strokeWidth = 28,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const sum = slices.reduce((acc, s) => acc + s.value, 0);
  const baseOffset = circumference * 0.25;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E8ECF0"
          strokeWidth={strokeWidth}
        />
        {slices.map((slice, i) => {
          const fraction = slice.value / sum;
          const dash = fraction * circumference;
          const gap = circumference - dash;
          const previousValue = slices
            .slice(0, i)
            .reduce((acc, current) => acc + current.value, 0);
          const previousDash = (previousValue / sum) * circumference;

          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-(baseOffset + previousDash) + circumference}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      {/* Centre label */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-slate-800">{total}</span>
        <span className="text-[10px] text-slate-500 font-medium">{totalLabel}</span>
      </div>
    </div>
  );
}
