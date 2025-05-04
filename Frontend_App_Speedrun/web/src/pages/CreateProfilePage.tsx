// src/pages/CreateProfilePage.tsx
import React, { useState } from 'react';
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

interface ProfileResponse {
    message?: string;
    error?: string;
}

// Define the structure of the data to be sent
interface ProfilePayload {
    name?: string;
    age?: number;
    height?: number; // Corresponds to height_cm in backend, JSON tag 'height'
    weight?: number; // Corresponds to weight_kg in backend, JSON tag 'weight'
}


export function CreateProfilePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const token = localStorage.getItem('authToken');
    if (!token) {
        setError("Authentication error. Please login again.");
        setIsLoading(false);
        setTimeout(() => navigate('/login'), 2000);
        return;
    }

    // --- Prepare Profile Data (with refined validation) ---
    const profileData: ProfilePayload = {}; // Use the defined interface

    if (name.trim()) { // Only add name if it's not just whitespace
        profileData.name = name.trim();
    }

    // Validate and add age
    if (age) {
        const ageNum = parseInt(age, 10);
        if (isNaN(ageNum) || ageNum < 0) {
            setError("Please enter a valid age (non-negative number).");
            setIsLoading(false);
            return;
        }
        profileData.age = ageNum;
    }

    // Validate and add height
    if (height) {
         const heightNum = parseFloat(height);
         if (isNaN(heightNum) || heightNum <= 0) {
             setError("Please enter a valid height (positive number).");
             setIsLoading(false);
             return;
         }
         profileData.height = heightNum; // Assign valid number
     }

    // Validate and add weight
     if (weight) {
         const weightNum = parseFloat(weight);
         if (isNaN(weightNum) || weightNum <= 0) {
             setError("Please enter a valid weight (positive number).");
             setIsLoading(false);
             return;
         }
         profileData.weight = weightNum; // Assign valid number
     }

     // Check if any data was actually entered (optional, backend might handle empty request)
     if (Object.keys(profileData).length === 0 && !name && !age && !height && !weight) {
         // Decide if submitting an empty profile is allowed or show a message
         // console.log("No profile data entered, skipping API call.");
         // navigate('/dashboard'); // Or navigate directly if skipping is intended
         // setIsLoading(false);
         // return;
         // For now, let's allow submitting potentially empty data if user clicks Enter
     }


    // --- API Call to Account Service ---
    try {
        const response = await fetch('http://localhost:8081/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            // Only send fields that have valid data
            body: JSON.stringify(profileData),
        });

        const result: ProfileResponse = await response.json();

        if (response.ok) {
            console.log("Profile saved successfully:", result.message || 'Success');
            navigate('/dashboard');

        } else {
            const errorMessage = result.error || `Failed to save profile (Status: ${response.status}). Please try again.`;
            console.error("Profile save failed:", errorMessage);
            setError(errorMessage);
             if (response.status === 401) {
                 setError("Session expired or invalid. Please login again.");
                 localStorage.removeItem('authToken');
                 setTimeout(() => navigate('/login'), 2000);
             }
        }
    } catch (networkError) {
        console.error("Network error during profile save:", networkError);
        setError("Network error. Please check your connection and try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleSkip = () => {
    console.log("Profile creation skipped, navigating to dashboard...");
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {/* Age Input */}
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number" // Use type="text" and pattern="[0-9]*" for better mobile experience sometimes, but number is fine
                placeholder="Enter Age Here..."
                min="0"
                value={age}
                onChange={(e) => setAge(e.target.value)} // Store as string initially
                disabled={isLoading}
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
                value={height}
                onChange={(e) => setHeight(e.target.value)} // Store as string initially
                disabled={isLoading}
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
                value={weight}
                onChange={(e) => setWeight(e.target.value)} // Store as string initially
                disabled={isLoading}
              />
            </div>
             {error && (
                 <p className="text-sm text-destructive">{error}</p>
             )}
          </CardContent>
          <CardFooter className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end sm:space-x-2">
             <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleSkip} disabled={isLoading}>
              Skip
            </Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Enter'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default CreateProfilePage;