// src/pages/LoginPage.tsx
import React, { useState } from "react"; // Import React and useState
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

// Expected response structure from backend /login
interface LoginResponse {
    token?: string;
    message?: string; // Optional success message
    error?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
        setError("Email and password are required.");
        setIsLoading(false);
        return;
    }

    const loginData = { email, password };

    try {
        const response = await fetch('http://localhost:8080/login', { // Target the backend login endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        const result: LoginResponse = await response.json();

        if (response.ok && result.token) {
            // --- Login Successful ---
            console.log("Login successful");
            // Store the token securely (localStorage is simple, consider more secure options for production)
            localStorage.setItem('authToken', result.token);
            // Navigate to the main app dashboard/profile page
            navigate('/dashboard'); // Or '/profile'

        } else {
            // --- Login Failed (Backend Error or No Token) ---
            const errorMessage = result.error || `Login failed (Status: ${response.status}). Please check credentials.`;
            console.error("Login failed:", errorMessage);
            setError(errorMessage);
        }
    } catch (networkError) {
        // --- Network or other fetch errors ---
        console.error("Network error during login:", networkError);
        setError("Network error. Please check your connection and try again.");
    } finally {
        setIsLoading(false); // Stop loading regardless of outcome
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLoginSubmit}>
          <CardContent className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
             {/* Display error messages */}
             {error && (
                 <p className="text-sm text-destructive">{error}</p>
             )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
             <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
             <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default LoginPage;