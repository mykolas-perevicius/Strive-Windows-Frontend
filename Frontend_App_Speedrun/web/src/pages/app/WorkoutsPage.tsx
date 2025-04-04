import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { CheckCircle2 } from "lucide-react"; // Icon for completed sets
  
  // --- Dummy Workout History Data ---
  type WorkoutSet = {
    id: string;
    setNumber: number;
    weight: string; // e.g., "100 kg", "BW"
    reps: string;   // e.g., "10", "8-12"
    time?: string;  // Optional, e.g., "0:45"
    completed: boolean;
  };
  
  type LoggedExercise = {
    id: string;
    name: string;
    sets: WorkoutSet[];
  };
  
  type WorkoutDayLog = {
    date: string; // e.g., "Jan 16 2024"
    exercises: LoggedExercise[];
  };
  
  // Replace with actual data fetching later
  const workoutHistory: WorkoutDayLog[] = [
    {
      date: "Jan 16 2024",
      exercises: [
        {
          id: "e1", name: "Bench Press", sets: [
            { id: "s1", setNumber: 1, weight: "100 kg", reps: "12", time: "0:59", completed: true },
            { id: "s2", setNumber: 2, weight: "100 kg", reps: "10", time: "1:15", completed: true },
            { id: "s3", setNumber: 3, weight: "100 kg", reps: "8", time: "1:30", completed: true },
          ]
        },
        {
          id: "e2", name: "Squat", sets: [
             { id: "s4", setNumber: 1, weight: "140 kg", reps: "8", completed: true },
             { id: "s5", setNumber: 2, weight: "140 kg", reps: "8", completed: true },
             { id: "s6", setNumber: 3, weight: "140 kg", reps: "6", completed: false }, // Example incomplete
          ]
        },
      ]
    },
    {
      date: "Jan 15 2024",
       exercises: [
        {
          id: "e3", name: "Pull Up", sets: [
            { id: "s7", setNumber: 1, weight: "BW", reps: "10", completed: true },
            { id: "s8", setNumber: 2, weight: "BW", reps: "8", completed: true },
            { id: "s9", setNumber: 3, weight: "BW", reps: "7", completed: true },
          ]
        },
         {
          id: "e4", name: "Overhead Press", sets: [
            { id: "s10", setNumber: 1, weight: "60 kg", reps: "10", time: "0:45", completed: true },
            { id: "s11", setNumber: 2, weight: "60 kg", reps: "9", time: "1:00", completed: true },
          ]
        },
      ]
    },
     {
      date: "Jan 14 2024",
       exercises: [
        {
          id: "e5", name: "Deadlift", sets: [
            { id: "s12", setNumber: 1, weight: "180 kg", reps: "5", completed: true },
          ]
        },
      ]
    },
    // Add more days...
  ];
  // --- End Dummy Data ---
  
  
  export function WorkoutsPage() {
    return (
      <div className="container mx-auto max-w-4xl p-4 space-y-8">
        {workoutHistory.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No workout history found. Start logging your sessions!
          </div>
        ) : (
          workoutHistory.map((dayLog) => (
            <section key={dayLog.date} aria-labelledby={`date-${dayLog.date}`}>
              {/* Date Header */}
              <h2
                id={`date-${dayLog.date}`}
                className="text-xl font-semibold mb-4 sticky top-0 bg-background py-2 -mx-4 px-4 border-b z-10" // Sticky date header
              >
                {dayLog.date}
              </h2>
  
              {/* Exercises for the Day */}
              <div className="space-y-6">
                {dayLog.exercises.map((exercise) => (
                  <Card key={exercise.id}>
                    <CardHeader>
                      <CardTitle>{exercise.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[50px]">Set</TableHead>
                            <TableHead>Weight</TableHead>
                            <TableHead>Reps</TableHead>
                            {/* Conditionally show Time header if any set has time */}
                            {exercise.sets.some(set => set.time) && <TableHead>Time</TableHead>}
                            <TableHead className="text-right w-[60px]">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {exercise.sets.map((set) => (
                            <TableRow key={set.id}>
                              <TableCell className="font-medium">{set.setNumber}</TableCell>
                              <TableCell>{set.weight}</TableCell>
                              <TableCell>{set.reps}</TableCell>
                              {/* Conditionally show Time cell */}
                              {exercise.sets.some(s => s.time) && <TableCell>{set.time ?? '-'}</TableCell>}
                              <TableCell className="text-right">
                                {set.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500 inline-block" />
                                ) : (
                                  // Optional: Placeholder for incomplete
                                  <div className="h-5 w-5 inline-block border rounded-full border-muted"></div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    );
  }
  
  export default WorkoutsPage;