"use client";
import React from "react";

// --- 折線圖 ---
export function LineChart({
  data,
  colors,
  cls,
}: {
  data: any[];
  colors: any;
  cls: any;
}) {
  if (data.length === 0)
    return <div className={`text-center py-8 ${cls.text.sub}`}>無資料</div>;

  const maxRevenue = Math.max(...data.map((d) => d.營收), 1000);
  const height = 200;
  const width = 100;
  const padding = 30;
  const chartWidth = width * data.length + (data.length - 1) * 10;

  const pathData = data.reduce((path, point, idx) => {
    const x = padding + idx * (width + 10);
    const y = height + padding - (point.營收 / maxRevenue) * height;
    return path + `${idx === 0 ? "M" : "L"} ${x} ${y} `;
  }, "");

  return (
    <svg
      viewBox={`0 0 ${chartWidth + padding * 2} ${height + padding * 2}`}
      className="w-full h-48"
    >
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((line) => (
        <line
          key={line}
          x1={padding}
          y1={padding + line * height}
          x2={chartWidth + padding}
          y2={padding + line * height}
          stroke="rgba(100, 116, 139, 0.2)"
          strokeDasharray="4"
        />
      ))}
      <path d={pathData} stroke={colors.primary} strokeWidth="2" fill="none" />
      {data.map((point, idx) => {
        const x = padding + idx * (width + 10);
        const y = height + padding - (point.營收 / maxRevenue) * height;
        return (
          <circle
            key={idx}
            cx={x}
            cy={y}
            r="4"
            fill={colors.primary}
            opacity="0.8"
          />
        );
      })}
      {data.map((point, idx) => (
        <text
          key={`label-${idx}`}
          x={padding + idx * (width + 10)}
          y={height + padding + 20}
          textAnchor="middle"
          fontSize="12"
          fill={colors.textSub}
        >
          {point.date}
        </text>
      ))}
    </svg>
  );
}

// --- 柱狀圖 ---
export function BarChart({
  data,
  maxValue,
  colors,
  cls,
}: {
  data: any[];
  maxValue: number;
  colors: any;
  cls: any;
}) {
  if (data.length === 0)
    return <div className={`text-center py-8 ${cls.text.sub}`}>無資料</div>;

  const barWidth = 100 / (data.length * 1.5);
  const spacing = barWidth * 0.5;

  return (
    <svg viewBox="0 0 600 220" className="w-full h-40">
      {[0, 0.25, 0.5, 0.75, 1].map((line) => (
        <line
          key={line}
          x1="40"
          y1={20 + line * 160}
          x2="580"
          y2="20 + line * 160"
          stroke="rgba(100, 116, 139, 0.2)"
          strokeDasharray="3"
        />
      ))}
      {data.map((item, idx) => {
        const barHeight = (item.orders / maxValue) * 160;
        const x = 40 + idx * (barWidth + spacing) * 6;
        const y = 180 - barHeight;

        return (
          <g key={idx}>
            <rect
              x={x}
              y={y}
              width={barWidth * 5}
              height={barHeight}
              fill={colors.success}
              opacity="0.8"
              rx="2"
            />
            <text
              x={x + barWidth * 2.5}
              y="205"
              textAnchor="middle"
              fontSize="11"
              fill={colors.textSub}
            >
              {item.hour}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// --- 圓餅圖 ---
export function PieChart({
  data,
  cls,
}: {
  data: { label: string; value: number; color: string }[];
  cls: any;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0)
    return <div className={`text-center py-8 ${cls.text.sub}`}>無資料</div>;

  const size = 160;
  const radius = 60;
  const cx = size / 2;
  const cy = size / 2;

  let currentAngle = -90; // 從 12 點鐘方向開始繪製
  const slices = data.map((item) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    currentAngle = endAngle;
    return {
      pathData,
      item,
      percentage: ((item.value / total) * 100).toFixed(0),
    };
  });

  return (
    <div className="flex gap-6 items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-32 h-32 flex-shrink-0">
        {slices.map((slice, idx) => (
          <path
            key={idx}
            d={slice.pathData}
            fill={slice.item.color}
            opacity="0.85"
            stroke="rgba(10, 10, 10, 0.1)"
            strokeWidth="1"
          />
        ))}
      </svg>
      <div className="space-y-2 flex-1">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className={`text-sm ${cls.text.strong}`}>{item.label}</span>
            </div>
            <span className={`text-xs font-bold ${cls.text.title}`}>
              {slices[idx].percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
