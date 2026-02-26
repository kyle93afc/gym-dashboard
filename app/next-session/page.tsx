import { Target, TrendingUp, ArrowUp, Minus, Calendar, Zap } from "lucide-react";
import {
  getNextSessionTargets,
  getNextRecommendedSession,
  getTypeColor,
  formatShortDate,
  SessionTargets,
  ExerciseTarget,
} from "@/lib/workouts";

function StatusBadge({ status }: { status: ExerciseTarget["status"] }) {
  if (status === "progression") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#39ff14]/10 px-2 py-0.5 text-[10px] font-semibold text-[#39ff14]">
        <ArrowUp className="h-2.5 w-2.5" />
        Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#ffcc00]/10 px-2 py-0.5 text-[10px] font-semibold text-[#ffcc00]">
      <Minus className="h-2.5 w-2.5" />
      Same
    </span>
  );
}

function SessionCard({
  targets,
  isRecommended,
}: {
  targets: SessionTargets;
  isRecommended: boolean;
}) {
  const color = getTypeColor(targets.type);
  const colorMap: Record<string, string> = {
    Push: "rgba(0,180,255,0.12)",
    Pull: "rgba(57,255,20,0.12)",
    Legs: "rgba(191,0,255,0.12)",
  };
  const borderMap: Record<string, string> = {
    Push: "rgba(0,180,255,0.35)",
    Pull: "rgba(57,255,20,0.35)",
    Legs: "rgba(191,0,255,0.35)",
  };
  const glowMap: Record<string, string> = {
    Push: "0 0 32px rgba(0,180,255,0.12)",
    Pull: "0 0 32px rgba(57,255,20,0.12)",
    Legs: "0 0 32px rgba(191,0,255,0.12)",
  };

  return (
    <div
      className="relative rounded-xl border bg-[#111118] p-6 flex flex-col gap-5 transition-all duration-200"
      style={{
        borderColor: isRecommended
          ? borderMap[targets.type] ?? "rgba(255,255,255,0.06)"
          : "rgba(255,255,255,0.06)",
        boxShadow: isRecommended
          ? glowMap[targets.type] ?? "none"
          : "none",
      }}
    >
      {/* Card header */}
      <div className="flex items-start justify-between">
        <div>
          {isRecommended && (
            <div
              className="mb-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: colorMap[targets.type], color }}
            >
              <Zap className="h-2.5 w-2.5" />
              Up next
            </div>
          )}
          <h2 className="text-xl font-bold text-white">{targets.type}</h2>
          {targets.lastSessionDate ? (
            <div className="mt-1 flex items-center gap-1.5 text-xs text-white/40">
              <Calendar className="h-3 w-3" />
              Last trained: {formatShortDate(targets.lastSessionDate)}
            </div>
          ) : (
            <div className="mt-1 text-xs text-white/30">No sessions logged yet</div>
          )}
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: colorMap[targets.type] ?? "rgba(255,255,255,0.05)" }}
        >
          <Target className="h-5 w-5" style={{ color }} />
        </div>
      </div>

      {/* Exercise table */}
      {targets.exercises.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <div className="text-sm text-white/30">No data yet</div>
          <div className="mt-1 text-xs text-white/20">
            Log a {targets.type} session to generate targets
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Exercise
                </th>
                <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Target
                </th>
                <th className="pb-2 text-right text-[10px] font-semibold uppercase tracking-wider text-white/30">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {targets.exercises.map((ex) => (
                <tr key={ex.name} className="group">
                  <td className="py-3 pr-4">
                    <div className="text-sm font-medium text-white/90 leading-tight">
                      {ex.name}
                    </div>
                    <div className="mt-0.5 text-[10px] text-white/30">
                      was {ex.lastWeight}kg × {ex.lastRepsPerSet.join("/")} reps
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="text-sm font-bold text-white stat-number">
                      {ex.targetWeight}
                      <span className="text-xs font-normal text-white/40">kg</span>
                    </div>
                    <div className="text-[10px] text-white/40">
                      {ex.targetSets}×{ex.targetReps} reps
                    </div>
                  </td>
                  <td className="py-3 pl-4 text-right">
                    <StatusBadge status={ex.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary footer */}
      {targets.exercises.length > 0 && (
        <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs text-white/30">
          <span>
            {targets.exercises.filter((e) => e.status === "progression").length} progressing
            &nbsp;·&nbsp;
            {targets.exercises.filter((e) => e.status === "maintain").length} maintaining
          </span>
          <span style={{ color }}>
            {targets.exercises.length} exercise{targets.exercises.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

export default function NextSessionPage() {
  const allTargets = getNextSessionTargets();
  const nextUp = getNextRecommendedSession();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-4 w-4 text-[#00b4ff]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00b4ff]">
            Progressive Overload
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Next Session Targets
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Auto-calculated based on your last logged performance per session type.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-white/40">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-[#39ff14]" />
          Progress — all sets hit reps, weight increases +2.5kg
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-[#ffcc00]" />
          Same weight — hit full reps on all sets first
        </span>
      </div>

      {/* Session cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {allTargets.map((targets) => (
          <SessionCard
            key={targets.type}
            targets={targets}
            isRecommended={targets.type === nextUp}
          />
        ))}
      </div>
    </div>
  );
}
