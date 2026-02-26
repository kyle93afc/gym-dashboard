"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface DataPoint {
  date: string;
  weight: number;
  maxReps: number;
}

interface ExerciseProgressChartProps {
  data: DataPoint[];
  exerciseName: string;
  color?: string;
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
    <div className="rounded-xl border border-white/10 bg-[#0d0d16]/95 backdrop-blur p-3 shadow-xl">
      <div className="text-xs text-white/40 mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-white stat-number">{d.weight}</span>
        <span className="text-xs text-white/40">kg</span>
      </div>
      <div className="text-xs text-white/40">Best: {d.maxReps} reps</div>
    </div>
  );
}

export default function ExerciseProgressChart({
  data,
  color = "#00b4ff",
}: ExerciseProgressChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-white/30">
        No data yet
      </div>
    );
  }

  const maxWeight = Math.max(...data.map((d) => d.weight));

  return (
    <div className="h-36 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <filter id={`glow-${color.replace("#", "")}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
            tickFormatter={(v) => `${v}kg`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
          {data.length > 1 && (
            <ReferenceLine
              y={maxWeight}
              stroke={color}
              strokeDasharray="4 4"
              strokeOpacity={0.3}
            />
          )}
          <Line
            type="monotone"
            dataKey="weight"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 0, r: 3 }}
            activeDot={{ fill: color, strokeWidth: 0, r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
