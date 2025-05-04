// src/pages/app/ProfilePage.tsx
import React, { useState, useEffect } from 'react'; // Import React hooks
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {  AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Trophy, RefreshCw, AlertCircle } from "lucide-react"; // Added icons
import { Link, useNavigate } from "react-router-dom";

// Define the structure of the profile data expected from the backend
interface UserProfile {
  name?: string | null;
  age?: number | null;
  height?: number | null; // Matches backend JSON 'height' tag for height_cm
  weight?: number | null; // Matches backend JSON 'weight' tag for weight_kg
  // avatarUrl?: string | null; // Add later if implemented
}

// Define the structure of the API response for GET /profile
interface GetProfileResponse {
    profile?: UserProfile | null;
    message?: string; // Optional message (e.g., if profile not found)
    error?: string;
}

// --- Keep Dummy Personal Records for now ---
const personalRecords = [
  { id: 1, workout: "Bench Press", details: "12 x 100 kg", time: "0:59" },
  { id: 2, workout: "Squat", details: "8 x 140 kg", time: "1:15" },
  { id: 3, workout: "Deadlift", details: "5 x 180 kg", time: "1:30" },
];
// --- End Dummy Data ---


export function ProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to generate initials from name
  const getInitials = (name?: string | null): string => {
    if (!name) return "?";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Function to fetch profile data
  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('authToken');

    if (!token) {
        setError("Not logged in.");
        setIsLoading(false);
        navigate('/login'); // Redirect if no token
        return;
    }

    try {
        const response = await fetch('http://localhost:8081/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json', // Indicate we expect JSON
            },
        });

        const result: GetProfileResponse = await response.json();

        if (response.ok) {
            setProfileData(result.profile || null); // Set profile or null if not found
            if (!result.profile) {
                console.log("Profile not found, but request OK:", result.message);
                // Optionally set a specific state if profile is missing but user is authenticated
            }
        } else {
             const errorMessage = result.error || `Failed to load profile (Status: ${response.status}).`;
             console.error("Profile fetch failed:", errorMessage);
             setError(errorMessage);
             if (response.status === 401) { // Handle unauthorized/expired token
                 setError("Session expired. Please login again.");
                 localStorage.removeItem('authToken');
                 setTimeout(() => navigate('/login'), 2000);
             }
        }
    } catch (networkError) {
        console.error("Network error fetching profile:", networkError);
        setError("Network error. Could not load profile.");
    } finally {
        setIsLoading(false);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []); // Empty dependency array means run once on mount


  // --- Render Logic ---

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <RefreshCw className="h-10 w-10 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Loading Profile...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="mt-4 font-semibold text-destructive">Error Loading Profile</p>
        <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchProfile}>
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
         <Button variant="link" size="sm" className="mt-2" onClick={() => navigate('/login')}>
            Go to Login
        </Button>
      </div>
    );
  }

  // Display fetched or default data
  const displayName = profileData?.name ?? "User"; // Default name
  const displayInitials = getInitials(profileData?.name);
  const displayAge = profileData?.age ?? "--";
  const displayWeight = profileData?.weight ?? "--";
  const displayHeight = profileData?.height ?? "--";
  // const displayAvatarUrl = profileData?.avatarUrl; // Use later

  return (
    <div className="flex flex-1 flex-col items-center p-4 md:p-6">
      <div className="w-full max-w-3xl">
        {/* Top Action Icons */}
        <div className="mb-6 flex justify-between">
          <Link to="/personal-records" aria-label="Personal Records">
            <Button variant="ghost" size="icon">
              <Trophy className="h-6 w-6" />
            </Button>
          </Link>
          <Link to="/settings" aria-label="Settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <div className="mb-8 flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24 border sm:h-32 sm:w-32">
            {/* <AvatarImage src={displayAvatarUrl ?? undefined} alt={displayName} /> */}
            <AvatarFallback className="text-3xl sm:text-4xl">
              {displayInitials}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold sm:text-3xl">{displayName}</h1>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Age</p>
            <p className="text-lg font-semibold">{displayAge}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Weight</p>
            <p className="text-lg font-semibold">
                {displayWeight}{displayWeight !== '--' ? ' kg' : ''}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Height</p>
            <p className="text-lg font-semibold">
                {displayHeight}{displayHeight !== '--' ? ' cm' : ''}
            </p>
          </div>
        </div>

        {/* Optional Separator */}
        <hr className="my-8" />

        {/* Mini Personal Records Preview (Keep Dummy Data for now) */}
        <div>
          <h2 className="mb-5 text-xl font-semibold">Recent Records</h2>
          <div className="space-y-3">
            {personalRecords.slice(0, 3).map(record => (
              <div key={record.id} className="flex justify-between items-baseline text-sm">
                <span className="flex-1 font-medium pr-4 truncate">{record.workout}</span>
                <span className="w-auto flex-shrink-0 px-4 text-center text-muted-foreground">{record.details}</span>
                <span className="w-auto flex-shrink-0 text-right font-mono">{record.time}</span>
              </div>
            ))}
            {personalRecords.length > 3 && (
              <Link to="/personal-records" className="block pt-3 text-center text-sm text-primary hover:underline">
                View all records...
              </Link>
            )}
            {personalRecords.length === 0 && (
              <p className="text-sm text-muted-foreground text-center pt-2">No records yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;