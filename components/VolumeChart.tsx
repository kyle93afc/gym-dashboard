"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  volume: number;
  label: string;
}

interface VolumeChartProps {
  data: DataPoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; payload: DataPoint }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-[#00b4ff]/20 bg-[#0d0d16]/95 backdrop-blur p-3 shadow-xl">
      <div className="text-xs text-white/50 mb-1">{label}</div>
      <div className="text-sm font-semibold text-white">{d.label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-bold text-[#00b4ff] stat-number">
          {payload[0].value.toLocaleString()}
        </span>
        <span className="text-xs text-white/40">kg total volume</span>
      </div>
    </div>
  );
}

export default function VolumeChart({ data }: VolumeChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00b4ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00b4ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 12 }}
            axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(0,180,255,0.2)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#00b4ff"
            strokeWidth={2}
            fill="url(#volumeGrad)"
            dot={{ fill: "#00b4ff", strokeWidth: 0, r: 4 }}
            activeDot={{ fill: "#00b4ff", strokeWidth: 0, r: 6, style: { filter: "drop-shadow(0 0 6px #00b4ff)" } }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
