// src/pages/app/CreateWorkoutPage.tsx

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExerciseDetail, NewExerciseFormData, WorkoutTemplate } from '@/types/workout'; // Adjust path if needed
import { commonExercises } from '@/data/exercises'; // Import exercise data
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Import Popover
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"; // Import Command components
import { cn } from "@/lib/utils"; // Import cn utility
import { Check, ChevronsUpDown, PlusCircle, Trash2 } from 'lucide-react';

// Initial state for the new exercise form (name will be handled separately)
const initialNewExerciseState: Omit<NewExerciseFormData, 'name'> = {
  weight: 0,
  reps: 0,
  sets: 0,
  restTimeSeconds: 60, // Default rest time
};

export function CreateWorkoutPage() {
  const [workoutName, setWorkoutName] = useState<string>('');
  const [exercises, setExercises] = useState<ExerciseDetail[]>([]);

  // State for the "Add Exercise" form fields (excluding name)
  const [newExerciseDetails, setNewExerciseDetails] = useState<Omit<NewExerciseFormData, 'name'>>(initialNewExerciseState);
  // State specifically for the Combobox
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedExerciseValue, setSelectedExerciseValue] = useState<string>(""); // Store the 'value' (e.g., 'bench-press')

  // Handler for input changes in the numerical fields
  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewExerciseDetails(prev => ({
      ...prev,
      [name]: Number(value) || 0, // Ensure conversion for number inputs
    }));
  };

  // Handler to add the exercise from the form to the list
  const handleAddExercise = () => {
    const selectedExercise = commonExercises.find(ex => ex.value === selectedExerciseValue);

    // Basic validation
    if (!selectedExercise || newExerciseDetails.sets <= 0 || newExerciseDetails.reps <= 0) {
      console.warn('Please select an exercise and fill in Sets and Reps.');
      // TODO: Add user feedback (toast notification)
      return;
    }

    const exerciseToAdd: ExerciseDetail = {
      id: crypto.randomUUID(),
      name: selectedExercise.label, // Use the label for display in the list
      weight: newExerciseDetails.weight,
      reps: newExerciseDetails.reps,
      sets: newExerciseDetails.sets,
      restTimeSeconds: newExerciseDetails.restTimeSeconds,
    };

    setExercises(prev => [...prev, exerciseToAdd]);
    // Reset the form fields
    setNewExerciseDetails(initialNewExerciseState);
    setSelectedExerciseValue(""); // Reset combobox selection
  };

  // Handler to remove an exercise from the list
  const handleRemoveExercise = (idToRemove: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== idToRemove));
  };

  // Handler for saving the workout (dummy implementation)
  const handleSaveWorkout = () => {
    // ... (save logic remains the same) ...
    if (!workoutName.trim()) {
        console.warn('Please enter a workout name.');
        // Add user feedback
        return;
    }
     if (exercises.length === 0) {
        console.warn('Please add at least one exercise.');
        // Add user feedback
        return;
    }

    const newWorkout: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt'> = { // Simulate structure before saving
      name: workoutName.trim(),
      exercises: exercises,
    };

    console.log('Saving Workout:', newWorkout);
    setWorkoutName('');
    setExercises([]);
    setNewExerciseDetails(initialNewExerciseState);
    setSelectedExerciseValue("");
  };

  // Find the label of the currently selected exercise for the button display
  const selectedExerciseLabel = commonExercises.find(
      (exercise) => exercise.value === selectedExerciseValue
    )?.label;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Create New Workout</h1>

      {/* Workout Name Input */}
      <Card>
         {/* ... (CardHeader and CardContent for Workout Name remain the same) ... */}
         <CardHeader>
             <CardTitle>Workout Details</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="workoutName">Workout Name</Label>
              <Input
                id="workoutName"
                type="text"
                placeholder="e.g., Push Day, Leg Workout"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="max-w-lg"
              />
            </div>
         </CardContent>
      </Card>


      {/* Add Exercise Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Exercise</CardTitle>
          <CardDescription>Select an exercise and enter the details.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          {/* Exercise Name Combobox */}
          <div className="space-y-1 sm:col-span-2 md:col-span-1"> {/* Span more on small screens */}
            <Label>Exercise Name</Label>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full justify-between text-left font-normal" // Ensure text aligns left
                >
                  {selectedExerciseValue
                    ? selectedExerciseLabel
                    : "Select exercise..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0"> {/* Adjust width and height */}
                <Command>
                  <CommandInput placeholder="Search exercise..." />
                  <CommandList> {/* Ensures scrolling */}
                    <CommandEmpty>No exercise found.</CommandEmpty>
                    <CommandGroup>
                      {commonExercises.map((exercise) => (
                        <CommandItem
                          key={exercise.value}
                          value={exercise.value}
                          onSelect={(currentValue) => {
                            setSelectedExerciseValue(currentValue === selectedExerciseValue ? "" : currentValue);
                            setComboboxOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedExerciseValue === exercise.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {exercise.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Weight */}
          <div className="space-y-1">
            <Label htmlFor="weight">Weight (kg/lb)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              min="0"
              placeholder="e.g., 100"
              value={newExerciseDetails.weight}
              onChange={handleDetailChange} // Use the updated handler
            />
          </div>
          {/* Reps */}
          <div className="space-y-1">
            <Label htmlFor="reps">Reps</Label>
            <Input
              id="reps"
              name="reps"
              type="number"
              min="1"
              placeholder="e.g., 10"
              value={newExerciseDetails.reps}
              onChange={handleDetailChange} // Use the updated handler
            />
          </div>
          {/* Sets */}
          <div className="space-y-1">
            <Label htmlFor="sets">Sets</Label>
            <Input
              id="sets"
              name="sets"
              type="number"
              min="1"
              placeholder="e.g., 3"
              value={newExerciseDetails.sets}
              onChange={handleDetailChange} // Use the updated handler
            />
          </div>
          {/* Rest Time */}
          <div className="space-y-1">
            <Label htmlFor="restTimeSeconds">Rest Time (sec)</Label>
            <Input
              id="restTimeSeconds"
              name="restTimeSeconds"
              type="number"
              min="0"
              placeholder="e.g., 60"
              value={newExerciseDetails.restTimeSeconds}
              onChange={handleDetailChange} // Use the updated handler
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddExercise} className="ml-auto">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Exercise
          </Button>
        </CardFooter>
      </Card>

      {/* List of Added Exercises (No changes needed here) */}
      {exercises.length > 0 && (
         <Card>
             {/* ... CardHeader and CardContent remain the same ... */}
              <CardHeader>
                <CardTitle>Workout Exercises</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {exercises.map((ex, index) => (
                  <div key={ex.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="flex-1 space-y-1">
                       <p className="font-medium">{index + 1}. {ex.name}</p>
                       <p className="text-sm text-muted-foreground">
                            {ex.sets} sets x {ex.reps} reps @ {ex.weight} kg/lb, Rest: {ex.restTimeSeconds}s
                       </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExercise(ex.id)}
                      aria-label={`Remove ${ex.name}`}
                     >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </CardContent>
         </Card>
      )}

       {/* Save/Cancel Actions (No changes needed here) */}
       <div className="flex justify-end space-x-2 pt-4">
            {/* <Button variant="outline">Cancel</Button> */}
            <Button onClick={handleSaveWorkout} disabled={exercises.length === 0 || !workoutName.trim()}>
                Save Workout
            </Button>
       </div>
    </div>
  );
}