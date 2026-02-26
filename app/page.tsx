import { Dumbbell, Flame, Calendar, BarChart3, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import RecentSessions from "@/components/RecentSessions";
import VolumeChart from "@/components/VolumeChart";
import {
  getAllSessions,
  getTotalStats,
  getVolumeChartData,
  formatDuration,
} from "@/lib/workouts";

export default function DashboardPage() {
  const sessions = getAllSessions();
  const stats = getTotalStats();
  const volumeData = getVolumeChartData();

  const totalVolumeTons = (stats.totalVolume / 1000).toFixed(1);

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
