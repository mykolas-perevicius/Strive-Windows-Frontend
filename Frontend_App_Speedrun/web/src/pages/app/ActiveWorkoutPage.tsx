// src/pages/app/ActiveWorkoutPage.tsx

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ActiveWorkoutSession, ActiveExercise } from '@/types/workout';
import {
    CheckCircle, XCircle, Timer, SkipForward,
} from 'lucide-react';
import { formatTimeElapsed } from '@/lib/utils';
import { workoutTemplates as dummyTemplates } from "@/data/dummyWorkouts";

// --- loadWorkoutSession function remains the same ---
const loadWorkoutSession = (templateId: string | null): ActiveWorkoutSession | null => {
    let workoutName = "Blank Workout";
    let baseExercises: Omit<ActiveExercise, 'loggedSets'>[] = [];

    if (templateId) {
        let foundTemplate: { id: string; name: string; exercises: string[] } | undefined;
        for (const category in dummyTemplates) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const categoryTemplates = (dummyTemplates as any)[category];
            if (Array.isArray(categoryTemplates)) {
                const template = categoryTemplates.find((t: { id: string }) => t.id === templateId);
                if (template) {
                    foundTemplate = template;
                    break;
                }
            }
        }

        if (foundTemplate) {
            workoutName = foundTemplate.name;
            baseExercises = foundTemplate.exercises.map((exName, index) => ({
                id: `${templateId}-ex${index}-${crypto.randomUUID()}`,
                name: exName,
                sets: 3, reps: 10, weight: 50, restTimeSeconds: 60,
            }));
        } else {
            console.error(`Template with ID ${templateId} not found.`);
            return null;
        }
    } else {
        console.log("Starting a truly blank session - not implemented");
        return null;
    }

    const activeExercises: ActiveExercise[] = baseExercises.map(ex => ({
        ...ex,
        loggedSets: Array.from({ length: ex.sets }, (_, i) => ({
            setIndex: i, reps: null, weight: null, completedAt: null,
        })),
    }));

    if (activeExercises.length === 0) {
        console.error("Cannot start session with no exercises.");
        return null;
    }

    return {
        sessionId: crypto.randomUUID(), templateId: templateId, workoutName: workoutName,
        exercises: activeExercises, currentExerciseIndex: 0, currentSetIndex: 0,
        startTime: new Date().toISOString(), endTime: null, status: 'in-progress',
        isResting: false, restDurationSeconds: 0, restEndTime: null,
    };
};
// --- End Dummy Data Fetching ---


