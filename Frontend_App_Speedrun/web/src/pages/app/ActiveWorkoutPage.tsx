// src/pages/app/ActiveWorkoutPage.tsx

// Removed unused React import
import { useState, useEffect, useMemo, useCallback } from 'react';
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
import React from 'react';

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
                id: `${templateId}-ex${index}-${crypto.randomUUID()}`, name: exName,
                sets: 3, reps: 10, weight: 50, restTimeSeconds: 60, // Placeholders
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
                 setCurrentWeight(firstExercise.weight?.toString() ?? '0');
            }
        } else { setError(`Failed to load workout data.${templateId ? ' Template not found.' : ''}`); }
        setIsLoading(false);
    }, [templateId, navigate]);

    // --- useEffect for overall workout timer ---
     useEffect(() => {
        if (!session || session.status !== 'in-progress') return;
        const timerInterval = setInterval(() => {
            if (session.startTime) {
                const start = new Date(session.startTime).getTime();
                const now = new Date().getTime();
                setElapsedTime(Math.floor((now - start) / 1000));
            }
        }, 1000);
        return () => clearInterval(timerInterval);
    }, [session]);

    // --- useEffect for Rest Timer Logic ---
    useEffect(() => {
        if (!session?.isResting || !session.restEndTime) {
            setRestTimeRemaining(0);
            return;
        }
        const endTimeMs = new Date(session.restEndTime).getTime();
        const nowMs = Date.now();
        const initialRemaining = Math.max(0, Math.ceil((endTimeMs - nowMs) / 1000));
        setRestTimeRemaining(initialRemaining);

        if (initialRemaining <= 0) {
             setSession(prev => prev ? { ...prev, isResting: false, restEndTime: null, restDurationSeconds: 0 } : null);
             return;
        }
        const intervalId = setInterval(() => {
            // Ensure restEndTime is still valid within the interval callback
            if (!sessionRef.current?.restEndTime) {
                clearInterval(intervalId);
                return;
            }
            const currentEndTimeMs = new Date(sessionRef.current.restEndTime).getTime();
            const currentNowMs = Date.now();
            const remaining = Math.max(0, Math.ceil((currentEndTimeMs - currentNowMs) / 1000));

            setRestTimeRemaining(remaining);

            if (remaining <= 0) {
                clearInterval(intervalId);
                 setSession(prev => prev ? { ...prev, isResting: false, restEndTime: null, restDurationSeconds: 0 } : null);
                 console.log("Rest finished!");
            }
        }, 500);
        return () => clearInterval(intervalId);
    // Use a ref to access the latest session state inside the interval without causing re-runs
     
    }, [session?.isResting, session?.restEndTime]);

    // Use a ref to keep track of the latest session state for the interval timer
    const sessionRef = React.useRef(session);
    useEffect(() => {
        sessionRef.current = session;
    }, [session]);


    // --- useMemo hooks ---
    const currentExercise = useMemo(() => {
         if (!session || session.currentExerciseIndex >= session.exercises.length) return null;
         return session.exercises[session.currentExerciseIndex];
    }, [session]);
    const currentSetTarget = useMemo(() => {
         if (!session || !currentExercise || session.currentSetIndex >= currentExercise.sets) return null;
         return { reps: currentExercise.reps, weight: currentExercise.weight };
    }, [currentExercise, session]);


    // --- Event Handlers ---
    const handleCompleteSet = () => {
        if (!session || session.status !== 'in-progress' || !currentExercise || currentSetTarget === null) return;
        const repsCompleted = parseInt(currentReps, 10);
        const weightUsed = parseFloat(currentWeight);
        if (isNaN(repsCompleted) || repsCompleted < 0) { console.warn("Invalid reps"); return; }
        if (isNaN(weightUsed) || weightUsed < 0) { console.warn("Invalid weight"); return; }

        setSession(prevSession => {
            if (!prevSession) return null;
            const nextSession = JSON.parse(JSON.stringify(prevSession)) as ActiveWorkoutSession;
            const exerciseJustCompleted = nextSession.exercises[nextSession.currentExerciseIndex];

            if (!exerciseJustCompleted || nextSession.currentSetIndex >= exerciseJustCompleted.loggedSets.length) { console.error("Index out of bounds"); return prevSession; }

            exerciseJustCompleted.loggedSets[nextSession.currentSetIndex] = {
                setIndex: nextSession.currentSetIndex, reps: repsCompleted, weight: weightUsed, completedAt: new Date().toISOString(),
            };

            const isLastSet = nextSession.currentSetIndex >= exerciseJustCompleted.sets - 1;
            const isLastExercise = nextSession.currentExerciseIndex >= nextSession.exercises.length - 1;
            let shouldStartRest = false;
            let restDuration = 0;

            if (isLastSet) {
                if (isLastExercise) {
                    nextSession.status = 'completed'; nextSession.endTime = new Date().toISOString(); console.log("Workout Completed!");
                } else {
                    nextSession.currentExerciseIndex += 1; nextSession.currentSetIndex = 0;
                    restDuration = exerciseJustCompleted.restTimeSeconds ?? 60;
                    shouldStartRest = restDuration > 0;
                    console.log(`Starting rest for ${restDuration}s after ${exerciseJustCompleted.name}`);
                }
            } else {
                nextSession.currentSetIndex += 1;
                 restDuration = exerciseJustCompleted.restTimeSeconds ?? 60;
                 shouldStartRest = restDuration > 0;
                 console.log(`Starting ${restDuration}s rest between sets`);
            }

            if (shouldStartRest) {
                nextSession.isResting = true;
                nextSession.restDurationSeconds = restDuration;
                nextSession.restEndTime = new Date(Date.now() + restDuration * 1000).toISOString();
            } else {
                 nextSession.isResting = false; nextSession.restDurationSeconds = 0; nextSession.restEndTime = null;
            }

            if (nextSession.status === 'in-progress' && !nextSession.isResting) {
                const nextExercise = nextSession.exercises[nextSession.currentExerciseIndex];
                if (nextExercise) {
                    setCurrentReps(nextExercise.reps.toString()); setCurrentWeight(nextExercise.weight?.toString() ?? '0');
                } else { console.error("Could not find next exercise"); setCurrentReps(''); setCurrentWeight(''); }
            } else if (nextSession.status !== 'in-progress') {
                 setCurrentReps(''); setCurrentWeight('');
            }
            console.log("Set completed, new session state:", nextSession);
            return nextSession;
        });
    };

    const handleSkipSet = () => {
          if (!session || session.status !== 'in-progress' || !currentExercise || currentSetTarget === null) return;
          console.log("Skipping set:", session.currentSetIndex + 1);
        setSession(prevSession => {
             if (!prevSession || prevSession.isResting) return prevSession;
             const nextSession = JSON.parse(JSON.stringify(prevSession)) as ActiveWorkoutSession;
             const exerciseToUpdate = nextSession.exercises[nextSession.currentExerciseIndex];
             if (!exerciseToUpdate || nextSession.currentSetIndex >= exerciseToUpdate.loggedSets.length) { console.error("Index out of bounds on skip"); return prevSession; }

             exerciseToUpdate.loggedSets[nextSession.currentSetIndex] = {
                setIndex: nextSession.currentSetIndex, reps: 0, weight: 0, completedAt: new Date().toISOString(),
            };
             const isLastSet = nextSession.currentSetIndex >= exerciseToUpdate.sets - 1;
             const isLastExercise = nextSession.currentExerciseIndex >= nextSession.exercises.length - 1;

             if (isLastSet) {
                 if (isLastExercise) { nextSession.status = 'completed'; nextSession.endTime = new Date().toISOString(); }
                 else { nextSession.currentExerciseIndex += 1; nextSession.currentSetIndex = 0; }
             } else { nextSession.currentSetIndex += 1; }

             nextSession.isResting = false; nextSession.restDurationSeconds = 0; nextSession.restEndTime = null;

             if (nextSession.status === 'in-progress') {
                 const nextExercise = nextSession.exercises[nextSession.currentExerciseIndex];
                 if (nextExercise) { setCurrentReps(nextExercise.reps.toString()); setCurrentWeight(nextExercise.weight?.toString() ?? '0'); }
                 else { setCurrentReps(''); setCurrentWeight(''); }
             } else { setCurrentReps(''); setCurrentWeight(''); }
            return nextSession;
         });
    };

     const handleFinishWorkout = () => {
         if (!session) return;
         console.log("Finishing workout early");
         setSession(prev => prev ? { ...prev, status: 'completed', endTime: new Date().toISOString(), isResting: false, restEndTime: null } : null);
         setIsFinishAlertOpen(false);
         navigate('/start-workout', { replace: true });
     };

    const handleSkipRest = useCallback(() => {
        setSession(prev => {
            if (!prev || !prev.isResting) return prev;
            const nextSession = { ...prev, isResting: false, restEndTime: null, restDurationSeconds: 0 };
             if (nextSession.status === 'in-progress') {
                const nextExercise = nextSession.exercises[nextSession.currentExerciseIndex];
                if (nextExercise) {
                    setCurrentReps(nextExercise.reps.toString());
                    setCurrentWeight(nextExercise.weight?.toString() ?? '0');
                } else { setCurrentReps(''); setCurrentWeight(''); }
            }
            console.log("Rest skipped manually");
            return nextSession;
        });
        setRestTimeRemaining(0);
    }, []);


     // --- Render Logic ---
    if (isLoading) { return <div className="container mx-auto p-4 text-center">Loading Workout...</div>; }
    if (error) { return ( <div className="container mx-auto p-4 text-center text-destructive"> <p>{error}</p> <Button onClick={() => navigate('/start-workout', { replace: true })} className="mt-4"> Go Back </Button> </div> ); }
    if (!session || session.status === 'completed') { return ( <div className="container mx-auto p-4 text-center"> <h2 className="text-xl font-semibold mb-4">Workout Session Ended</h2> <Button onClick={() => navigate('/start-workout', { replace: true })} className="mt-4"> Start New Workout </Button> </div> ); }
    if (!currentExercise || currentSetTarget === null) { return <div className="container mx-auto p-4">Error displaying workout state.</div>; }


    const totalSetsInWorkout = session.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completedSetsInWorkout = session.exercises.reduce((exSum, ex) => exSum + ex.loggedSets.filter(s => s.completedAt !== null).length, 0);
    const workoutProgress = totalSetsInWorkout > 0 ? (completedSetsInWorkout / totalSetsInWorkout) * 100 : 0;
    const restProgress = session.restDurationSeconds > 0
        ? ((session.restDurationSeconds - restTimeRemaining) / session.restDurationSeconds) * 100
        : 0;
    const formattedRestTime = formatTimeElapsed(restTimeRemaining);


    return (
        <div className="container relative mx-auto p-4 md:p-6 space-y-6">
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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">{session.workoutName}</h1>
                <div className="flex items-center space-x-2"> <Timer className="h-5 w-5 text-primary" /> <span className="text-lg font-semibold tabular-nums"> {formatTimeElapsed(elapsedTime)} </span> </div>
            </div>
            {/* Progress */}
            <div>
                <Label className="text-sm text-muted-foreground">Overall Progress ({completedSetsInWorkout}/{totalSetsInWorkout} sets)</Label> <Progress value={workoutProgress} className="w-full h-2 mt-1" />
            </div>
            {/* Current Exercise Card */}
            <Card className={`border-primary shadow-md ${session.isResting ? 'opacity-75' : ''}`}>
                <CardHeader>
                    <div className="flex justify-between items-start"> <div> <CardDescription>Exercise {session.currentExerciseIndex + 1} / {session.exercises.length}</CardDescription> <CardTitle className="text-xl md:text-2xl">{currentExercise.name}</CardTitle> </div> </div>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className='text-center mb-4'> <p className="text-lg font-semibold">Set {session.currentSetIndex + 1} / {currentExercise.sets}</p> <p className="text-sm text-muted-foreground">Target: {currentExercise.reps} reps @ {currentExercise.weight} kg/lb</p> </div>
                     <div className="grid grid-cols-2 gap-4 items-end">
                        <div> <Label htmlFor="currentReps" className="text-center block">Reps</Label> <Input id="currentReps" name="currentReps" type="number" inputMode='numeric' placeholder={currentExercise.reps.toString()} value={currentReps} onChange={(e) => setCurrentReps(e.target.value)} className="text-center text-xl font-semibold h-12" disabled={session.isResting || session.status !== 'in-progress'} /> </div>
                        <div> <Label htmlFor="currentWeight" className="text-center block">Weight (kg/lb)</Label> <Input id="currentWeight" name="currentWeight" type="number" inputMode='decimal' step="0.5" placeholder={currentExercise.weight?.toString() ?? '0'} value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} className="text-center text-xl font-semibold h-12" disabled={session.isResting || session.status !== 'in-progress'} /> </div>
                    </div>
                </CardContent>
                 <CardFooter className="flex flex-col space-y-3 pt-6">
                     <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleCompleteSet} disabled={session.isResting || session.status !== 'in-progress'}> <CheckCircle className="mr-2 h-5 w-5" /> Complete Set {session.currentSetIndex + 1} </Button>
                     <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground" onClick={handleSkipSet} disabled={session.isResting || session.status !== 'in-progress'}> <SkipForward className="mr-2 h-4 w-4" /> Skip Set </Button>
                 </CardFooter>
            </Card>

            {/* Completed Sets */}
            {/* --- Corrected conditional render --- */}
            {currentExercise.loggedSets.filter(s => s.completedAt).length > 0 && (
                <div className="space-y-2 pt-4">
                    <h3 className="text-base font-medium text-muted-foreground mb-2">Completed Sets</h3>
                    {currentExercise.loggedSets
                        .filter(set => set.completedAt)
                        .map((set) => (
                            <div key={set.setIndex} className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded-md">
                                <span>Set {set.setIndex + 1}:</span>
                                <span className="font-medium">{set.reps ?? 'N/A'} reps @ {set.weight ?? 'N/A'} kg/lb</span>
                            </div>
                        ))}
                </div>
            )}

            {/* Next Exercise */}
             {/* --- Corrected conditional render --- */}
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
            <div className="pt-6 text-center">
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