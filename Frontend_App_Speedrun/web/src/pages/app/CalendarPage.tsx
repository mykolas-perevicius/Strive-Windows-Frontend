// src/pages/app/CalendarPage.tsx
import React, { useEffect } from 'react'; // Import useEffect for logging
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from '@/components/ui/button'; // <-- REMOVE THIS LINE
import { format } from 'date-fns';

// Dummy data for days with workouts - replace with actual data fetching
const workoutLog: Record<string, { workoutName: string; id: string }[]> = {
  '2025-04-01': [{ workoutName: "Push Day", id: "w1" }],
  '2025-04-03': [{ workoutName: "Pull Day", id: "w2" }, { workoutName: "Quick Abs", id: "w3"}],
  '2025-03-28': [{ workoutName: "Leg Day", id: "w4" }],
};

// Generate Date objects for calendar modifier
const workoutDays = Object.keys(workoutLog).map(dateStr => {
    const [year, month, day] = dateStr.split('-').map(Number);
    // Add validation for NaN dates if needed
    const dateObj = new Date(year, month - 1, day);
    // console.log(`Parsed date string ${dateStr} to Date:`, dateObj); // Log date parsing
    return dateObj;
});


export function CalendarPage() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

  // --- Logging ---
  useEffect(() => {
    console.log("CalendarPage mounted or updated.");
    console.log("Current selectedDate:", selectedDate);
    console.log("Current currentMonth:", currentMonth);
    console.log("Workout days for modifier:", workoutDays);
  }, [selectedDate, currentMonth]); // Re-log if state changes

  const selectedDateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const workoutsForSelectedDate = workoutLog[selectedDateString] || [];

  // --- Check calculated values ---
  // console.log("Selected date string:", selectedDateString);
  // console.log("Workouts for selected date:", workoutsForSelectedDate);

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 space-y-6">
       <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Workout Calendar</h1>
       <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 gap-6">
          {/* Card containing the calendar */}
          <Card className="lg:col-span-2">
             {/* Apply mx-auto to center the calendar within the card */}
             <Calendar
               mode="single"
               selected={selectedDate}
               onSelect={setSelectedDate}
               month={currentMonth}
               onMonthChange={setCurrentMonth}
               // className="p-3 sm:p-4" // Original
               className="p-3 sm:p-4 mx-auto" // <-- FIX: Added mx-auto
               modifiers={{
                 workout: workoutDays,
                 selectedWorkout: (date) => {
                    // Ensure valid dates before comparison
                    if (!date || !selectedDate) return false;
                    const isValidWorkoutDay = workoutDays.some(wd => wd && wd.toDateString() === date.toDateString());
                    return isValidWorkoutDay && selectedDate?.toDateString() === date.toDateString();
                 }
               }}
               modifiersClassNames={{
                 workout: 'border border-primary/50 rounded-md',
                 selectedWorkout: 'bg-primary text-primary-foreground',
                 today: 'bg-muted text-foreground rounded-full',
               }}
               showOutsideDays={false}
             />
             {/* Legend */}
             <div className="p-4 border-t text-xs text-muted-foreground flex items-center justify-center gap-4"> {/* Centered legend */}
                 <span>Legend:</span>
                 <span className='flex items-center gap-1.5'><span className='inline-block w-3 h-3 rounded-full bg-muted'></span>Today</span>
                 <span className='flex items-center gap-1.5'><span className='inline-block w-3 h-3 border border-primary/50 rounded'></span>Workout Logged</span>
             </div>
          </Card>

          {/* Card for selected day details */}
          <div className="lg:col-span-1">
             <Card className="min-h-[200px]">
                <CardHeader>
                    <CardTitle>
                       {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a Date'}
                    </CardTitle>
                    <CardDescription>
                        {selectedDate ? "Workouts logged on this day:" : "Click a date on the calendar."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {selectedDate ? (
                        workoutsForSelectedDate.length > 0 ? (
                            <ul className="space-y-2">
                                {workoutsForSelectedDate.map(workout => (
                                    <li key={workout.id} className="text-sm p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors">
                                        <button onClick={() => console.log("Navigate to workout:", workout.id)} className="w-full text-left">
                                            {workout.workoutName}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No workouts logged.</p>
                        )
                    ) : (
                        <p className="text-sm text-muted-foreground">Details will appear here.</p>
                    )}
                </CardContent>
             </Card>
          </div>
       </div>
    </div>
  );
}

export default CalendarPage;