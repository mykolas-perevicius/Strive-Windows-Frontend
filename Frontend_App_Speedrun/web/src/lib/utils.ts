// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add this function
export function formatTimeElapsed(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedSeconds = seconds.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');

  if (hours > 0) {
    // Pad minutes even if hours are present
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  } else {
    // Don't need to pad minutes if < 1 hour, but standard format often does
    return `${minutes.toString().padStart(2, '0')}:${paddedSeconds}`;
     // Or just: return `${minutes}:${paddedSeconds}`; if you prefer 1:05 over 01:05
  }
}