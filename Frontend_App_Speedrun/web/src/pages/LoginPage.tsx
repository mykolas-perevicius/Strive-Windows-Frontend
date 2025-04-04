// src/pages/LoginPage.tsx
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
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

export function LoginPage() {
  const navigate = useNavigate(); // <-- Initialize navigate hook

  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    // Dummy action: Log form data
    const formData = new FormData(event.currentTarget);
    const loginData = {
      email: formData.get('email'),
      // Don't log passwords in real applications
      // password: formData.get('password'),
    };
    console.log("Login submitted with data:", loginData);

    // Add your actual login logic here (e.g., API call, validation)
    // Simulate successful login
    const isLoginSuccessful = true; // Replace with actual check

    if (isLoginSuccessful) {
      console.log("Login successful (dummy), navigating to dashboard...");
      navigate('/dashboard'); // <-- Navigate to /dashboard on success
    } else {
      // Handle login failure (e.g., show error message)
      console.error("Login failed (dummy)");
      // Example: setError("Invalid email or password.");
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
                name="email" // Add name attribute for FormData access
                type="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password" // Link to a future forgot password page
                  className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password" // Add name attribute for FormData access
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
             {/* Placeholder for error messages if needed */}
             {/* {error && <p className="text-sm text-destructive">{error}</p>} */}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
             <Button type="submit" className="w-full">
              Login
            </Button>
             <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                to="/register" // Link to the register page
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