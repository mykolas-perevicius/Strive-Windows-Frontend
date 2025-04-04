// src/pages/app/StartWorkoutPage.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { workoutTemplates } from "@/data/dummyWorkouts"; // <--- Import from new file

// Dummy data moved to src/data/dummyWorkouts.ts

export function StartWorkoutPage() {
  const navigate = useNavigate();

  const handleStartBlank = () => {
    console.log("Navigating to create blank workout page");
    navigate('/app/workouts/new');
  };

  const handleSelectTemplate = (templateId: string, category: string) => {
    console.log(`Selected Template: ${templateId} from ${category}. Navigating...`);
    navigate(`/app/active-workout?template=${templateId}`);
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 space-y-8">
      {/* Option 1: Start Blank */}
      <div className="text-center">
        <Button size="lg" onClick={handleStartBlank} className="w-full max-w-xs">
          Start a Blank Workout
        </Button>
      </div>

      <Separator />

      {/* Option 2: Templates */}
      <div>
        <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">Templates</h1>

        {/* Barbell Templates */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Barbell</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* Check if workoutTemplates and barbell exist before mapping */}
            {workoutTemplates?.barbell?.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="h-auto justify-start p-4 text-left"
                onClick={() => handleSelectTemplate(template.id, 'barbell')}
              >
                <div className="flex flex-col">
                  <span className="font-semibold mb-1">{template.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {template.exercises.slice(0, 3).join(', ')}{template.exercises.length > 3 ? '...' : ''}
                  </span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Bodyweight Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Bodyweight</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
             {/* Check if workoutTemplates and bodyweight exist before mapping */}
             {workoutTemplates?.bodyweight?.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="h-auto justify-start p-4 text-left"
                 onClick={() => handleSelectTemplate(template.id, 'bodyweight')}
              >
                 <div className="flex flex-col">
                  <span className="font-semibold mb-1">{template.name}</span>
                  <span className="text-xs text-muted-foreground">
                     {template.exercises.slice(0, 3).join(', ')}{template.exercises.length > 3 ? '...' : ''}
                  </span>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}