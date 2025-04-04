// src/data/dummyWorkouts.ts

// --- Dummy Template Data ---
// Moved here to satisfy react-refresh/only-export-components rule
export const workoutTemplates = {
    barbell: [
      { id: "b1", name: "Day 1", exercises: ["Bench Press", "Squat", "Deadlift"] },
      { id: "b2", name: "Day 2", exercises: ["Incline Bench Press", "Front Squat", "Romanian Deadlift"] },
      { id: "b3", name: "Day 3", exercises: ["Bench Press", "Squat", "Deadlift"] },
      { id: "b4", name: "Day 4", exercises: ["Incline Bench Press", "Front Squat", "Romanian Deadlift"] },
    ],
    bodyweight: [
      { id: "bwA", name: "Day A", exercises: ["Pull Up", "Decline Push Up", "Bodyweight Row"] },
      { id: "bwB", name: "Day B", exercises: ["Chin Up", "Tricep Dip", "Underhand Bodyweight Row"] },
      { id: "bwC", name: "Day C", exercises: ["Placeholder..."] },
      { id: "bwD", name: "Day D", exercises: ["Placeholder..."] },
    ],
  };
  // --- End Dummy Data ---
  
  // Define a type for better structure if needed later, e.g.:
  // export type WorkoutCategory = 'barbell' | 'bodyweight';
  // export interface SimpleWorkoutTemplate {
  //     id: string;
  //     name: string;
  //     exercises: string[];
  // }
  // export type WorkoutTemplatesData = {
  //     [key in WorkoutCategory]: SimpleWorkoutTemplate[];
  // };
  // export const workoutTemplates: WorkoutTemplatesData = { ... };