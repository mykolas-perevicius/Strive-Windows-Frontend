// src/pages/app/StatsPage.tsx

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
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

// --- Define types ---
type TimeRange = "week" | "month" | "year";
type WeightPoint = { date: string; weight: number };
type FrequencyPoint = { week: string; workouts: number };
type VolumePoint = { date: string; volume: number };
type ChartDataPoint = WeightPoint | FrequencyPoint | VolumePoint;

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

interface TooltipPayloadEntry {
    name: NameType;
    value: ValueType;
    color?: string; // Color passed from Line/Bar component
    unit?: string;
    payload: ChartDataPoint;
}

// --- Dummy Data Function ---
const getSummaryStatsData = (range: TimeRange): SummaryStats => {
  const baseCompletion = 70 + Math.floor(Math.random() * 25);
  const baseSkipped = 2 + Math.floor(Math.random() * 6);
  const partial = 100 - baseCompletion - baseSkipped;
  const finalPartial = Math.max(0, partial);
  const finalCompletion = 100 - baseSkipped - finalPartial;
  const progression = [
      { id: 'ex1', name: 'Bench Press', change: "+5 lbs", trend: 'up' as const },
      { id: 'ex2', name: 'Squat', change: "+10 lbs", trend: 'up' as const },
      { id: 'ex3', name: 'Tricep Extension', change: "-1.5 lbs", trend: 'down' as const },
      { id: 'ex4', name: 'Deadlift', change: "No Change", trend: 'same' as const },
    ];
   if (range === 'week') progression.pop();
   if (range === 'year') progression.shift();

  return {
    completionPercent: finalCompletion,
    skippedPercent: baseSkipped,
    partialPercent: finalPartial,
    exerciseProgression: progression,
  };
};

// --- Custom Tooltip Component ---
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
   if (active && payload && payload.length) {
    const typedPayload = payload as TooltipPayloadEntry[];
    const dataPoint = typedPayload[0]?.payload;

    const getUnit = (point: ChartDataPoint | undefined): string | undefined => {
        if (!point) return undefined;
        if ('weight' in point) return ' kg';
        if ('volume' in point) return '';
        if ('workouts' in point) return '';
        return undefined;
    }

    const primaryEntry = typedPayload[0];
    const primaryValue = primaryEntry?.value;
    const primaryUnit = getUnit(dataPoint);
    // Use the color passed from the Line/Bar component via the 'color' prop
    const tooltipColor = primaryEntry?.color || 'hsl(var(--foreground))'; // Fallback to foreground

    return (
      <div className="rounded-lg border border-border/80 bg-background/90 p-2.5 shadow-lg backdrop-blur-sm">
        <div className="mb-1.5 font-semibold text-foreground">{label}</div>
        <div className="flex items-baseline space-x-1.5 text-sm">
           <span className="font-medium" style={{ color: tooltipColor }}>
             {primaryEntry?.name}:
           </span>
           <span className="font-semibold text-foreground">
             {primaryValue !== undefined && primaryValue !== null ? primaryValue.toString() : 'N/A'}
             {primaryUnit}
           </span>
        </div>
      </div>
    );
  }
  return null;
};


