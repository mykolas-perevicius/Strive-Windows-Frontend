import React from 'react'; // For useState
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils"; // <-- Import cn utility
// Placeholder for Chart component - we won't implement actual charts here yet
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type TimeRange = "session" | "today" | "week" | "month" | "year" | "custom";

// --- Dummy Stats Data ---
// This would dynamically change based on selectedTimeRange
const getStatsData = (range: TimeRange) => {
  console.log(`Fetching stats for: ${range}`); // Simulate fetch
  // Return dummy data - replace with actual logic
  // Values might change slightly per range for demo purposes
  const baseCompletion = 80 + Math.floor(Math.random() * 10);
  const baseSkipped = 15 - Math.floor(Math.random() * 5);
  return {
    completionPercent: baseCompletion,
    skippedPercent: baseSkipped,
    partialPercent: 100 - baseCompletion - baseSkipped,
    totalVolume: [ // Dummy data for volume chart placeholder
      { name: 'Wk 1', uv: 4000 + Math.random() * 500 },
      { name: 'Wk 2', uv: 3000 + Math.random() * 500 },
      { name: 'Wk 3', uv: 2000 + Math.random() * 500 },
      { name: 'Wk 4', uv: 2780 + Math.random() * 500 },
    ],
    exerciseProgression: [ // Dummy data for progression list
      { id: 'ex1', name: 'Bench Press', change: "+5 lbs", trend: 'up' },
      { id: 'ex2', name: 'Squat', change: "+10 lbs", trend: 'up' },
      { id: 'ex3', name: 'Tricep Extension', change: "-1.5 lbs", trend: 'down' },
    ],
  };
};
// --- End Dummy Data ---


export function StatsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<TimeRange>("month"); // Default range
  const statsData = getStatsData(selectedTimeRange); // Get data for selected range

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    // { value: "session", label: "Session" }, // Maybe handled differently?
    // { value: "today", label: "Today" },
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "year", label: "Last Year" },
    // { value: "custom", label: "Custom" },
  ];

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-8">
       <h1 className="text-2xl font-bold border-b pb-2">Statistics</h1>

       {/* Time Range Selector */}
       {/* Using simple buttons for now. Could use ToggleGroup or Select later */}
       <div className="flex flex-wrap justify-center gap-2">
          {timeRangeOptions.map(option => (
             <Button
               key={option.value}
               variant={selectedTimeRange === option.value ? "default" : "outline"}
               size="sm"
               onClick={() => setSelectedTimeRange(option.value)}
             >
               {option.label}
             </Button>
          ))}
       </div>

       {/* Summary Section */}
       <Card>
         <CardHeader>
            {/* Title could dynamically update */}
            <CardTitle className="capitalize">{selectedTimeRange} Summary</CardTitle>
            <CardDescription>Overview of your activity for the selected period.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            {/* Completion Percentages */}
            <div className="space-y-2">
               <div className="flex justify-between text-sm">
                  <span className="font-medium text-green-600 dark:text-green-400">Completed</span>
                  <span>{statsData.completionPercent}%</span>
               </div>
               <Progress value={statsData.completionPercent} className="h-2 [&>div]:bg-green-500" aria-label={`${statsData.completionPercent}% completed`} />
            </div>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                  <span className="font-medium text-orange-600 dark:text-orange-400">Partial</span>
                   <span>{statsData.partialPercent}%</span>
               </div>
               <Progress value={statsData.partialPercent} className="h-2 [&>div]:bg-orange-500" aria-label={`${statsData.partialPercent}% partial`} />
            </div>
             <div className="space-y-2">
               <div className="flex justify-between text-sm">
                  <span className="font-medium text-red-600 dark:text-red-400">Skipped</span>
                   <span>{statsData.skippedPercent}%</span>
               </div>
               <Progress value={statsData.skippedPercent} className="h-2 [&>div]:bg-red-500" aria-label={`${statsData.skippedPercent}% skipped`} />
            </div>
         </CardContent>
       </Card>

       <Separator />

       {/* Total Volume Section */}
        <Card>
          <CardHeader>
            <CardTitle>Total Volume</CardTitle>
             <CardDescription>Total weight lifted over the period.</CardDescription>
          </CardHeader>
          <CardContent>
             {/* --- Chart Placeholder --- */}
             <div className="h-60 w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground text-sm">
                {/* TODO: Implement Recharts Bar Chart here using statsData.totalVolume */}
                Chart Placeholder
             </div>
              {/* Example Recharts structure (requires setup):
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={statsData.totalVolume}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="uv" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              */}
          </CardContent>
        </Card>

       <Separator />

        {/* Exercise Progression Section */}
        <Card>
           <CardHeader>
            <CardTitle>Exercise Progression</CardTitle>
             <CardDescription>Changes in performance for key exercises.</CardDescription>
          </CardHeader>
           <CardContent className="space-y-3">
            {statsData.exerciseProgression.length > 0 ? (
              statsData.exerciseProgression.map(ex => (
                <div key={ex.id} className="flex justify-between items-center text-sm">
                  <span>{ex.name}</span>
                  <span className={cn(
                     "font-semibold",
                     ex.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  )}>
                    {ex.change}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No progression data available for this period.</p>
            )}
          </CardContent>
        </Card>

    </div>
  );
}

export default StatsPage;