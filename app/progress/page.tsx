import { TrendingUp, Trophy, Zap } from "lucide-react";
import ExerciseProgressChart from "@/components/ExerciseProgressChart";
import {
  getExerciseProgressData,
  getExerciseBests,
  formatShortDate,
} from "@/lib/workouts";

// Assign a color per exercise for visual distinction
const EXERCISE_COLORS = [
  "#00b4ff",
  "#39ff14",
  "#bf00ff",
  "#ff6b00",
  "#00e5ff",
  "#ffcc00",
  "#ff3366",
  "#00ffcc",
];

export default function ProgressPage() {
  const progressData = getExerciseProgressData();
  const bests = getExerciseBests();
  const exerciseNames = Array.from(progressData.keys());

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-4 w-4 text-[#00b4ff]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00b4ff]">
            Progress Tracker
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Your Gains
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Weight progression per exercise over time
        </p>
      </div>

      {/* Personal bests strip */}
      {bests.size > 0 && (
        <div className="rounded-xl border border-[#ffcc00]/15 bg-[#ffcc00]/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-4 w-4 text-[#ffcc00]" />
            <span className="text-sm font-semibold text-[#ffcc00]">Personal Bests</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from(bests.entries()).map(([name, best]) => (
              <div
                key={name}
                className="rounded-lg border border-white/5 bg-[#0d0d16] p-3"
              >
                <div className="text-[10px] font-medium text-white/40 mb-1 leading-tight">
                  {name}
                </div>
                <div className="text-lg font-bold text-white stat-number">
                  {best.weight}
                  <span className="text-xs font-normal text-white/40 ml-0.5">kg</span>
                </div>
                <div className="text-xs text-white/30">{best.reps} reps</div>
                <div className="text-[10px] text-white/20 mt-0.5">
                  {formatShortDate(best.date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise grid */}
      {exerciseNames.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Zap className="h-10 w-10 text-white/20 mb-4" />
          <div className="text-white/40">No workout data yet.</div>
          <div className="text-white/20 text-sm mt-1">
            Log your first session to start tracking progress.
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {exerciseNames.map((name, idx) => {
            const data = progressData.get(name) ?? [];
            const color = EXERCISE_COLORS[idx % EXERCISE_COLORS.length];
            const maxWeight = data.length > 0 ? Math.max(...data.map((d) => d.weight)) : 0;
            const latestWeight = data.length > 0 ? data[data.length - 1].weight : 0;
            const firstWeight = data.length > 0 ? data[0].weight : 0;
            const improvement = firstWeight > 0
              ? (((latestWeight - firstWeight) / firstWeight) * 100).toFixed(1)
              : null;

            return (
              <div
                key={name}
                className="rounded-xl border border-white/6 bg-[#111118] p-5 transition-all duration-200 hover:border-white/10"
              >
                {/* Card header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-2.5">
                    <div
                      className="mt-0.5 h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ background: color, boxShadow: `0 0 8px ${color}60` }}
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-white leading-tight">
                        {name}
                      </h3>
                      <div className="mt-0.5 text-[10px] text-white/30">
                        {data.length} session{data.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-xl font-bold stat-number"
                      style={{ color }}
                    >
                      {maxWeight}
                      <span className="text-xs font-normal text-white/40 ml-0.5">kg</span>
                    </div>
                    {improvement !== null && data.length > 1 && (
                      <div
                        className={`text-[10px] font-medium ${
                          Number(improvement) > 0
                            ? "text-[#39ff14]"
                            : Number(improvement) < 0
                            ? "text-red-400"
                            : "text-white/30"
                        }`}
                      >
                        {Number(improvement) > 0 ? "+" : ""}
                        {improvement}%
                      </div>
                    )}
                  </div>
                </div>

                {/* Chart */}
                <ExerciseProgressChart
                  data={data}
                  exerciseName={name}
                  color={color}
                />

                {/* Footer: last set detail */}
                {data.length > 0 && (
                  <div className="mt-3 flex items-center justify-between text-[10px] text-white/25 border-t border-white/4 pt-3">
                    <span>Latest: {latestWeight} kg × {data[data.length - 1].maxReps} reps</span>
                    <span>{data[data.length - 1].date}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
