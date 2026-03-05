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
  let offset = circumference * 0.25; // start from top (12 o'clock)

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
          const el = (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset + circumference}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return el;
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
