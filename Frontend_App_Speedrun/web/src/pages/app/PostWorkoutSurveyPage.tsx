// src/pages/app/PostWorkoutSurveyPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Can be used for notes or a styled textarea
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft } from 'lucide-react';

// Define types for survey responses for better type safety
type WorkoutFeeling = 'easy' | 'moderate' | 'hard' | '';
type EnergyLevel = '1' | '2' | '3' | '4' | '5' | ''; // Storing as string initially from RadioGroup

export function PostWorkoutSurveyPage() {
  const navigate = useNavigate();
  const [feeling, setFeeling] = useState<WorkoutFeeling>('');
  const [energy, setEnergy] = useState<EnergyLevel>('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (!feeling) {
      setError('Please select how the workout felt.');
      setIsLoading(false);
      console.warn('Survey submission failed: Feeling is required.');
      return;
    }
    if (!energy) {
      setError('Please rate your energy level.');
      setIsLoading(false);
      console.warn('Survey submission failed: Energy level is required.');
      return;
    }

    const surveyData = {
      feeling,
      energy: parseInt(energy, 10), // Convert energy to number for submission
      notes,
      submittedAt: new Date().toISOString(),
    };

    console.log('Submitting post-workout survey:', surveyData);

    // Simulate API call
    // In a real app, you would have:
    // try {
    //   const response = await fetch('/api/submit-survey', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(surveyData),
    //   });
    //   if (!response.ok) throw new Error('Survey submission failed');
    //   // Handle success
    // } catch (err) {
    //   setError(err.message);
    // }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    setIsLoading(false);
    console.log('Survey submitted successfully (simulated).');
    
    // Navigate to the workouts page after successful submission
    navigate('/workouts'); // Or '/dashboard' or any other appropriate page
  };
  
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="container mx-auto max-w-xl p-4 py-8 relative"> {/* Added relative for absolute positioning of back button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 md:left-2" // Adjust positioning as needed
        onClick={handleBackClick}
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      {/* Wrap Card with a form element */}
      <form onSubmit={handleSubmit}>
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold pt-8 sm:pt-0">Post-Workout Survey</CardTitle> {/* Add padding top if back button overlaps */}
            <CardDescription>Tell us how your workout went!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Workout Feeling */}
            <div className="space-y-2">
              <Label htmlFor="feeling-group">1. How did the workout feel overall?</Label>
              <RadioGroup
                id="feeling-group" // Changed ID to avoid conflict with items
                value={feeling}
                onValueChange={(value: string) => setFeeling(value as WorkoutFeeling)}
                className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4 pt-1"
                aria-required="true"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="feeling-easy" />
                  <Label htmlFor="feeling-easy" className="font-normal">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moderate" id="feeling-moderate" />
                  <Label htmlFor="feeling-moderate" className="font-normal">Moderate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="feeling-hard" />
                  <Label htmlFor="feeling-hard" className="font-normal">Hard</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Energy Level */}
            <div className="space-y-2">
              <Label htmlFor="energy-group">2. Rate your energy levels post-workout (1=Low, 5=High):</Label>
              <RadioGroup
                id="energy-group" // Changed ID
                value={energy}
                onValueChange={(value: string) => setEnergy(value as EnergyLevel)}
                className="flex flex-wrap gap-x-4 gap-y-2 pt-1"
                aria-required="true"
              >
                {(['1', '2', '3', '4', '5'] as EnergyLevel[]).map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <RadioGroupItem value={level} id={`energy-${level}`} />
                    <Label htmlFor={`energy-${level}`} className="font-normal">{level}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">3. Any specific notes about your workout? (Optional)</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Felt strong on bench, struggled with last set of squats..."
                disabled={isLoading}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive text-center">{error}</p>}
          </CardContent>
          <CardFooter className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Submitting...' : 'Submit Survey'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default PostWorkoutSurveyPage;