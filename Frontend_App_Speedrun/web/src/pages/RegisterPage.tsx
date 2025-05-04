// src/pages/RegisterPage.tsx
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
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react"; // Ensure useState is imported

// Define the expected API response structure (adjust if needed)
interface RegisterResponse {
  message?: string; // Success message
  error?: string;   // Error message from backend
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); // Add state for email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); // Optional phone number state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true); // Start loading

    // --- Frontend Validation ---
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false); // Stop loading
      return;
    }

    if (!email || !password) {
        setError("Email and password are required.");
        setIsLoading(false); // Stop loading
        return;
    }
    // Add more email/password strength validation if desired

    // --- API Call ---
    // Note: The backend /register endpoint currently only expects email and password.
    // Phone number is collected here but not sent in this request.
    // It would likely be sent during profile creation/update later.
    const registrationData = {
        email: email,
        password: password,
    };

    try {
        const response = await fetch('http://localhost:8080/register', { // Use the backend endpoint URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registrationData),
        });

        const result: RegisterResponse = await response.json();

        if (response.ok) {
            // --- Registration Successful ---
            console.log("Registration successful:", result.message || 'Success');
            // Navigate to the next step (e.g., create profile or login)
            // Keeping navigation to /create-profile as per previous logic
            navigate('/create-profile');
            // Or navigate to login if preferred: navigate('/login');

        } else {
            // --- Registration Failed (Backend Error) ---
            console.error("Registration failed:", result.error || `HTTP error! status: ${response.status}`);
            setError(result.error || `Registration failed (Status: ${response.status}). Please try again.`);
        }
    } catch (networkError) {
        // --- Network or other fetch errors ---
        console.error("Network error during registration:", networkError);
        setError("Network error. Please check your connection and try again.");
    } finally {
        setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Enter your details below to create an account
          </CardDescription>
        </CardHeader>
        {/* Update form to use controlled components fully */}
        <form onSubmit={handleRegisterSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email" // name is still useful for accessibility/testing
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={email} // Control the component
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading} // Disable when loading
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading} // Disable when loading
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                // Apply error styling based on the error state related to matching
                className={error === "Passwords do not match." ? 'border-destructive' : ''}
                disabled={isLoading} // Disable when loading
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="(123) 456-7890"
                autoComplete="tel"
                value={phoneNumber} // Control the component
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading} // Disable when loading
              />
            </div>
            {/* Display general errors here */}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {/* Disable button when loading */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default RegisterPage;