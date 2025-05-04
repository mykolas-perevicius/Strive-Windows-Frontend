/* ------------------------------------------------------------------------- */
/* ActiveWorkoutPage.tsx                                                     */
/* ------------------------------------------------------------------------- */
import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
  } from 'react';
  import { useLocation, useNavigate } from 'react-router-dom';
  
  import { Button } from '@/components/ui/button';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
  } from '@/components/ui/card';
  import { Label } from '@/components/ui/label';
  import { Progress } from '@/components/ui/progress';
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from '@/components/ui/dialog';
  import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
  } from '@/components/ui/alert-dialog';
  import { Minus, Plus, Timer, CheckCircle, SkipForward, XCircle } from 'lucide-react';
  
  import { workoutTemplates as dummyTemplates } from '@/data/dummyWorkouts';
  import { formatTimeElapsed } from '@/lib/utils';
  import type { ActiveExercise, ActiveWorkoutSession } from '@/types/workout';
  
  /* ------------------ helpers ------------------ */
  const clone = <T,>(o: T): T =>
    typeof structuredClone === 'function'
      ? structuredClone(o)
      : (JSON.parse(JSON.stringify(o)) as T);
  
  /* ------------------ dummy loader ------------- */
  const loadWorkoutSession = (templateId: string | null): ActiveWorkoutSession | null => {
    if (!templateId) return null;
    // find template
    let tpl: { id: string; name: string; exercises: string[] } | undefined;
    for (const c in dummyTemplates) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const arr = (dummyTemplates as any)[c];
      if (Array.isArray(arr)) {
        tpl = arr.find((t: { id: string }) => t.id === templateId);
        if (tpl) break;
      }
    }
    if (!tpl) return null;
  
    const exercises: ActiveExercise[] = tpl.exercises.map((name, i) => ({
      id: `${templateId}-ex${i}-${crypto.randomUUID()}`,
      name,
      sets: 3,
      reps: 10,
      weight: 50,
      restTimeSeconds: 60,
      loggedSets: Array.from({ length: 3 }, (_, j) => ({
        setIndex: j,
        reps: null,
        weight: null,
        completedAt: null,
      })),
    }));
  
    return {
      sessionId: crypto.randomUUID(),
      templateId,
      workoutName: tpl.name,
      exercises,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      startTime: new Date().toISOString(),
      endTime: null,
      status: 'in-progress',
      isResting: false,
      restDurationSeconds: 0,
      restEndTime: null,
    };
  };
  
  /* ------------------------------------------------------------------------- */
  /*  StepperInput – replaces text number fields                               */
  /* ------------------------------------------------------------------------- */
  type StepperProps = {
    value: number;
    min?: number;
    step?: number;
    disabled?: boolean;
    onChange: (n: number) => void;
  };
  
  function StepperInput({ value, onChange, min = 0, step = 1, disabled }: StepperProps) {
    const dec = () => onChange(Math.max(min, value - step));
    const inc = () => onChange(value + step);
  
    return (
      <div className="flex items-center justify-between border rounded-md h-12">
        <Button size="icon" variant="ghost" onClick={dec} disabled={disabled || value <= min}>
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-16 text-center text-lg tabular-nums">{value}</span>
        <Button size="icon" variant="ghost" onClick={inc} disabled={disabled}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  }
  
  /* ------------------------------------------------------------------------- */
  /*  ActiveWorkoutPage                                                        */
  /* ------------------------------------------------------------------------- */
  export function ActiveWorkoutPage() {
    const { search } = useLocation();
    const navigate = useNavigate();
    const templateId = new URLSearchParams(search).get('template');
  
    /* ---------- state ---------- */
    const [session, setSession] = useState<ActiveWorkoutSession | null>(null);
    const [reps, setReps] = useState(0);
    const [weight, setWeight] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [restLeft, setRestLeft] = useState(0);
    const [finishOpen, setFinishOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
  
    /* keep latest session for intervals */
    const sessRef = useRef(session);
    useEffect(() => {
      sessRef.current = session;
    }, [session]);
  
    /* ---------- mount: load session ---------- */
    useEffect(() => {
      setLoading(true);
      const s = loadWorkoutSession(templateId);
      if (!s) {
        setErr('Failed to load workout data.');
        setLoading(false);
        return;
      }
      setSession(s);
      setReps(s.exercises[0].reps);
      setWeight(s.exercises[0].weight);
      setLoading(false);
    }, [templateId]);
  
    /* ---------- workout timer ---------- */
    useEffect(() => {
      if (!session?.startTime) return;
      const id = setInterval(() => {
        setElapsed(Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000));
      }, 1000);
      return () => clearInterval(id);
    }, [session?.startTime]);
  
    /* ---------- rest countdown ---------- */
    useEffect(() => {
      if (!session?.isResting || !session.restEndTime) {
        setRestLeft(0);
        return;
      }
      const tick = () => {
        const s = sessRef.current;
        if (!s?.restEndTime) return;
        const remain = Math.max(
          0,
          Math.ceil((new Date(s.restEndTime).getTime() - Date.now()) / 1000),
        );
        setRestLeft(remain);
        if (remain === 0) {
          setSession((p) =>
            p ? { ...p, isResting: false, restEndTime: null, restDurationSeconds: 0 } : p,
          );
        }
      };
      tick();
      const id = setInterval(tick, 500);
      return () => clearInterval(id);
    }, [session?.isResting, session?.restEndTime]);
  
    /* ---------- derived exercise ---------- */
    const currentExercise = useMemo(
      () => session?.exercises[session.currentExerciseIndex] ?? null,
      [session],
    );
  
    /* ---------- helpers ---------- */
    const primeNext = useCallback(
      (d: ActiveWorkoutSession, rest: number) => {
        if (rest > 0) {
          d.isResting = true;
          d.restDurationSeconds = rest;
          d.restEndTime = new Date(Date.now() + rest * 1000).toISOString();
        } else {
          d.isResting = false;
          d.restDurationSeconds = 0;
          d.restEndTime = null;
        }
        const ex = d.exercises[d.currentExerciseIndex];
        setReps(ex.reps);
        setWeight(ex.weight);
      },
      [],
    );
  
    /* ---------- actions ---------- */
    const completeSet = () => {
      if (!session || !currentExercise) return;
      setSession((prev) => {
        if (!prev) return prev;
        const d = clone(prev);
        const ex = d.exercises[d.currentExerciseIndex];
  
        ex.loggedSets[d.currentSetIndex] = {
          setIndex: d.currentSetIndex,
          reps,
          weight,
          completedAt: new Date().toISOString(),
        };
  
        const lastSet = d.currentSetIndex === ex.sets - 1;
        const lastEx = d.currentExerciseIndex === d.exercises.length - 1;
  
        if (lastSet) {
          if (lastEx) {
            d.status = 'completed';
            d.endTime = new Date().toISOString();
          } else {
            d.currentExerciseIndex += 1;
            d.currentSetIndex = 0;
            primeNext(d, ex.restTimeSeconds ?? 60);
          }
        } else {
          d.currentSetIndex += 1;
          primeNext(d, ex.restTimeSeconds ?? 60);
        }
        return d;
      });
    };
  
    const skipSet = () => {
      if (!session || !currentExercise) return;
      setSession((prev) => {
        if (!prev) return prev;
        const d = clone(prev);
        const ex = d.exercises[d.currentExerciseIndex];
  
        ex.loggedSets[d.currentSetIndex] = {
          setIndex: d.currentSetIndex,
          reps: 0,
          weight: 0,
          completedAt: new Date().toISOString(),
        };
  
        const lastSet = d.currentSetIndex === ex.sets - 1;
        const lastEx = d.currentExerciseIndex === d.exercises.length - 1;
  
        if (lastSet) {
          if (lastEx) {
            d.status = 'completed';
            d.endTime = new Date().toISOString();
          } else {
            d.currentExerciseIndex += 1;
            d.currentSetIndex = 0;
          }
        } else {
          d.currentSetIndex += 1;
        }
  
        d.isResting = false;
        d.restDurationSeconds = 0;
        d.restEndTime = null;
  
        const nxt = d.exercises[d.currentExerciseIndex];
        setReps(nxt.reps);
        setWeight(nxt.weight);
        return d;
      });
    };
  
    const skipRest = () => {
      setSession((p) =>
        p ? { ...p, isResting: false, restEndTime: null, restDurationSeconds: 0 } : p,
      );
      setRestLeft(0);
    };
  
    const finishEarly = () => {
      if (!session) return;
      setSession({
        ...session,
        status: 'completed',
        endTime: new Date().toISOString(),
        isResting: false,
        restEndTime: null,
      });
      setFinishOpen(false);
      navigate('/start-workout', { replace: true });
    };
  
    /* ---------- guards ---------- */
    if (loading) return <div className="p-4 text-center">Loading…</div>;
    if (err || !session)
      return (
        <div className="p-4 text-center text-destructive">
          <p>{err ?? 'Unknown error.'}</p>
          <Button onClick={() => navigate('/start-workout', { replace: true })}>Go Back</Button>
        </div>
      );
    if (session.status === 'completed')
      return (
        <div className="p-4 text-center">
          <h2 className="text-xl font-semibold mb-4">Workout Session Ended</h2>
          <Button onClick={() => navigate('/start-workout', { replace: true })}>
            Start New Workout
          </Button>
        </div>
      );
    if (!currentExercise) return <div className="p-4">Error: exercise missing.</div>;
  
    /* ---------- progress calc ---------- */
    const totalSets = session.exercises.reduce((s, e) => s + e.sets, 0);
    const doneSets = session.exercises.reduce(
      (s, e) => s + e.loggedSets.filter((ls) => ls.completedAt).length,
      0,
    );
    const pctWorkout = (doneSets / totalSets) * 100;
    const pctRest =
      session.restDurationSeconds > 0
        ? ((session.restDurationSeconds - restLeft) / session.restDurationSeconds) * 100
        : 0;
  
    /* --------------------- JSX --------------------- */
    return (
      <div className="container relative mx-auto p-4 md:p-6 space-y-6">
        {/* Rest dialog */}
        <Dialog open={session.isResting} onOpenChange={() => {}}>
          <DialogContent onInteractOutside={(e) => e.preventDefault()} className="max-w-xs">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl">Rest</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 p-6">
              <div className="text-6xl font-bold tabular-nums text-primary">
                {formatTimeElapsed(restLeft)}
              </div>
              <Progress value={pctRest} className="w-full h-2" />
              <span className="text-sm text-muted-foreground">
                Total Rest: {session.restDurationSeconds}s
              </span>
            </div>
            <DialogFooter>
              <Button variant="secondary" className="w-full" onClick={skipRest}>
                <SkipForward className="mr-2 h-4 w-4" />
                Skip Rest
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{session.workoutName}</h1>
          <span className="flex items-center gap-1">
            <Timer className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold tabular-nums">
              {formatTimeElapsed(elapsed)}
            </span>
          </span>
        </div>
  
        {/* Overall progress */}
        <div>
          <Label className="text-sm text-muted-foreground">
            Overall Progress ({doneSets}/{totalSets} sets)
          </Label>
          <Progress value={pctWorkout} className="w-full h-2 mt-1" />
        </div>
  
        {/* --- CARD (with steppers) --- */}
        <Card className={session.isResting ? 'opacity-75' : ''}>
          <CardHeader>
            <CardDescription>
              Exercise {session.currentExerciseIndex + 1}/{session.exercises.length}
            </CardDescription>
            <CardTitle className="text-xl md:text-2xl">
              {currentExercise.name} <span className="text-xs text-primary ml-1">v‑stepper</span>
            </CardTitle>
          </CardHeader>
  
          <CardContent className="space-y-6">
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold">
                Set {session.currentSetIndex + 1}/{currentExercise.sets}
              </p>
              <p className="text-sm text-muted-foreground">
                Target: {currentExercise.reps} reps @ {currentExercise.weight} kg/lb
              </p>
            </div>
  
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="block text-center mb-1">Reps</Label>
                <StepperInput
                  value={reps}
                  onChange={setReps}
                  step={1}
                  min={0}
                  disabled={session.isResting}
                />
              </div>
              <div>
                <Label className="block text-center mb-1">Weight (kg/lb)</Label>
                <StepperInput
                  value={weight}
                  onChange={setWeight}
                  step={0.5}
                  min={0}
                  disabled={session.isResting}
                />
              </div>
            </div>
          </CardContent>
  
          <CardFooter className="flex flex-col gap-3 pt-4">
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={completeSet}
              disabled={session.isResting}
            >
              <CheckCircle className="mr-2 h-5 w-5" />
              Complete Set {session.currentSetIndex + 1}
            </Button>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={skipSet}
              disabled={session.isResting}
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Skip Set
            </Button>
          </CardFooter>
        </Card>
  
        {/* Completed sets list */}
        {currentExercise.loggedSets.some((ls) => ls.completedAt) && (
          <div className="space-y-2 pt-4">
            <h3 className="text-base font-medium text-muted-foreground mb-2">Completed Sets</h3>
            {currentExercise.loggedSets
              .filter((ls) => ls.completedAt)
              .map((ls) => (
                <div
                  key={ls.setIndex}
                  className="flex justify-between items-center text-sm p-2 bg-muted/50 rounded-md"
                >
                  <span>Set {ls.setIndex + 1}</span>
                  <span className="font-medium whitespace-nowrap">
                    {ls.reps ?? '—'} reps @ {ls.weight ?? '—'} kg/lb
                  </span>
                </div>
              ))}
          </div>
        )}
  
        {/* Next exercise preview */}
        {session.currentExerciseIndex < session.exercises.length - 1 && (
          <Card className="border-dashed shadow-none bg-transparent">
            <CardHeader className="pt-3 pb-2">
              <CardDescription>Next Up:</CardDescription>
              <CardTitle className="text-lg font-medium">
                {session.exercises[session.currentExerciseIndex + 1].name}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground pb-3">
              {session.exercises[session.currentExerciseIndex + 1].sets} sets x{' '}
              {session.exercises[session.currentExerciseIndex + 1].reps} reps
            </CardContent>
          </Card>
        )}
  
        {/* Finish early */}
        <div className="pt-6 text-center">
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setFinishOpen(true)}
          >
            <XCircle className="mr-2 h-5 w-5" />
            Finish Workout Early
          </Button>
  
          <AlertDialog open={finishOpen} onOpenChange={setFinishOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Finish Workout?</AlertDialogTitle>
                <AlertDialogDescription>
                  End session now? Progress will be saved up to the last completed set.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={finishEarly}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Finish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    );
  }
  