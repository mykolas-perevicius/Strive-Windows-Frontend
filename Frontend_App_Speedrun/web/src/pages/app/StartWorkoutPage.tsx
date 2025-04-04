// src/pages/app/StartWorkoutPage.tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription, // Added import
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { workoutTemplates } from "@/data/dummyWorkouts";
import { PlusCircle } from "lucide-react"; // Icon for blank workout

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

  // Group templates by category for easier rendering
  const templateCategories = Object.entries(workoutTemplates).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize category name
    templates: value || [] // Ensure templates is an array
  }));


  return (
    // Use a wider max-width, increased padding and main axis spacing
    <div className="container mx-auto max-w-4xl p-4 md:p-6 space-y-8">

      {/* Option 1: Start Blank - Made more prominent */}
      <Card className="text-center border-dashed hover:border-primary transition-colors">
          <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                 <PlusCircle className="h-5 w-5 text-primary"/>
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

      {/* Option 2: Templates Section */}
      <div className="space-y-8"> {/* Add spacing between template sections */}
        <h1 className="text-2xl font-bold text-center sm:text-left">Or Choose a Template</h1>

        {templateCategories.map((category) => (
          // Wrap each category in its own Card
          <Card key={category.name}>
            <CardHeader>
              {/* More prominent category title */}
              <CardTitle className="text-xl">{category.name}</CardTitle>
               {/* Optional: Add description if needed */}
               {/* <CardDescription>Pre-defined {category.name.toLowerCase()} routines.</CardDescription> */}
            </CardHeader>
            <CardContent>
              {category.templates.length > 0 ? (
                // Responsive grid for template buttons
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.templates.map((template) => (
                    <Button
                      key={template.id}
                      variant="outline"
                      // More padding, ensure height consistency, subtle hover
                      className="h-auto min-h-[80px] justify-start p-4 text-left flex flex-col items-start hover:bg-muted/50 transition-colors"
                      onClick={() => handleSelectTemplate(template.id, category.name.toLowerCase())}
                    >
                      {/* Ensure content takes full width */}
                      <div className="flex flex-col w-full">
                        <span className="font-semibold mb-1 truncate">{template.name}</span> {/* Truncate long names */}
                        <span className="text-xs text-muted-foreground line-clamp-2"> {/* Limit description lines */}
                          {template.exercises.join(', ')}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                  <p className="text-sm text-muted-foreground">No {category.name.toLowerCase()} templates available.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}