// --- Stats Page Component ---
export function StatsPage() {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<TimeRange>("month");
  // State to hold the computed primary color (using RGB this time)
  const [computedPrimaryRgbColor, setComputedPrimaryRgbColor] = useState('rgb(0, 0, 0)'); // Default fallback (black)
  const summaryStatsData: SummaryStats = getSummaryStatsData(selectedTimeRange);

  // Effect to get the computed primary color (as RGB) after mount
  useEffect(() => {
    // Temporary element to apply the CSS variable to
    const tempElement = document.createElement('div');
    // Apply the CSS variable inline - browser will compute it
    tempElement.style.color = 'hsl(var(--primary))';
    // Append to body briefly to allow computation
    document.body.appendChild(tempElement);

    try {
        // Get the *computed* color style (likely in rgb format)
        const computedColor = window.getComputedStyle(tempElement).color;
        if (computedColor) {
          setComputedPrimaryRgbColor(computedColor);
          console.log("Computed Primary Color (RGB):", computedColor); // Log for debugging
        } else {
            console.warn("Could not compute color from --primary CSS variable.");
            // Keep fallback (e.g., black or a theme-agnostic gray)
            setComputedPrimaryRgbColor('rgb(50, 50, 50)'); // Dark gray fallback
        }
    } catch (error) {
        console.error("Error computing primary color:", error);
        setComputedPrimaryRgbColor('rgb(50, 50, 50)'); // Dark gray fallback
    } finally {
        // Clean up the temporary element
        document.body.removeChild(tempElement);
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "year", label: "Last Year" },
  ];

  // Define theme-aware colors for axes/grids
  const axisStrokeColor = "hsl(var(--muted-foreground) / 0.7)";
  const gridStrokeColor = "hsl(var(--border) / 0.7)";
  // linePrimaryColor now comes from state: computedPrimaryRgbColor

  // Helper for progression icons
  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'same' }) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-destructive" />;
      case 'same': return <Minus className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  // Calculate explicit domains
  const weightValues = weightProgressData.map(p => p.weight);
  const minWeight = Math.min(...weightValues);
  const maxWeight = Math.max(...weightValues);
  const weightDomain: [number, number] = [Math.floor(minWeight * 0.98), Math.ceil(maxWeight * 1.02)];

  const volumeValues = workoutVolumeData.map(p => p.volume);
  const minVolume = Math.min(...volumeValues);
  const maxVolume = Math.max(...volumeValues);
  const volumeDomain: [number, number] = [Math.floor(minVolume * 0.98), Math.ceil(maxVolume * 1.02)];

  // Define dot styles using the *computed* RGB color from state
  const lineDotStyle = {
    stroke: computedPrimaryRgbColor, // Use computed color for dot stroke
    strokeWidth: 1,
    r: 3,
    fill: 'hsl(var(--background))' // Hollow effect adapting to theme background
  };
  const activeDotStyle = {
    r: 5,
    fill: computedPrimaryRgbColor, // Use computed color for active dot fill
    strokeWidth: 0
  };


  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6 space-y-6">
       {/* Header */}
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


       {/* --- Charts Row - FINAL VERSION Attempt 3 (Computed RGB Color) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             {/* Weight Chart Card */}
             <Card className="border-border/80">
                <CardHeader className="pb-1 pt-4 px-4">
                    <CardTitle className="text-base font-semibold text-foreground">Weight Progression</CardTitle>
                    <CardDescription className="text-xs">Estimated 1RM or top set weight over time.</CardDescription>
                </CardHeader>
                <CardContent className="pt-2 px-2 pb-0">
                  <div className="h-[250px] w-full">
                     {/* Ensure key prop changes if data source changes, forces re-render */}
                     <ResponsiveContainer width="100%" height="100%" key={selectedTimeRange + "-weight"}>
                       <LineChart data={weightProgressData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStrokeColor}/>
                         <XAxis
                             dataKey="date"
                             tickLine={false}
                             axisLine={false}
                             tickMargin={10}
                             stroke={axisStrokeColor}
                             fontSize={10}
                          />
                         <YAxis
                             tickLine={false}
                             axisLine={false}
                             tickMargin={8}
                             domain={weightDomain}
                             stroke={axisStrokeColor}
                             fontSize={10}
                             unit="kg"
                         />
                         <Tooltip
                             content={<CustomTooltip />}
                             cursor={{ stroke: axisStrokeColor, strokeWidth: 1, strokeDasharray: '3 3' }}
                             isAnimationActive={false}
                         />
                         <Line
                             type="monotone"
                             dataKey="weight"
                             // Use the computed RGB color from state
                             stroke={computedPrimaryRgbColor}
                             strokeWidth={2}
                             activeDot={activeDotStyle}
                             dot={lineDotStyle}
                             isAnimationActive={false}
                             // Pass computed color to tooltip payload
                             color={computedPrimaryRgbColor}
                             name="Weight"
                          />
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
                     {/* Ensure key prop changes if data source changes, forces re-render */}
                     <ResponsiveContainer width="100%" height="100%" key={selectedTimeRange + "-freq"}>
                      <BarChart data={workoutFrequencyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStrokeColor} />
                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            stroke={axisStrokeColor}
                            fontSize={10}
                         />
                        <YAxis
                            allowDecimals={false}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            stroke={axisStrokeColor}
                            fontSize={10}
                         />
                         <Tooltip
                             content={<CustomTooltip />}
                             cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                             isAnimationActive={false}
                          />
                        <Bar
                            dataKey="workouts"
                             // Bar should use the computed color too for theme consistency
                            fill={computedPrimaryRgbColor}
                            radius={[3, 3, 0, 0]}
                            isAnimationActive={false}
                            // Pass computed color to tooltip payload
                            color={computedPrimaryRgbColor}
                            name="Workouts"
                         />
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
            {/* Ensure key prop changes if data source changes, forces re-render */}
            <ResponsiveContainer width="100%" height="100%" key={selectedTimeRange + "-volume"}>
                <LineChart data={workoutVolumeData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStrokeColor}/>
                  <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      stroke={axisStrokeColor}
                      fontSize={10}
                   />
                  <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      domain={volumeDomain}
                      stroke={axisStrokeColor}
                      fontSize={10}
                      tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value.toString()}
                  />
                   <Tooltip
                       content={<CustomTooltip />}
                       cursor={{ stroke: axisStrokeColor, strokeWidth: 1, strokeDasharray: '3 3' }}
                       isAnimationActive={false}
                   />
                  <Line
                      type="monotone"
                      dataKey="volume"
                      // Use the computed RGB color from state
                      stroke={computedPrimaryRgbColor}
                      strokeWidth={2}
                      activeDot={activeDotStyle}
                      dot={lineDotStyle}
                      isAnimationActive={false}
                      // Pass computed color to tooltip payload
                      color={computedPrimaryRgbColor}
                      name="Total Volume"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
         </CardContent>
       </Card>
    </div>
  );
}