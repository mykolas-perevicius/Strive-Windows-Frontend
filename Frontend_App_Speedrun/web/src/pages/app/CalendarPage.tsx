import React from 'react'; // Import React for useState
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card"; // Use Card for optional details

// Dummy data for days with workouts - replace with actual data fetching
// Use Date objects for comparison with react-day-picker
const workoutDays = [
  new Date(2024, 0, 16), // Jan 16 2024 (Month is 0-indexed)
  new Date(2024, 0, 15), // Jan 15 2024
  new Date(2024, 0, 14), // Jan 14 2024
  new Date(2024, 0, 8),  // Jan 8 2024
  new Date(2024, 1, 1),   // Feb 1 2024
  // Add more dates...
];

export function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date()); // State for selected date
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date()); // State for displayed month

  // Find workout details for the selected date (dummy example)
  const selectedWorkoutDetails = date && workoutDays.some(
    workoutDay => workoutDay.toDateString() === date.toDateString()
  ) ? `Workout logged on ${date.toLocaleDateString()}` : null; // Replace with actual data lookup

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
       <h1 className="text-2xl font-bold border-b pb-2">Workout Calendar</h1>

       <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          {/* Calendar Component */}
          <Card className="w-full md:w-auto"> {/* Allows calendar to take available width */}
             <Calendar
               mode="single" // Allows selecting one day
               selected={date} // Bind selected state
               onSelect={setDate} // Update state on selection
               month={currentMonth} // Control displayed month
               onMonthChange={setCurrentMonth} // Update month state
               className="p-0" // Remove default padding if inside Card
               // Modifiers to style workout days
               modifiers={{
                 workout: workoutDays, // Apply 'workout' modifier to dates in workoutDays array
               }}
               modifiersClassNames={{
                 workout: 'bg-primary/20 text-primary-foreground rounded-md', // Style for days with workouts
                 // Example: Different style for today
                 // today: 'bg-accent text-accent-foreground rounded-full',
               }}
               // Optional: Add footer or captions
               // showOutsideDays={false} // Hide days from other months
             />
          </Card>

          {/* Details Area (Optional) */}
          <div className="flex-1 w-full">
             <h2 className="text-lg font-semibold mb-2">Selected Date Details</h2>
             {date ? (
                <Card>
                   <CardContent className="p-4">
                      <p className="font-medium mb-1">{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      {selectedWorkoutDetails ? (
                         <p className="text-sm text-muted-foreground">{selectedWorkoutDetails}</p>
                      ) : (
                          <p className="text-sm text-muted-foreground">No workout logged on this day.</p>
                      )}
                      {/* Add button to view workout or log new one for this date? */}
                      {/* <Button size="sm" variant="outline" className="mt-4">View Workout</Button> */}
                   </CardContent>
                </Card>
             ) : (
                <p className="text-sm text-muted-foreground">Select a date to see details.</p>
             )}
          </div>
       </div>

    </div>
  );
}

export default CalendarPage;