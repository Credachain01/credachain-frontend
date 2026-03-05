'use client';

interface BarData {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface BarChartProps {
  data: BarData[];
  color?: string;
  secondaryColor?: string;
  showSecondary?: boolean;
}

export default function BarChart({
  data,
  color = '#4169E1',
  secondaryColor = '#E2E8F0',
  showSecondary = true,
}: BarChartProps) {
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.secondaryValue ?? 0)));
  const chartHeight = 100;
  const barWidth = 10;
  const gap = 6;
  const groupWidth = showSecondary ? barWidth * 2 + gap : barWidth;
  const groupGap = 14;

  const totalWidth = data.length * (groupWidth + groupGap) - groupGap;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${chartHeight}`}
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {data.map((d, i) => {
        const x = i * (groupWidth + groupGap);
        const primaryH = (d.value / maxValue) * chartHeight;
        const secondaryH = ((d.secondaryValue ?? 0) / maxValue) * chartHeight;

        return (
          <g key={i}>
            {showSecondary && (
              <rect
                x={x}
                y={chartHeight - secondaryH}
                width={barWidth}
                height={secondaryH}
                fill={secondaryColor}
                rx={3}
              />
            )}
            <rect
              x={showSecondary ? x + barWidth + gap : x}
              y={chartHeight - primaryH}
              width={barWidth}
              height={primaryH}
              fill={color}
              rx={3}
            />
          </g>
        );
      })}
    </svg>
  );
}
