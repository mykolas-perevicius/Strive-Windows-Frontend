// src/components/layout/BottomNav.tsx
import { Link, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button"; // Removed unused import
import { cn } from "@/lib/utils";
import {
  UserRound, // Profile Icon
  Dumbbell, // Workouts Icon
  PlusSquare, // Start Workout Icon
  CalendarDays, // Calendar Icon
  LineChart, // Stats Icon
} from "lucide-react";

// Define navigation items
const navItems = [
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/workouts", label: "Workouts", icon: Dumbbell },
  { href: "/start-workout", label: "Start Workout", icon: PlusSquare },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/stats", label: "Stats", icon: LineChart },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <footer className="sticky bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || (location.pathname === '/dashboard' && item.href === '/profile'); // Handle /dashboard mapping to /profile highlight
          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex h-full flex-col items-center justify-center gap-1 px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary sm:text-sm",
                isActive && "text-primary" // Highlight active link
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn("h-5 w-5 sm:h-6 sm:w-6", isActive ? "text-primary" : "")} />
              {/* Adjusted label visibility for better mobile experience */}
              <span className={cn("text-[10px] sm:text-xs", !isActive && "text-muted-foreground")}>{item.label}</span>
              {/* <span className="hidden sm:inline">{item.label}</span> */}
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}