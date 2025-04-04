// src/pages/app/StatsPage.tsx

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress"; // Removed - Temporarily simplifying
import { cn } from "@/lib/utils";
// import { weightProgressData, workoutFrequencyData, workoutVolumeData } from "@/data/dummyStats"; // Removed weightProgressData usage
import { workoutFrequencyData, workoutVolumeData } from "@/data/dummyStats"; // Keep other data
import {
  ResponsiveContainer,
  // LineChart, // Removed - Temporarily simplifying
  // Line, // Removed - Temporarily simplifying
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
  // Added missing imports for LineChart/Line for Volume chart
  LineChart,
  Line
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

type TimeRange = "week" | "month" | "year";

// --- Dummy Stats Data Function (Summary part temporarily unused) ---
// const getSummaryStatsData = (range: TimeRange) => {
//   console.log(`Fetching summary stats for: ${range}`);
//   const baseCompletion = 75 + Math.floor(Math.random() * 15);
//   const baseSkipped = 10 + Math.floor(Math.random() * 5);
//   const partial = 100 - baseCompletion - baseSkipped;
//   const partialPercent = partial < 0 ? 0 : partial;
//   const completionPercent = partial < 0 ? 100 - baseSkipped : baseCompletion;

//   return {
//     completionPercent: completionPercent,
//     skippedPercent: baseSkipped,
//     partialPercent: partialPercent,
//     exerciseProgression: [
//       { id: 'ex1', name: 'Bench Press', change: "+5 lbs", trend: 'up' },
//       { id: 'ex2', name: 'Squat', change: "+10 lbs", trend: 'up' },
//       { id: 'ex3', name: 'Tricep Extension', change: "-1.5 lbs", trend: 'down' },
//       { id: 'ex4', name: 'Deadlift', change: "No Change", trend: 'same' },
//     ],
//   };
// };
// --- End Dummy Data ---

// --- Define types for the data structures used in charts ---
// type WeightPoint = { date: string; weight: number }; // Temporarily unused
type FrequencyPoint = { week: string; workouts: number };
type VolumePoint = { date: string; volume: number };
// type ChartDataPoint = WeightPoint | FrequencyPoint | VolumePoint; // Simplified
type ChartDataPoint = FrequencyPoint | VolumePoint; // Simplified

// --- Define a more specific type for the tooltip payload entry ---
interface TooltipPayloadEntry {
    name: NameType;
    value: ValueType;
    color?: string;
    unit?: string;
    payload: ChartDataPoint;
}

// --- Recharts Tooltip ---
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const typedPayload = payload as TooltipPayloadEntry[];
    const dataPoint = typedPayload[0].payload;

    const getLabelType = (point: ChartDataPoint): string => {
        if ('date' in point) return 'Date'; // Keep for Volume chart
        if ('week' in point) return 'Week';
        return 'Label';
    }

    return (
      <div className="rounded-md border border-border bg-popover p-2 shadow-sm text-popover-foreground">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          <div className="flex flex-col col-span-2 mb-1">
            <span className="text-xs uppercase text-muted-foreground">
              {getLabelType(dataPoint)}
            </span>
            <span className="font-semibold">{label}</span>
          </div>
          {typedPayload.map((entry, index: number) => (
             <div key={`item-${index}`} className="flex flex-col">
                <span className="text-xs uppercase" style={{ color: entry.color }}>
                    {entry.name}
                </span>
                <span className="font-semibold" style={{ color: entry.color }}>
                    {entry.value}{entry.unit || ''}
                </span>
             </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};


export function StatsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<TimeRange>("month");
  // const summaryStatsData = getSummaryStatsData(selectedTimeRange); // Temporarily unused

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "year", label: "Last Year" },
  ];

  // Define theme-aware colors
  const axisStrokeColor = "hsl(var(--muted-foreground) / 0.6)";
  const gridStrokeColor = "hsl(var(--border) / 0.6)";
  const primaryColor = "hsl(var(--primary))";

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 space-y-6">
       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
           <h1 className="text-xl font-semibold tracking-tight text-foreground">Statistics</h1>
           <div className="flex flex-wrap justify-center sm:justify-end gap-2">
              {timeRangeOptions.map(option => (
                 <Button
                   key={option.value}
                   variant={selectedTimeRange === option.value ? "default" : "ghost"}
                   className={cn( "h-8 px-3 text-xs", selectedTimeRange !== option.value && "text-muted-foreground hover:bg-muted/50" )}
                   onClick={() => setSelectedTimeRange(option.value)}
                 >
                   {option.label}
                 </Button>
              ))}
           </div>
       </div>

       {/* --- TEMPORARILY REMOVED Summary & Progression Row ---
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Card className="lg:col-span-1 border-border/80">
              <CardHeader className="pb-2 pt-4 px-4"> ... </CardHeader>
              <CardContent className="space-y-3 px-4 pb-4">
                 <p>Summary Placeholder - Content Removed</p>
              </CardContent>
           </Card>
            <Card className="lg:col-span-2 border-border/80">
               <CardHeader className="pb-2 pt-4 px-4"> ... </CardHeader>
               <CardContent className="space-y-2.5 px-4 pb-4">
                 <p>Progression Placeholder - Content Removed</p>
               </CardContent>
            </Card>
       </div>
       --- END TEMPORARY REMOVAL --- */}


       {/* Charts Row - Keep Frequency Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* --- TEMPORARILY REMOVED Weight Chart Card ---
             <Card className="border-border/80">
                <CardHeader className="pb-1 pt-4 px-4"> <CardTitle className="text-base font-semibold text-foreground">Weight Progression (Bench Press)</CardTitle> </CardHeader>
                <CardContent className="pt-2 px-2 pb-0">
                  <p>Weight Chart Placeholder - Content Removed</p>
                </CardContent>
             </Card>
             --- END TEMPORARY REMOVAL --- */}

             {/* Keep Frequency Chart */}
             <Card className="border-border/80 lg:col-span-1"> {/* Adjust span if only one chart in row */}
               <CardHeader className="pb-1 pt-4 px-4"> <CardTitle className="text-base font-semibold text-foreground">Workout Frequency</CardTitle> </CardHeader>
               <CardContent className="pt-2 px-2 pb-0">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={workoutFrequencyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStrokeColor} />
                        <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} stroke={axisStrokeColor} fontSize={10} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8} stroke={axisStrokeColor} fontSize={10} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.3)' }} />
                        <Bar dataKey="workouts" fill={primaryColor} radius={[3, 3, 0, 0]} name="Workouts" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </CardContent>
             </Card>
        </div>

        {/* Keep Volume Chart */}
        <Card className="border-border/80">
         <CardHeader className="pb-1 pt-4 px-4"> <CardTitle className="text-base font-semibold text-foreground">Workout Volume Trend</CardTitle> </CardHeader>
         <CardContent className="pt-2 px-2 pb-0">
           <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workoutVolumeData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStrokeColor}/>
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} stroke={axisStrokeColor} fontSize={10} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={['auto', 'auto']} stroke={axisStrokeColor} fontSize={10}/>
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: axisStrokeColor, strokeDasharray: '3 3' }} />
                  <Line type="monotone" dataKey="volume" stroke={primaryColor} strokeWidth={2} activeDot={{ r: 5, style: { fill: primaryColor, strokeWidth: 0 } }} name="Total Volume" dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
         </CardContent>
       </Card>

    </div>
  );
}