import Link from "next/link";
import { WorkoutSession } from "@/types/workout";
import { formatShortDate, formatDuration, getTypeColor, getTypeBg } from "@/lib/workouts";
import { ChevronRight, Clock, Weight } from "lucide-react";

interface RecentSessionsProps {
  sessions: WorkoutSession[];
}

export default function RecentSessions({ sessions }: RecentSessionsProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-3">💪</div>
        <div className="text-white/40 text-sm">No sessions yet. Time to hit the gym!</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => {
        const typeColor = getTypeColor(session.type);
        const typeBg = getTypeBg(session.type);

        return (
          <Link
            key={session.id}
            href={`/session/${session.id}`}
            className="group flex items-center gap-4 rounded-xl border border-white/5 bg-[#0d0d16] p-4 transition-all duration-200 hover:border-[#00b4ff]/20 hover:bg-[#111118]"
          >
            {/* Type indicator */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold uppercase tracking-wider"
              style={{ background: typeBg, color: typeColor }}
            >
              {session.type.slice(0, 2)}
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white text-sm">{session.label}</span>
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{ color: typeColor, background: typeBg }}
                >
                  {session.type}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-white/40">
                <span>{formatShortDate(session.date)}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(session.duration_seconds)}
                </span>
                <span className="flex items-center gap-1">
                  <Weight className="h-3 w-3" />
                  {session.volume_kg.toLocaleString()} kg
                </span>
              </div>
            </div>

            {/* Exercise count */}
            <div className="text-right shrink-0">
              <div className="text-xs text-white/30">
                {session.exercises.length} exercises
              </div>
              <div className="text-xs text-white/20">
                {session.exercises.reduce((t, e) => t + e.sets.length, 0)} sets
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-[#00b4ff]/60 transition-colors shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}
