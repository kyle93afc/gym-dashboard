import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: "blue" | "green" | "purple" | "orange";
  trend?: { value: number; label: string };
}

const accentMap = {
  blue: {
    icon: "text-[#00b4ff]",
    iconBg: "bg-[#00b4ff]/10 border-[#00b4ff]/20",
    glow: "hover:border-[#00b4ff]/30 hover:shadow-[0_4px_24px_rgba(0,180,255,0.1)]",
    value: "text-white",
  },
  green: {
    icon: "text-[#39ff14]",
    iconBg: "bg-[#39ff14]/10 border-[#39ff14]/20",
    glow: "hover:border-[#39ff14]/30 hover:shadow-[0_4px_24px_rgba(57,255,20,0.1)]",
    value: "text-white",
  },
  purple: {
    icon: "text-[#bf00ff]",
    iconBg: "bg-[#bf00ff]/10 border-[#bf00ff]/20",
    glow: "hover:border-[#bf00ff]/30 hover:shadow-[0_4px_24px_rgba(191,0,255,0.1)]",
    value: "text-white",
  },
  orange: {
    icon: "text-[#ff6b00]",
    iconBg: "bg-[#ff6b00]/10 border-[#ff6b00]/20",
    glow: "hover:border-[#ff6b00]/30 hover:shadow-[0_4px_24px_rgba(255,107,0,0.1)]",
    value: "text-white",
  },
};

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "blue",
  trend,
}: StatCardProps) {
  const colors = accentMap[accent];

  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/6 bg-[#111118] p-5 transition-all duration-200 cursor-default",
        colors.glow
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg border",
            colors.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", colors.icon)} />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend.value > 0
                ? "text-[#39ff14] bg-[#39ff14]/10"
                : trend.value < 0
                ? "text-red-400 bg-red-400/10"
                : "text-white/40 bg-white/5"
            )}
          >
            {trend.value > 0 ? "+" : ""}
            {trend.value} {trend.label}
          </span>
        )}
      </div>

      {/* Value */}
      <div className={cn("text-3xl font-bold tracking-tight stat-number", colors.value)}>
        {value}
      </div>

      {/* Label */}
      <div className="mt-1 text-sm font-medium text-white/50">{label}</div>

      {/* Sub */}
      {sub && <div className="mt-1 text-xs text-white/30">{sub}</div>}
    </div>
  );
}
