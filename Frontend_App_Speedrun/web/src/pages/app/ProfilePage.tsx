import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings, Trophy } from "lucide-react";
import { Link } from "react-router-dom"; // For linking Personal Records maybe

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
      <div className="container mx-auto max-w-3xl p-4">
        {/* Top Action Icons */}
        <div className="mb-6 flex justify-between">
          <Link to="/personal-records" aria-label="Personal Records">
            <Button variant="ghost" size="icon">
              <Trophy className="h-6 w-6" />
            </Button>
          </Link>
          {/* Update this Link to point to "/settings" */}
          <Link to="/settings" aria-label="Settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
        </div>
  

      {/* Profile Header */}
      <div className="mb-8 flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24 border sm:h-32 sm:w-32">
          {/* Use optional chaining in case avatarUrl is null/undefined */}
          <AvatarImage src={userData.avatarUrl ?? undefined} alt={userData.name} />
          <AvatarFallback className="text-3xl sm:text-4xl">
            {userData.initials}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold sm:text-3xl">{userData.name}</h1>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-center sm:grid-cols-3 sm:text-left">
        <div className="sm:col-span-1">
          <p className="text-sm font-medium text-muted-foreground">Age</p>
          <p className="text-lg font-semibold">{userData.age}</p>
        </div>
        <div className="sm:col-span-1">
          <p className="text-sm font-medium text-muted-foreground">Weight</p>
          {/* Assuming weight is in kg */}
          <p className="text-lg font-semibold">{userData.weight} kg</p>
        </div>
        <div className="sm:col-span-1">
          <p className="text-sm font-medium text-muted-foreground">Height</p>
          {/* Assuming height is in cm */}
          <p className="text-lg font-semibold">{userData.height} cm</p>
        </div>
      </div>

      {/* Optional Separator */}
       <hr className="my-8" />

      {/* Mini Personal Records Preview (Optional) */}
       <div>
           <h2 className="mb-4 text-xl font-semibold">Recent Records</h2>
           <div className="space-y-2">
               {personalRecords.slice(0, 3).map(record => ( // Show first 3 records
                   <div key={record.id} className="flex justify-between text-sm">
                       <span>{record.workout}</span>
                       <span className="text-muted-foreground">{record.details}</span>
                       <span className="font-mono">{record.time}</span>
                   </div>
               ))}
               {personalRecords.length > 3 && (
                   <Link to="/personal-records" className="block text-center text-sm text-primary hover:underline mt-2">
                       View all records...
                   </Link>
               )}
                {personalRecords.length === 0 && (
                     <p className="text-sm text-muted-foreground text-center">No records yet.</p>
                )}
           </div>
       </div>

    </div>
  );
}

export default ProfilePage;