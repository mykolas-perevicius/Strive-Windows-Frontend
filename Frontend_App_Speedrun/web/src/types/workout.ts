// src/types/workout.ts

export interface ExerciseDetail {
    id: string; // Unique identifier for this specific exercise instance in the list
    name: string;
    weight: number; // Assuming kg or lbs, consistency needed later
    reps: number;
    sets: number;
    restTimeSeconds: number; // Rest time after completing all sets of this exercise
  }
  
  export interface WorkoutTemplate {
    id: string; // Unique identifier for the saved template
    name: string;
    exercises: ExerciseDetail[];
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }

  export interface LoggedSet {
    setIndex: number; // 0-based index of the set within the exercise
    reps: number | null; // Logged reps (null if not logged yet)
    weight: number | null; // Logged weight (null if not logged yet)
    completedAt: string | null; // ISO timestamp when completed
  }
  
  // Represents an exercise being performed during an active session
  export interface ActiveExercise extends ExerciseDetail {
    loggedSets: LoggedSet[];
    // Maybe add notes field later
  }
  
  // Represents the overall state of the workout session
  export interface ActiveWorkoutSession {
    sessionId: string;
    templateId: string | null;
    workoutName: string;
    exercises: ActiveExercise[];
    currentExerciseIndex: number;
    currentSetIndex: number;
    startTime: string;
    endTime: string | null;
    status: 'not-started' | 'in-progress' | 'paused' | 'completed' | 'cancelled';
    // --- Rest Timer State ---
    isResting: boolean;
    restDurationSeconds: number; // Total planned rest time for the current period
    restEndTime: string | null; // Timestamp when the current rest period ends
  }
  
  // Type for the form state when adding a new exercise
  export type NewExerciseFormData = Omit<ExerciseDetail, 'id'>;