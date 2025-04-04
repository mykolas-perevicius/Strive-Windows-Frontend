// src/data/dummyStats.ts

// Example: Weight lifted for a specific exercise over time
export const weightProgressData = [
    { date: '2024-03-01', weight: 80 },
    { date: '2024-03-08', weight: 82.5 },
    { date: '2024-03-15', weight: 82.5 },
    { date: '2024-03-22', weight: 85 },
    { date: '2024-03-29', weight: 85 },
    { date: '2024-04-05', weight: 87.5 }, // Assuming today or recent
    // Add more data points
  ];
  
  // Example: Workout frequency per week
  export const workoutFrequencyData = [
    { week: 'W11', workouts: 3 }, // Week 11
    { week: 'W12', workouts: 4 },
    { week: 'W13', workouts: 2 },
    { week: 'W14', workouts: 4 },
    { week: 'W15', workouts: 3 },
     // Add more data points
  ];
  
  // Example: Volume per workout session (Sets * Reps * Weight)
  export const workoutVolumeData = [
      { date: '2024-03-01', volume: 10500 },
      { date: '2024-03-04', volume: 11200 },
      { date: '2024-03-08', volume: 11800 },
      { date: '2024-03-11', volume: 10900 },
      { date: '2024-03-15', volume: 12100 },
      { date: '2024-03-18', volume: 12500 },
      { date: '2024-03-22', volume: 12800 },
      { date: '2024-03-25', volume: 11500 },
      { date: '2024-03-29', volume: 13100 },
      { date: '2024-04-01', volume: 13500 },
      { date: '2024-04-05', volume: 13800 }, // Assuming today or recent
  ]
  
  // Helper type if needed
  export type DataPoint = {
      date?: string;
      week?: string;
      value?: number;
      weight?: number;
      workouts?: number;
      volume?: number;
      // Add other potential keys
  }