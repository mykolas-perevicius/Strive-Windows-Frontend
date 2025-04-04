// src/pages/CreateProfilePage.tsx
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export function CreateProfilePage() {
  const navigate = useNavigate();

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const profileData = {
      name: formData.get('name'),
      age: formData.get('age'),
      height: formData.get('height'),
      weight: formData.get('weight'),
    };
    console.log("Profile submitted:", profileData);
    // TODO: Add actual API call to save profile
    console.log("Profile created (dummy), navigating to dashboard...");
    navigate('/dashboard');
  };

  const handleSkip = () => {
    console.log("Profile creation skipped, navigating to dashboard...");
    // TODO: Maybe mark profile as skipped in backend?
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create Profile</CardTitle>
          <CardDescription>
            Enter your details below. You can skip this step.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleProfileSubmit}>
          <CardContent className="space-y-4">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Name Here..."
                autoComplete="name"
              />
            </div>
            {/* Age Input */}
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="Enter Age Here..."
                min="0"
              />
            </div>
            {/* Height Input */}
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                placeholder="Enter Height Here..."
                min="0"
                step="0.1"
              />
            </div>
            {/* Weight Input */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                placeholder="Enter Weight Here..."
                min="0"
                step="0.1"
              />
            </div>
          </CardContent>
          {/* Updated Footer Layout: Stacked on mobile, row on sm+, Enter button pushed right */}
          <CardFooter className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end sm:space-x-2">
             {/* Skip Button: Outline variant, type="button" to prevent form submission */}
             <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleSkip}>
              Skip
            </Button>
            {/* Enter Button: Default variant, type="submit" for form submission */}
            <Button type="submit" className="w-full sm:w-auto">
              Enter
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default CreateProfilePage;