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

// --- Dummy Template Data ---
const workoutTemplates = {
  barbell: [
    { id: "b1", name: "Day 1", exercises: ["Bench Press", "Squat", "Deadlift"] },
    { id: "b2", name: "Day 2", exercises: ["Incline Bench Press", "Front Squat", "Romanian Deadlift"] },
    { id: "b3", name: "Day 3", exercises: ["Bench Press", "Squat", "Deadlift"] },
    { id: "b4", name: "Day 4", exercises: ["Incline Bench Press", "Front Squat", "Romanian Deadlift"] },
  ],
  bodyweight: [
    { id: "bwA", name: "Day A", exercises: ["Pull Up", "Decline Push Up", "Bodyweight Row"] },
    { id: "bwB", name: "Day B", exercises: ["Chin Up", "Tricep Dip", "Underhand Bodyweight Row"] },
    { id: "bwC", name: "Day C", exercises: ["Placeholder..."] },
    { id: "bwD", name: "Day D", exercises: ["Placeholder..."] },
  ],
};
// --- End Dummy Data ---

export function StartWorkoutPage() {
  const navigate = useNavigate(); // Initialize navigate

  const handleStartBlank = () => {
    console.log("Starting Blank Workout");
    // Use navigate for actual routing
    navigate('/create-workout'); // Example path to a blank workout creator page
    // alert("Navigate to blank workout screen (TODO)"); // Remove alert
  };

  const handleSelectTemplate = (templateId: string, category: string) => {
    console.log(`Selected Template: ${templateId} from ${category}`);
    // Use navigate for actual routing, potentially passing template info
    navigate(`/active-workout?template=${templateId}`); // Example path to workout screen with template
    // alert(`Navigate to workout screen with template ${templateId} (TODO)`); // Remove alert
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
            {workoutTemplates.barbell.map((template) => (
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
             {workoutTemplates.bodyweight.map((template) => (
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

export default StartWorkoutPage;