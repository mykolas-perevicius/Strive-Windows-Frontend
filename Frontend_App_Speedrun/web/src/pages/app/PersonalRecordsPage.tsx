// src\pages\app\PersonalRecordsPage.tsx
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { ArrowLeft } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  
  // Dummy Personal Records data - Fetch this from your API later
  const records = [
    { id: "pr1", workout: "Bench Press", details: "12 x 100 kg", time: "0:59" },
    { id: "pr2", workout: "Squat", details: "8 x 140 kg", time: "1:15" },
    { id: "pr3", workout: "Deadlift", details: "5 x 180 kg", time: "1:30" },
    { id: "pr4", workout: "Overhead Press", details: "10 x 60 kg", time: "0:45" },
    { id: "pr5", workout: "Barbell Row", details: "10 x 80 kg", time: "0:55" },
    { id: "pr6", workout: "Bench Press", details: "10 x 102.5 kg", time: "1:05" },
    { id: "pr7", workout: "Squat", details: "5 x 145 kg", time: "1:25" },
    // Add more dummy records as needed
  ];
  
  export function PersonalRecordsPage() {
    const navigate = useNavigate();
  
    const handleBackClick = () => {
      navigate(-1); // Go back to the previous page (likely ProfilePage)
    };
  
    return (
      <div className="container mx-auto max-w-3xl p-4">
        {/* Header with Back Button and Title */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Back Button - Positioned absolutely on the left */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0"
            onClick={handleBackClick}
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {/* Title - Centered */}
          <h1 className="text-2xl font-bold sm:text-3xl">Personal Records</h1>
           {/* Optional: Add a placeholder on the right if needed for balance or future icons */}
           <div className="absolute right-0 w-8 h-8"></div> {/* Adjust size as needed */}
        </div>
  
        {/* Records Table */}
        <Table>
          <TableCaption>Your recent personal records.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px] sm:w-[200px]">Workout</TableHead>
              <TableHead>Reps x Weight</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length > 0 ? (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.workout}</TableCell>
                  <TableCell>{record.details}</TableCell>
                  <TableCell className="text-right font-mono">{record.time}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                  No personal records found. Start working out!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  export default PersonalRecordsPage;