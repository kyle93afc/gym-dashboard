import { WorkoutsData, WorkoutSession, Exercise } from "@/types/workout";
import workoutsData from "@/data/workouts.json";

const data = workoutsData as WorkoutsData;

export function getAllSessions(): WorkoutSession[] {
  return [...data.sessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getSessionById(id: string): WorkoutSession | undefined {
  return data.sessions.find((s) => s.id === id);
}

export function getTotalStats() {
  const sessions = data.sessions;
  const totalVolume = sessions.reduce((sum, s) => sum + s.volume_kg, 0);
  const totalSessions = sessions.length;

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const thisWeekSessions = sessions.filter((s) => {
    const d = new Date(s.date);
    return d >= weekStart;
  }).length;

  // Calculate current streak (consecutive days with sessions)
  const sortedDates = sessions
    .map((s) => s.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let streak = 0;
  if (sortedDates.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const mostRecent = new Date(sortedDates[0]);
    mostRecent.setHours(0, 0, 0, 0);

    // Streak only counts if last session was today or yesterday
    if (mostRecent >= yesterday) {
      streak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const curr = new Date(sortedDates[i]);
        curr.setHours(0, 0, 0, 0);
        const prev = new Date(sortedDates[i - 1]);
        prev.setHours(0, 0, 0, 0);
        const diffDays =
          (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  const avgDuration =
    sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.duration_seconds, 0) /
        sessions.length
      : 0;

  return {
    totalSessions,
    totalVolume,
    thisWeekSessions,
    streak,
    avgDuration,
  };
}

export function getVolumeChartData() {
  return [...data.sessions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((s) => ({
      date: formatShortDate(s.date),
      volume: s.volume_kg,
      label: s.label,
    }));
}

export function getExerciseProgressData() {
  const exerciseMap = new Map<
    string,
    { date: string; weight: number; maxReps: number }[]
  >();

  const sorted = [...data.sessions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  for (const session of sorted) {
    for (const exercise of session.exercises) {
      if (!exerciseMap.has(exercise.name)) {
        exerciseMap.set(exercise.name, []);
      }
      const maxWeight = Math.max(...exercise.sets.map((s) => s.weight_kg));
      const maxReps = Math.max(...exercise.sets.map((s) => s.reps));
      exerciseMap.get(exercise.name)!.push({
        date: formatShortDate(session.date),
        weight: maxWeight,
        maxReps,
      });
    }
  }

  return exerciseMap;
}

export function getAllExerciseNames(): string[] {
  const names = new Set<string>();
  for (const session of data.sessions) {
    for (const exercise of session.exercises) {
      names.add(exercise.name);
    }
  }
  return Array.from(names).sort();
}

export function getExerciseBests(): Map<string, { weight: number; reps: number; date: string }> {
  const bests = new Map<string, { weight: number; reps: number; date: string }>();

  for (const session of data.sessions) {
    for (const exercise of session.exercises) {
      const maxSet = exercise.sets.reduce((best, s) =>
        s.weight_kg > best.weight_kg ? s : best
      );
      const existing = bests.get(exercise.name);
      if (!existing || maxSet.weight_kg > existing.weight) {
        bests.set(exercise.name, {
          weight: maxSet.weight_kg,
          reps: maxSet.reps,
          date: session.date,
        });
      }
    }
  }

  return bests;
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    Push: "#00b4ff",
    Pull: "#39ff14",
    Legs: "#bf00ff",
    Upper: "#00e5ff",
    Lower: "#ff6b00",
    "Full Body": "#ffcc00",
    Cardio: "#ff3366",
  };
  return colors[type] ?? "#8888aa";
}

export function getTypeBg(type: string): string {
  const colors: Record<string, string> = {
    Push: "rgba(0, 180, 255, 0.15)",
    Pull: "rgba(57, 255, 20, 0.15)",
    Legs: "rgba(191, 0, 255, 0.15)",
    Upper: "rgba(0, 229, 255, 0.15)",
    Lower: "rgba(255, 107, 0, 0.15)",
    "Full Body": "rgba(255, 204, 0, 0.15)",
    Cardio: "rgba(255, 51, 102, 0.15)",
  };
  return colors[type] ?? "rgba(136, 136, 170, 0.15)";
}

export function calculateSessionVolume(session: WorkoutSession): number {
  return session.exercises.reduce((total, ex) => {
    return (
      total + ex.sets.reduce((setTotal, s) => setTotal + s.weight_kg * s.reps, 0)
    );
  }, 0);
}
