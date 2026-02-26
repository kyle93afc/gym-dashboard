export interface WorkoutSet {
  set: number;
  weight_kg: number;
  reps: number;
}

export interface Exercise {
  name: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  id: string;
  date: string;
  type: "Push" | "Pull" | "Legs" | "Upper" | "Lower" | "Full Body" | "Cardio" | string;
  label: string;
  duration_seconds: number;
  volume_kg: number;
  exercises: Exercise[];
}

export interface WorkoutsData {
  sessions: WorkoutSession[];
}

export type WorkoutType = WorkoutSession["type"];
