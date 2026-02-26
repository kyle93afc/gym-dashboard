import { Dumbbell, Flame, Calendar, BarChart3, Clock, Target, ArrowRight, ArrowUp, Minus } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import RecentSessions from "@/components/RecentSessions";
import VolumeChart from "@/components/VolumeChart";
import {
  getAllSessions,
  getTotalStats,
  getVolumeChartData,
  formatDuration,
  getNextRecommendedSession,
  getNextSessionTargets,
  getTypeColor,
  ExerciseTarget,
} from "@/lib/workouts";

export default function DashboardPage() {
  const sessions = getAllSessions();
  const stats = getTotalStats();
  const volumeData = getVolumeChartData();
  const nextUp = getNextRecommendedSession();
  const allTargets = getNextSessionTargets();
  const nextTargets = allTargets.find((t) => t.type === nextUp);

  const totalVolumeTons = (stats.totalVolume / 1000).toFixed(1);
  const nextColor = getTypeColor(nextUp);
  const colorBgMap: Record<string, string> = {
    Push: "rgba(0,180,255,0.08)",
    Pull: "rgba(57,255,20,0.08)",
    Legs: "rgba(191,0,255,0.08)",
  };
  const colorBorderMap: Record<string, string> = {
    Push: "rgba(0,180,255,0.25)",
    Pull: "rgba(57,255,20,0.25)",
    Legs: "rgba(191,0,255,0.25)",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00b4ff]">
            Welcome back
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Kyle&apos;s Dashboard
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Track your gains. Own your progress.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Sessions"
          value={stats.totalSessions}
          icon={Dumbbell}
          accent="blue"
          sub="All time"
        />
        <StatCard
          label="Total Volume"
          value={`${totalVolumeTons}t`}
          icon={BarChart3}
          accent="green"
          sub={`${stats.totalVolume.toLocaleString()} kg lifted`}
        />
        <StatCard
          label="This Week"
          value={stats.thisWeekSessions}
          icon={Calendar}
          accent="purple"
          sub="sessions this week"
        />
        <StatCard
          label="Streak"
          value={stats.streak === 0 ? "—" : `${stats.streak}d`}
          icon={Flame}
          accent="orange"
          sub={stats.streak > 0 ? "consecutive days" : "Hit the gym!"}
        />
      </div>

      {/* Avg duration inline */}
      {stats.avgDuration > 0 && (
        <div className="flex items-center gap-2 -mt-4">
          <Clock className="h-3.5 w-3.5 text-white/30" />
          <span className="text-xs text-white/30">
            Avg session: {formatDuration(Math.round(stats.avgDuration))}
          </span>
        </div>
      )}

      {/* Next Session summary card */}
      <div
        className="rounded-xl border p-5 transition-all duration-200"
        style={{
          background: colorBgMap[nextUp] ?? "rgba(255,255,255,0.03)",
          borderColor: colorBorderMap[nextUp] ?? "rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Left: title + exercises */}
          <div className="flex items-start gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
              style={{ background: colorBgMap[nextUp] ?? "rgba(255,255,255,0.05)" }}
            >
              <Target className="h-5 w-5" style={{ color: nextColor }} />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: nextColor }}>
                Next Session
              </div>
              <div className="mt-0.5 text-lg font-bold text-white">
                {nextUp} Day
              </div>
              {nextTargets && nextTargets.exercises.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-3">
                  {nextTargets.exercises.slice(0, 4).map((ex: ExerciseTarget) => (
                    <div key={ex.name} className="flex items-center gap-1.5 text-xs text-white/50">
                      {ex.status === "progression" ? (
                        <ArrowUp className="h-3 w-3 text-[#39ff14]" />
                      ) : (
                        <Minus className="h-3 w-3 text-[#ffcc00]" />
                      )}
                      <span className="text-white/70">{ex.name}:</span>
                      <span className="font-semibold text-white">
                        {ex.targetWeight}kg
                      </span>
                      <span className="text-white/30">
                        {ex.targetSets}×{ex.targetReps}
                      </span>
                    </div>
                  ))}
                  {nextTargets.exercises.length > 4 && (
                    <span className="text-xs text-white/30">
                      +{nextTargets.exercises.length - 4} more
                    </span>
                  )}
                </div>
              ) : (
                <div className="mt-1.5 text-xs text-white/30">
                  No previous {nextUp} session — log one to get targets
                </div>
              )}
            </div>
          </div>

          {/* Right: CTA */}
          <Link
            href="/next-session"
            className="flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:opacity-90"
            style={{ background: nextColor, color: "#0a0a0f" }}
          >
            View Plan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Volume chart + Recent sessions */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Volume chart */}
        <div className="lg:col-span-3 rounded-xl border border-white/6 bg-[#111118] p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Volume Over Time</h2>
              <p className="mt-0.5 text-xs text-white/40">Total kg lifted per session</p>
            </div>
            {volumeData.length > 0 && (
              <div className="text-right">
                <div className="text-xl font-bold text-[#00b4ff] stat-number">
                  {volumeData[volumeData.length - 1]?.volume.toLocaleString()}
                </div>
                <div className="text-[10px] text-white/30">last session (kg)</div>
              </div>
            )}
          </div>
          {volumeData.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-white/30">
              No data yet
            </div>
          ) : (
            <VolumeChart data={volumeData} />
          )}
        </div>

        {/* Recent sessions */}
        <div className="lg:col-span-2 rounded-xl border border-white/6 bg-[#111118] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Sessions</h2>
              <p className="mt-0.5 text-xs text-white/40">
                {sessions.length} session{sessions.length !== 1 ? "s" : ""} logged
              </p>
            </div>
          </div>
          <RecentSessions sessions={sessions.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}
