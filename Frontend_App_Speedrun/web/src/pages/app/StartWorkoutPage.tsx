// src/pages/app/StartWorkoutPage.tsx (Updated Example)

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { workoutTemplates } from "@/data/dummyWorkouts"; // your dummy structure
import { PlusCircle } from "lucide-react";
import type { WorkoutTemplate } from "@/types/workout";

export function StartWorkoutPage() {
  const navigate = useNavigate();

  // Local state for user-created templates
  const [userTemplates, setUserTemplates] = useState<WorkoutTemplate[]>([]);

  useEffect(() => {
    // Load user templates from localStorage
    try {
      const saved = localStorage.getItem("savedWorkoutTemplates");
      if (saved) {
        const parsed = JSON.parse(saved) as WorkoutTemplate[];
        setUserTemplates(parsed);
      }
    } catch (error) {
      console.warn("Failed to load user templates:", error);
    }
  }, []);

  // We'll assume `workoutTemplates` is an object like:
  // {
  //   upper: [ ... ],
  //   lower: [ ... ],
  //   ...
  // }
  // We'll also add a special "User Created" category for any new ones
  const userCategory = {
    name: "User Created",
    templates: userTemplates.map((tpl) => ({
      id: tpl.id,
      name: tpl.name,
        exercises: tpl.exercises.map((ex) => ex.name), // ex is already a string
    })),
  };

  // Convert the dummy object into a list of categories
  const templateCategories = Object.entries(workoutTemplates).map(
    ([catName, catTemplates]) => ({
      name: catName, // e.g., "upper", "lower"
      templates: catTemplates.map((tpl) => ({
        id: tpl.id,
        name: tpl.name,
        exercises: tpl.exercises.map((ex) => ex), // ex is already a string
      })),
    })
  );

  // Optionally, add our userCategory to the array, so user templates appear last
  templateCategories.push(userCategory);

  function handleStartBlank() {
    console.log("Navigating to create blank workout page");
    navigate("/app/workouts/new");
  }

  function handleSelectTemplate(templateId: string, categoryName: string) {
    console.log(`Selected Template: ${templateId} from ${categoryName}`);
    navigate(`/app/active-workout?template=${templateId}`);
  }

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-6 space-y-8">
      <Card className="text-center border-dashed hover:border-primary transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            <span>Start Fresh</span>
          </CardTitle>
          <CardDescription>Begin a new workout without a template.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" onClick={handleStartBlank} className="w-full max-w-xs">
            Start Blank Workout
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <h1 className="text-2xl font-bold text-center sm:text-left">Or Choose a Template</h1>

      {templateCategories.map((category) => (
        <Card key={category.name} className="mt-4">
          <CardHeader>
            <CardTitle className="text-xl capitalize">{category.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {category.templates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="h-auto p-4 text-left"
                    onClick={() => handleSelectTemplate(template.id, category.name)}
                  >
                    <div className="flex flex-col w-full">
                      <span className="font-semibold mb-1 truncate">{template.name}</span>
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {template.exercises.join(", ")}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No {category.name.toLowerCase()} templates found.
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
