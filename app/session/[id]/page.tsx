import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Weight, Dumbbell, Target } from "lucide-react";
import {
  getSessionById,
  getAllSessions,
  formatFullDate,
  formatDuration,
  getTypeColor,
  getTypeBg,
} from "@/lib/workouts";

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const sessions = getAllSessions();
  return sessions.map((s) => ({ id: s.id }));
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const session = getSessionById(id);

  if (!session) {
    notFound();
  }

  const typeColor = getTypeColor(session.type);
  const typeBg = getTypeBg(session.type);

  const totalSets = session.exercises.reduce((t, e) => t + e.sets.length, 0);
  const totalReps = session.exercises.reduce(
    (t, e) => t + e.sets.reduce((st, s) => st + s.reps, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Session header */}
      <div className="rounded-xl border border-white/6 bg-[#111118] p-6 animated-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold uppercase"
              style={{ background: typeBg, color: typeColor }}
            >
              {session.type.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{session.label}</h1>
                <span
                  className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-md"
                  style={{ color: typeColor, background: typeBg }}
                >
                  {session.type}
                </span>
              </div>
              <div className="mt-1 text-sm text-white/40">
                {formatFullDate(session.date)}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                icon: Weight,
                label: "Volume",
                value: `${session.volume_kg.toLocaleString()} kg`,
                color: "#00b4ff",
              },
              {
                icon: Clock,
                label: "Duration",
                value: formatDuration(session.duration_seconds),
                color: "#39ff14",
              },
              {
                icon: Dumbbell,
                label: "Exercises",
                value: session.exercises.length.toString(),
                color: "#bf00ff",
              },
              {
                icon: Target,
                label: "Total Sets",
                value: totalSets.toString(),
                color: "#ff6b00",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="rounded-lg border border-white/5 bg-[#0d0d16] p-3 text-center"
              >
                <Icon className="h-4 w-4 mx-auto mb-1" style={{ color }} />
                <div className="text-base font-bold text-white stat-number">{value}</div>
                <div className="text-[10px] text-white/40 uppercase tracking-wider">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Total reps */}
      <div className="flex items-center gap-3 px-1">
        <div className="text-xs text-white/30">
          {totalReps} total reps across {totalSets} sets
        </div>
      </div>

      {/* Exercise cards */}
      <div className="space-y-4">
        {session.exercises.map((exercise, exIdx) => {
          const maxWeight = Math.max(...exercise.sets.map((s) => s.weight_kg));
          const totalExVolume = exercise.sets.reduce(
            (t, s) => t + s.weight_kg * s.reps,
            0
          );

          return (
            <div
              key={exIdx}
              className="rounded-xl border border-white/6 bg-[#111118] overflow-hidden"
            >
              {/* Exercise header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#00b4ff]/10 text-xs font-bold text-[#00b4ff]">
                    {exIdx + 1}
                  </div>
                  <h3 className="font-semibold text-white">{exercise.name}</h3>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/40">
                  <span>
                    Best:{" "}
                    <span className="text-white font-medium">{maxWeight} kg</span>
                  </span>
                  <span>
                    Vol:{" "}
                    <span className="text-white font-medium">
                      {totalExVolume.toLocaleString()} kg
                    </span>
                  </span>
                </div>
              </div>

              {/* Sets table */}
              <div className="px-5 py-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-white/30 w-16">
                        Set
                      </th>
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-white/30">
                        Weight
                      </th>
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-white/30">
                        Reps
                      </th>
                      <th className="pb-3 text-xs font-medium uppercase tracking-wider text-white/30 text-right">
                        Volume
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/4">
                    {exercise.sets.map((set, sIdx) => {
                      const isHeaviest = set.weight_kg === maxWeight;
                      const setVol = set.weight_kg * set.reps;

                      return (
                        <tr
                          key={sIdx}
                          className={
                            isHeaviest && exercise.sets.length > 1
                              ? "bg-[#00b4ff]/4"
                              : ""
                          }
                        >
                          <td className="py-2.5 text-sm text-white/40">
                            <span className="flex h-5 w-5 items-center justify-center rounded text-xs font-medium bg-white/5">
                              {set.set}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <span
                              className={`text-sm font-semibold stat-number ${
                                isHeaviest && exercise.sets.length > 1
                                  ? "text-[#00b4ff]"
                                  : "text-white"
                              }`}
                            >
                              {set.weight_kg} kg
                            </span>
                            {isHeaviest && exercise.sets.length > 1 && (
                              <span className="ml-1.5 text-[10px] text-[#00b4ff]/60 uppercase">
                                top
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 text-sm text-white stat-number">
                            {set.reps}
                          </td>
                          <td className="py-2.5 text-sm text-white/40 text-right stat-number">
                            {setVol} kg
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/8">
                      <td
                        colSpan={3}
                        className="pt-3 text-xs text-white/30 uppercase tracking-wider"
                      >
                        Exercise total
                      </td>
                      <td className="pt-3 text-sm font-semibold text-white text-right stat-number">
                        {totalExVolume.toLocaleString()} kg
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