export function ActiveWorkoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const templateId = queryParams.get('template');

    const [session, setSession] = useState<ActiveWorkoutSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentReps, setCurrentReps] = useState<string>('');
    const [currentWeight, setCurrentWeight] = useState<string>('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isFinishAlertOpen, setIsFinishAlertOpen] = useState(false);
    const [restTimeRemaining, setRestTimeRemaining] = useState<number>(0);
    const sessionRef = useRef(session);
    const redirectTimerRef = useRef<NodeJS.Timeout | number | null>(null);

    // --- useEffect for loading session ---
    useEffect(() => {
        console.log("Attempting to load session for template ID:", templateId);
        setIsLoading(true); setError(null);
        const loadedSession = loadWorkoutSession(templateId);
        if (loadedSession) {
            setSession(loadedSession);
            if (loadedSession.exercises.length > 0) {
                 const firstExercise = loadedSession.exercises[0];
                 setCurrentReps(firstExercise.reps.toString());
                 setCurrentWeight(firstExercise.weight?.toString() ?? '');
            }
        } else {
             setError(`Failed to load workout data.${templateId ? ' Template not found.' : ' No template specified.'}`);
        }
        setIsLoading(false);
    }, [templateId]);

    // --- useEffect for overall workout timer ---
    useEffect(() => {
        if (session?.status !== 'in-progress' || !session?.startTime) {
            setElapsedTime(0);
            return;
        };
        const start = new Date(session.startTime).getTime();
        const now = Date.now();
        setElapsedTime(Math.floor((now - start) / 1000));

        const timerInterval = setInterval(() => {
             const currentStart = new Date(sessionRef.current?.startTime ?? 0).getTime();
             const currentNow = Date.now();
             setElapsedTime(Math.floor((currentNow - currentStart) / 1000));
        }, 1000);

        return () => clearInterval(timerInterval);
     // No eslint-disable needed here anymore
    }, [session?.status, session?.startTime]);

    // --- useEffect to update ref ---
    useEffect(() => {
        sessionRef.current = session;
    }, [session]);

    // --- useEffect for Rest Timer Logic ---
    useEffect(() => {
        if (!session?.isResting || !session.restEndTime) {
            setRestTimeRemaining(0);
            return;
        }

        // Use const as it's only assigned once here
        const intervalId: NodeJS.Timeout | number | undefined = setInterval(() => {
            // Inner function `updateRemainingTime` removed for simplicity, logic moved directly here
             if (!sessionRef.current?.restEndTime || !sessionRef.current?.isResting) {
                 setRestTimeRemaining(0);
                 clearInterval(intervalId); // Clear self
                 return;
             }

             const currentEndTimeMs = new Date(sessionRef.current.restEndTime).getTime();
             const currentNowMs = Date.now();
             const remaining = Math.max(0, Math.ceil((currentEndTimeMs - currentNowMs) / 1000));

             setRestTimeRemaining(remaining);

             if (remaining <= 0) {
                 clearInterval(intervalId); // Clear self
                 setSession(prev => {
                     if (prev?.isResting && prev?.restEndTime && new Date(prev.restEndTime).getTime() <= Date.now()) {
                         console.log("Rest finished naturally!");
                         const nextSession = { ...prev, isResting: false, restEndTime: null, restDurationSeconds: 0 };
                         const nextExercise = nextSession.exercises[nextSession.currentExerciseIndex];
                         if (nextExercise) {
                             setCurrentReps(nextExercise.reps.toString());
                             setCurrentWeight(nextExercise.weight?.toString() ?? '');
                         }
                         return nextSession;
                     }
                     return prev;
                 });
             }
        }, 500);

         // Initial check in case timer should already be 0
         const initialEndTimeMs = new Date(session.restEndTime).getTime();
         const initialNowMs = Date.now();
         const initialRemaining = Math.max(0, Math.ceil((initialEndTimeMs - initialNowMs) / 1000));
         setRestTimeRemaining(initialRemaining);
         if (initialRemaining <= 0) {
              clearInterval(intervalId); // Clear immediately if already expired
              // Trigger state update similar to inside interval
              setSession(prev => {
                 if (prev?.isResting && prev?.restEndTime && new Date(prev.restEndTime).getTime() <= Date.now()) {
                     return { ...prev, isResting: false, restEndTime: null, restDurationSeconds: 0 };
                 }
                 return prev;
             });
         }


        return () => {
            clearInterval(intervalId); // Cleanup on unmount or dependency change
        };
     // No eslint-disable needed here anymore
    }, [session?.isResting, session?.restEndTime]);

    // --- useEffect for handling automatic navigation on completion ---
     useEffect(() => {
        if (session?.status === 'completed' && !isLoading && !error) {
            console.log("Workout completed state detected, navigating...");
             if (redirectTimerRef.current) {
                 clearTimeout(redirectTimerRef.current);
             }
            redirectTimerRef.current = setTimeout(() => {
                navigate('/start-workout', { replace: true });
            }, 1500);
        }
        return () => {
             if (redirectTimerRef.current) {
                 clearTimeout(redirectTimerRef.current);
                 redirectTimerRef.current = null;
             }
         };
    }, [session?.status, isLoading, error, navigate]);


    // --- useMemo hooks ---
    const currentExercise = useMemo(() => {
         if (!session || session.currentExerciseIndex >= session.exercises.length) return null;
         return session.exercises[session.currentExerciseIndex];
      // No eslint-disable needed here anymore
    }, [session?.exercises, session?.currentExerciseIndex]);

    const currentSetTarget = useMemo(() => {
         if (!session || !currentExercise || session.currentSetIndex >= currentExercise.sets) return null;
         return { reps: currentExercise.reps, weight: currentExercise.weight };
       // No eslint-disable needed here anymore
    }, [currentExercise, session?.currentSetIndex]);


    // --- Event Handlers (Using useCallback) ---
     const handleCompleteSet = useCallback(() => {
        if (!session || session.status !== 'in-progress' || !currentExercise || currentSetTarget === null || session.isResting) return;
        const repsCompleted = parseInt(currentReps, 10);
        const weightUsed = parseFloat(currentWeight);
        if (isNaN(repsCompleted) || repsCompleted < 0) { console.warn("Invalid reps entered."); return; }
        if (isNaN(weightUsed) || weightUsed < 0) { console.warn("Invalid weight entered."); return; }

        setSession(prevSession => {
            if (!prevSession) return null;
            const nextSession = JSON.parse(JSON.stringify(prevSession)) as ActiveWorkoutSession;
            const exerciseJustCompleted = nextSession.exercises[nextSession.currentExerciseIndex];
            if (!exerciseJustCompleted || nextSession.currentSetIndex >= exerciseJustCompleted.loggedSets.length) { console.error("Error: Current set index is out of bounds."); return prevSession; }

            exerciseJustCompleted.loggedSets[nextSession.currentSetIndex] = { setIndex: nextSession.currentSetIndex, reps: repsCompleted, weight: weightUsed, completedAt: new Date().toISOString() };

            const isLastSetOfExercise = nextSession.currentSetIndex >= exerciseJustCompleted.sets - 1;
            const isLastExerciseOfWorkout = nextSession.currentExerciseIndex >= nextSession.exercises.length - 1;
            const restDuration = exerciseJustCompleted.restTimeSeconds ?? 0;
            let shouldStartRest = false;

             if (isLastSetOfExercise) {
                 if (isLastExerciseOfWorkout) {
                     nextSession.status = 'completed'; nextSession.endTime = new Date().toISOString(); console.log("Workout Completed!");
                 } else {
                     nextSession.currentExerciseIndex += 1; nextSession.currentSetIndex = 0;
                     shouldStartRest = restDuration > 0;
                     if(shouldStartRest) console.log(`Starting rest (${restDuration}s) before next exercise.`);
                 }
             } else {
                 nextSession.currentSetIndex += 1;
                 shouldStartRest = restDuration > 0;
                 if(shouldStartRest) console.log(`Starting rest (${restDuration}s) before next set.`);
             }

             if (shouldStartRest && nextSession.status === 'in-progress') {
                 nextSession.isResting = true; nextSession.restDurationSeconds = restDuration; nextSession.restEndTime = new Date(Date.now() + restDuration * 1000).toISOString();
             } else {
                 nextSession.isResting = false; nextSession.restDurationSeconds = 0; nextSession.restEndTime = null;
             }

             if (nextSession.status === 'in-progress' && !nextSession.isResting) {
                 const upcomingExercise = nextSession.exercises[nextSession.currentExerciseIndex];
                 if (upcomingExercise) { setCurrentReps(upcomingExercise.reps.toString()); setCurrentWeight(upcomingExercise.weight?.toString() ?? ''); }
                 else { console.error("Could not find upcoming exercise data."); setCurrentReps(''); setCurrentWeight(''); }
             } else if (nextSession.status !== 'in-progress') { setCurrentReps(''); setCurrentWeight(''); }

            console.log("Set completed, new session state:", nextSession);
            return nextSession;
        });
    }, [session, currentExercise, currentSetTarget, currentReps, currentWeight]);


    const handleSkipSet = useCallback(() => {
          if (!session || session.status !== 'in-progress' || !currentExercise || session.isResting) return;
          console.log("Skipping set:", session.currentSetIndex + 1);

         setSession(prevSession => {
             if (!prevSession) return null;
             const nextSession = JSON.parse(JSON.stringify(prevSession)) as ActiveWorkoutSession;
             const exerciseToUpdate = nextSession.exercises[nextSession.currentExerciseIndex];
             if (!exerciseToUpdate || nextSession.currentSetIndex >= exerciseToUpdate.loggedSets.length) { console.error("Error: Current set index is out of bounds on skip."); return prevSession; }

             exerciseToUpdate.loggedSets[nextSession.currentSetIndex] = { setIndex: nextSession.currentSetIndex, reps: 0, weight: 0, completedAt: new Date().toISOString() };
             const isLastSetOfExercise = nextSession.currentSetIndex >= exerciseToUpdate.sets - 1;
             const isLastExerciseOfWorkout = nextSession.currentExerciseIndex >= nextSession.exercises.length - 1;

             if (isLastSetOfExercise) {
                 if (isLastExerciseOfWorkout) { nextSession.status = 'completed'; nextSession.endTime = new Date().toISOString(); }
                 else { nextSession.currentExerciseIndex += 1; nextSession.currentSetIndex = 0; }
             } else { nextSession.currentSetIndex += 1; }

             nextSession.isResting = false; nextSession.restDurationSeconds = 0; nextSession.restEndTime = null;

             if (nextSession.status === 'in-progress') {
                 const nextExercise = nextSession.exercises[nextSession.currentExerciseIndex];
                 if (nextExercise) { setCurrentReps(nextExercise.reps.toString()); setCurrentWeight(nextExercise.weight?.toString() ?? ''); }
                 else { setCurrentReps(''); setCurrentWeight(''); }
             } else { setCurrentReps(''); setCurrentWeight(''); }
            return nextSession;
         });
     }, [session, currentExercise]);

     const handleFinishWorkout = useCallback(() => {
         if (!session) return;
         console.log("Finishing workout early");
         setSession(prev => prev ? { ...prev, status: 'completed', endTime: new Date().toISOString(), isResting: false, restEndTime: null } : null);
         setIsFinishAlertOpen(false);
     }, [session]);

    const handleSkipRest = useCallback(() => {
        setSession(prev => {
            if (!prev || !prev.isResting) return prev;
            const nextSession = { ...prev, isResting: false, restEndTime: null, restDurationSeconds: 0 };
             if (nextSession.status === 'in-progress') {
                const nextExercise = nextSession.exercises[nextSession.currentExerciseIndex];
                if (nextExercise) { setCurrentReps(nextExercise.reps.toString()); setCurrentWeight(nextExercise.weight?.toString() ?? ''); }
                else { setCurrentReps(''); setCurrentWeight(''); }
            }
            console.log("Rest skipped manually");
            return nextSession;
        });
        setRestTimeRemaining(0);
    }, []);


     // --- Render Logic ---
    if (isLoading) { return <div className="container mx-auto p-6 text-center">Loading Workout...</div>; }
    if (error) { return ( <div className="container mx-auto p-6 text-center text-destructive"> <p>{error}</p> <Button onClick={() => navigate('/start-workout', { replace: true })} className="mt-4"> Go Back </Button> </div> ); }
    if (session?.status === 'completed' && !isLoading) { return ( <div className="container mx-auto p-6 text-center"> <h2 className="text-xl font-semibold mb-4">Workout Session Complete!</h2> <p className="text-muted-foreground">Redirecting...</p> </div> ); }
    if (!session || !currentExercise || currentSetTarget === null) { return <div className="container mx-auto p-6 text-center">Preparing workout...</div>; }

    const totalSetsInWorkout = session.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completedSetsInWorkout = session.exercises.reduce((exSum, ex) => exSum + ex.loggedSets.filter(s => s.completedAt !== null).length, 0);
    const workoutProgress = totalSetsInWorkout > 0 ? Math.round((completedSetsInWorkout / totalSetsInWorkout) * 100) : 0;
    const restProgress = session.restDurationSeconds > 0 && session.isResting ? Math.max(0, Math.round(((session.restDurationSeconds - restTimeRemaining) / session.restDurationSeconds) * 100)) : 0;
    const formattedRestTime = formatTimeElapsed(restTimeRemaining);

    // --- Main JSX (No changes needed below this line from previous version) ---
    return (
        <div className="container relative mx-auto max-w-2xl p-4 md:p-6 space-y-6">
             {/* Rest Dialog */}
             <Dialog open={session.isResting} onOpenChange={(open) => !open && handleSkipRest()}>
                <DialogContent className="max-w-xs sm:max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader> <DialogTitle className="text-center text-2xl">Rest</DialogTitle> </DialogHeader>
                    <div className="flex flex-col items-center justify-center p-6 space-y-4">
                        <div className="text-6xl font-bold tabular-nums text-primary"> {formattedRestTime} </div>
                         <Progress value={restProgress} className="w-full h-2" />
                         <div className="text-sm text-muted-foreground"> Total Rest: {session.restDurationSeconds}s </div>
                    </div>
                    <DialogFooter> <Button variant="secondary" onClick={handleSkipRest} className="w-full"> <SkipForward className="mr-2 h-4 w-4" /> Skip Rest </Button> </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Header */}
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{session.workoutName}</h1>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <Timer className="h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold tabular-nums"> {formatTimeElapsed(elapsedTime)} </span>
                </div>
            </div>

            {/* Progress */}
            <div className="mb-2">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Overall Progress</span>
                    <span>({completedSetsInWorkout}/{totalSetsInWorkout} sets)</span>
                </div>
                <Progress value={workoutProgress} className="w-full h-2" />
            </div>

            {/* Current Exercise Card */}
            <Card className={`border border-border ${session.isResting ? 'opacity-75 pointer-events-none' : ''}`}>
                 <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <CardDescription>Exercise {session.currentExerciseIndex + 1} / {session.exercises.length}</CardDescription>
                            <CardTitle className="text-xl md:text-2xl">{currentExercise.name}</CardTitle>
                        </div>
                        <div className='text-right flex-shrink-0'>
                            <p className="text-lg font-semibold">Set {session.currentSetIndex + 1} / {currentExercise.sets}</p>
                            <p className="text-sm text-muted-foreground">Target: {currentSetTarget.reps} reps @ {currentSetTarget.weight ?? 0} kg/lb</p>
                        </div>
                    </div>
                </CardHeader>
                 <CardContent className="space-y-4 pt-4">
                     <div className="grid grid-cols-2 gap-4 sm:gap-6 items-end">
                        <div className="space-y-1">
                            <Label htmlFor="currentReps" className="text-center block text-sm font-medium">Reps</Label>
                            <Input id="currentReps" name="currentReps" type="number" inputMode='numeric' placeholder={currentSetTarget.reps.toString()} value={currentReps} onChange={(e) => setCurrentReps(e.target.value)} className="text-center text-xl font-semibold h-12" disabled={session.isResting || session.status !== 'in-progress'} aria-label={`Reps for ${currentExercise.name}, set ${session.currentSetIndex + 1}`} />
                        </div>
                        <div className="space-y-1">
                             <Label htmlFor="currentWeight" className="text-center block text-sm font-medium">Weight (kg/lb)</Label>
                             <Input id="currentWeight" name="currentWeight" type="number" inputMode='decimal' step="0.5" placeholder={currentSetTarget.weight?.toString() ?? '0'} value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} className="text-center text-xl font-semibold h-12" disabled={session.isResting || session.status !== 'in-progress'} aria-label={`Weight for ${currentExercise.name}, set ${session.currentSetIndex + 1}`} />
                        </div>
                    </div>
                </CardContent>
                 <CardFooter className="flex flex-col items-center space-y-3 pt-6">
                     <Button size="lg" className="w-full max-w-xs bg-green-600 hover:bg-green-700 text-white" onClick={handleCompleteSet} disabled={session.isResting || session.status !== 'in-progress'} > <CheckCircle className="mr-2 h-5 w-5" /> Complete Set {session.currentSetIndex + 1} </Button>
                     <Button variant="ghost" className="w-full max-w-xs text-muted-foreground hover:text-foreground" onClick={handleSkipSet} disabled={session.isResting || session.status !== 'in-progress'} > <SkipForward className="mr-2 h-4 w-4" /> Skip Set </Button>
                 </CardFooter>
            </Card>

            {/* Completed Sets */}
            {currentExercise.loggedSets.filter(s => s.completedAt && s.setIndex < session.currentSetIndex).length > 0 && (
                <div className="space-y-2 pt-4">
                    <h3 className="text-base font-medium text-muted-foreground mb-2">Completed Sets</h3>
                    {currentExercise.loggedSets
                        .filter(set => set.completedAt && set.setIndex < session.currentSetIndex)
                        .map((set) => (
                            <div key={set.setIndex} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded-md">
                                <span>Set {set.setIndex + 1}:</span>
                                <span className="font-medium">{set.reps ?? 'N/A'} reps @ {set.weight ?? 'N/A'} kg/lb</span>
                            </div>
                        ))}
                </div>
            )}

            {/* Next Exercise */}
             {session.currentExerciseIndex < session.exercises.length - 1 && (
                 <Card className="border-dashed border-muted-foreground/30 bg-transparent shadow-none">
                    <CardHeader className='pb-2 pt-3'>
                        <CardDescription>Next Up:</CardDescription>
                        <CardTitle className='text-lg font-medium'>{session.exercises[session.currentExerciseIndex + 1].name}</CardTitle>
                    </CardHeader>
                     <CardContent className='text-sm text-muted-foreground pb-3'>
                         {session.exercises[session.currentExerciseIndex + 1].sets} sets x {session.exercises[session.currentExerciseIndex + 1].reps} reps
                     </CardContent>
                 </Card>
             )}

             {/* Finish Button & Dialog */}
            <div className="pt-8 text-center">
                 <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={session.status !== 'in-progress'} onClick={() => setIsFinishAlertOpen(true)}> <XCircle className='mr-2 h-5 w-5'/> Finish Workout Early </Button>
                 <AlertDialog open={isFinishAlertOpen} onOpenChange={setIsFinishAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader> <AlertDialogTitle>Finish Workout?</AlertDialogTitle> <AlertDialogDescription> Are you sure you want to end this workout session now? Progress will be saved up to the last completed set. </AlertDialogDescription> </AlertDialogHeader>
                        <AlertDialogFooter> <AlertDialogCancel>Cancel</AlertDialogCancel> <AlertDialogAction onClick={handleFinishWorkout} className="bg-destructive hover:bg-destructive/90"> Finish Workout </AlertDialogAction> </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}