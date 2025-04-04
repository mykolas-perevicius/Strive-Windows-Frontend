// src/pages/app/StatsPage.tsx

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
// Assuming dummyStats exports these now
import { workoutFrequencyData, workoutVolumeData, weightProgressData } from "@/data/dummyStats";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

type TimeRange = "week" | "month" | "year";

// --- Define types based on expected dummy data ---
type WeightPoint = { date: string; weight: number };
type FrequencyPoint = { week: string; workouts: number };
type VolumePoint = { date: string; volume: number };
type ChartDataPoint = WeightPoint | FrequencyPoint | VolumePoint;

// Define type for Summary Stats Data
interface SummaryStats {
    completionPercent: number;
    skippedPercent: number;
    partialPercent: number;
    exerciseProgression: {
      id: string;
      name: string;
      change: string;
      trend: 'up' | 'down' | 'same';
    }[];
}

// *** REINSTATED DUMMY FUNCTION DEFINITION LOCALLY ***
const getSummaryStatsData = (range: TimeRange): SummaryStats => {
  console.log(`(Local Dummy) Fetching summary stats for: ${range}`);
  // Basic randomization for variety, replace with actual logic later
  const baseCompletion = 70 + Math.floor(Math.random() * 25); // 70-94%
  const baseSkipped = 2 + Math.floor(Math.random() * 6); // 2-7%
  const partial = 100 - baseCompletion - baseSkipped;
  // Ensure percentages don't go negative if completion+skipped > 100
  const finalPartial = Math.max(0, partial);
  const finalCompletion = 100 - baseSkipped - finalPartial;

  // Dummy progression data
  const progression = [
      { id: 'ex1', name: 'Bench Press', change: "+5 lbs", trend: 'up' as const },
      { id: 'ex2', name: 'Squat', change: "+10 lbs", trend: 'up' as const },
      { id: 'ex3', name: 'Tricep Extension', change: "-1.5 lbs", trend: 'down' as const },
      { id: 'ex4', name: 'Deadlift', change: "No Change", trend: 'same' as const },
    ];
   // Simple shuffle for variety based on range (example only)
   if (range === 'week') progression.pop();
   if (range === 'year') progression.shift();


  return {
    completionPercent: finalCompletion,
    skippedPercent: baseSkipped,
    partialPercent: finalPartial,
    exerciseProgression: progression,
  };
};
// --- End Dummy Function ---


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

    // *** REMOVED UNUSED getLabelType function ***
    // const getLabelType = (point: ChartDataPoint): string => { ... }

    const getUnit = (point: ChartDataPoint): string | undefined => {
        if ('weight' in point) return ' kg/lb';
        return undefined;
    }

    return (
      <div className="rounded-md border border-border bg-popover p-2 shadow-sm text-popover-foreground">
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          <div className="flex flex-col col-span-2 mb-1">
            {/* Display the label (e.g., date/week) */}
            <span className="font-semibold">{label}</span>
          </div>
          {typedPayload.map((entry, index: number) => (
             <div key={`item-${index}`} className="flex flex-col col-span-2 sm:col-span-1">
                <span className="text-xs uppercase" style={{ color: entry.color }}>
                    {entry.name}
                </span>
                <span className="font-semibold" style={{ color: entry.color }}>
                    {entry.value}{getUnit(dataPoint) || ''}
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
  const summaryStatsData: SummaryStats = getSummaryStatsData(selectedTimeRange);

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "year", label: "Last Year" },
  ];

  // Define theme-aware colors
  const axisStrokeColor = "hsl(var(--muted-foreground) / 0.6)";
  const gridStrokeColor = "hsl(var(--border) / 0.6)";
  const primaryColor = "hsl(var(--primary))";
  // *** REMOVED UNUSED COLOR VARIABLES ***
  // const destructiveColor = "hsl(var(--destructive))";
  // const warningColor = "hsl(var(--warning))";

  // Helper for progression icons
  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'same' }) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-destructive" />;
      case 'same': return <Minus className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };


  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 space-y-6">
       {/* Header remains the same */}
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

       {/* Summary & Progression Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Summary Card */}
           <Card className="lg:col-span-1 border-border/80">
              <CardHeader className="pb-2 pt-4 px-4">
                 <CardTitle className="text-base font-semibold text-foreground">Session Summary</CardTitle>
                 <CardDescription className="text-xs">Completion rates for the selected period.</CardDescription>
               </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-3 pt-2">
                    <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Completed</span>
                          <span>{summaryStatsData.completionPercent}%</span>
                        </div>
                        <Progress value={summaryStatsData.completionPercent} aria-label={`${summaryStatsData.completionPercent}% completed`} className="h-2" />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Partially Completed</span>
                          <span>{summaryStatsData.partialPercent}%</span>
                        </div>
                        <Progress value={summaryStatsData.partialPercent} className="h-2 [&>div]:bg-yellow-500" aria-label={`${summaryStatsData.partialPercent}% partially completed`} />
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Skipped / Missed</span>
                          <span>{summaryStatsData.skippedPercent}%</span>
                        </div>
                        <Progress value={summaryStatsData.skippedPercent} className="h-2 [&>div]:bg-destructive" aria-label={`${summaryStatsData.skippedPercent}% skipped`} />
                    </div>
                </div>
              </CardContent>
           </Card>

           {/* Progression Card */}
            <Card className="lg:col-span-2 border-border/80">
               <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-base font-semibold text-foreground">Exercise Progression</CardTitle>
                   <CardDescription className="text-xs">Recent performance changes in key exercises.</CardDescription>
               </CardHeader>
               <CardContent className="px-4 pb-4">
                 <div className="space-y-2.5 pt-2">
                   {summaryStatsData.exerciseProgression.length > 0 ? (
                       summaryStatsData.exerciseProgression.map(ex => (
                          <div key={ex.id} className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-b-0">
                             <span className="font-medium">{ex.name}</span>
                             <div className="flex items-center gap-2">
                               <span className={cn(
                                   "text-xs",
                                   ex.trend === 'up' && "text-green-500",
                                   ex.trend === 'down' && "text-destructive",
                                   ex.trend === 'same' && "text-muted-foreground"
                               )}>
                                 {ex.change}
                               </span>
                               <TrendIcon trend={ex.trend} />
                             </div>
                          </div>
                       ))
                   ) : (
                       <p className="text-sm text-muted-foreground text-center py-4">No progression data available.</p>
                   )}
                 </div>
               </CardContent>
            </Card>
       </div>

       {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Weight Chart Card */}
             <Card className="border-border/80">
                <CardHeader className="pb-1 pt-4 px-4">
                    <CardTitle className="text-base font-semibold text-foreground">Weight Progression</CardTitle>
                    <CardDescription className="text-xs">Estimated 1RM or top set weight over time.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 px-2 pb-0">
                  <div className="h-[250px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                       <LineChart data={weightProgressData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStrokeColor}/>
                         <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} stroke={axisStrokeColor} fontSize={10} />
                         <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={['auto', 'auto']} stroke={axisStrokeColor} fontSize={10} unit="kg"/>
                         <Tooltip content={<CustomTooltip />} cursor={{ stroke: axisStrokeColor, strokeDasharray: '3 3' }} />
                         <Line type="monotone" dataKey="weight" stroke={primaryColor} strokeWidth={2} activeDot={{ r: 5, style: { fill: primaryColor, strokeWidth: 0 } }} name="Weight" dot={false}/>
                       </LineChart>
                     </ResponsiveContainer>
                  </div>
                </CardContent>
             </Card>

             {/* Frequency Chart */}
             <Card className="border-border/80">
               <CardHeader className="pb-1 pt-4 px-4">
                  <CardTitle className="text-base font-semibold text-foreground">Workout Frequency</CardTitle>
                  <CardDescription className="text-xs">Workouts completed per week.</CardDescription>
               </CardHeader>
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

        {/* Volume Chart */}
        <Card className="border-border/80">
         <CardHeader className="pb-1 pt-4 px-4">
             <CardTitle className="text-base font-semibold text-foreground">Workout Volume Trend</CardTitle>
             <CardDescription className="text-xs">Total volume (sets * reps * weight) over time.</CardDescription>
         </CardHeader>
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