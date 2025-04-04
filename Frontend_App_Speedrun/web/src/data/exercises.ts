// src/data/exercises.ts

export interface ExerciseOption {
    value: string; // Unique identifier (e.g., lowercase, hyphenated)
    label: string; // Display name
  }
  
  // Example list - expand this significantly for a real app!
  export const commonExercises: ExerciseOption[] = [
    { value: "bench-press", label: "Bench Press" },
    { value: "barbell-squat", label: "Barbell Squat" },
    { value: "deadlift", label: "Deadlift" },
    { value: "overhead-press", label: "Overhead Press" },
    { value: "barbell-row", label: "Barbell Row" },
    { value: "pull-up", label: "Pull Up" },
    { value: "chin-up", label: "Chin Up" },
    { value: "lat-pulldown", label: "Lat Pulldown" },
    { value: "dumbbell-bench-press", label: "Dumbbell Bench Press" },
    { value: "dumbbell-row", label: "Dumbbell Row" },
    { value: "bicep-curl", label: "Bicep Curl" },
    { value: "triceps-pushdown", label: "Triceps Pushdown" },
    { value: "leg-press", label: "Leg Press" },
    { value: "leg-curl", label: "Leg Curl" },
    { value: "leg-extension", label: "Leg Extension" },
    { value: "calf-raise", label: "Calf Raise" },
    // --- Add many more exercises here ---
  ];