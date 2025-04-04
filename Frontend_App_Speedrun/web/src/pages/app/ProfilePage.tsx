// src/pages/app/ProfilePage.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

// Dummy user data - replace with actual data fetching later
const userData = {
  name: "Mitch", // Replace with dynamic data
  avatarUrl: null, // Replace with actual URL or keep null for fallback
  initials: "MC", // Replace with dynamic initials
  age: 28, // Replace with dynamic data
  weight: 85, // Replace with dynamic data (kg?)
  height: 180, // Replace with dynamic data (cm?)
};

// Dummy Personal Records data
const personalRecords = [
  { id: 1, workout: "Bench Press", details: "12 x 100 kg", time: "0:59" },
  { id: 2, workout: "Squat", details: "8 x 140 kg", time: "1:15" },
  { id: 3, workout: "Deadlift", details: "5 x 180 kg", time: "1:30" },
  // Add more records...
];

export function ProfilePage() {
  return (
    // Ensures the page container itself grows and centers its content
    // Use min-h-screen if content is short and centering looks weird vertically
    <div className="flex flex-1 flex-col items-center p-4 md:p-6">
      {/* Content Wrapper: Re-introduce max-width and padding here */}
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
            <AvatarImage src={userData.avatarUrl ?? undefined} alt={userData.name} />
            <AvatarFallback className="text-3xl sm:text-4xl">
              {userData.initials}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold sm:text-3xl">{userData.name}</h1>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Age</p>
            <p className="text-lg font-semibold">{userData.age}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Weight</p>
            <p className="text-lg font-semibold">{userData.weight} kg</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Height</p>
            <p className="text-lg font-semibold">{userData.height} cm</p>
          </div>
        </div>

        {/* Optional Separator */}
        <hr className="my-8" />

        {/* Mini Personal Records Preview (Optional) */}
        <div>
          {/* Adjusted margin bottom */}
          <h2 className="mb-5 text-xl font-semibold">Recent Records</h2>
          {/* Use flex column for the list */}
          <div className="space-y-3"> {/* Increased spacing between records */}
            {personalRecords.slice(0, 3).map(record => (
              // Each record is a flex row with justify-between
              <div key={record.id} className="flex justify-between items-baseline text-sm">
                {/* Column 1: Workout Name (takes available space, truncate if needed) */}
                <span className="flex-1 font-medium pr-4 truncate">{record.workout}</span>
                {/* Column 2: Details (fixed width or shrink-0, right-aligned text) */}
                {/* Using text-center for the middle element as per image */}
                <span className="w-auto flex-shrink-0 px-4 text-center text-muted-foreground">{record.details}</span>
                {/* Column 3: Time (fixed width or shrink-0, right-aligned text) */}
                <span className="w-auto flex-shrink-0 text-right font-mono">{record.time}</span>
              </div>
            ))}
            {personalRecords.length > 3 && (
              <Link to="/personal-records" className="block pt-3 text-center text-sm text-primary hover:underline"> {/* Adjusted padding-top */}
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