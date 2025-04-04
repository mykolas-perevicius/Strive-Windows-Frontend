import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom"; // Make sure this is imported

export function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => { // This function should be used
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Optional Background Image */}
      {/* <div className="absolute inset-0 z-[-1] bg-[url('/path/to/your/gym-background.jpg')] bg-cover bg-center opacity-30 dark:opacity-20" /> */}
      {/* <div className="absolute inset-0 z-[-2] bg-background" /> */}

      <div className="flex flex-col items-center space-y-8 text-center">
        {/* App Title */}
        <h1 className="text-6xl font-extrabold tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
          Strive
        </h1>

        {/* Action Buttons */}
        <div className="flex w-full max-w-xs flex-col space-y-4 pt-8 sm:max-w-none sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
          <Button
            size="lg"
            className="w-full sm:w-auto sm:px-10"
            onClick={handleLoginClick} // <-- Ensure onClick uses handleLoginClick
          >
            Login
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto sm:px-10"
            onClick={handleRegisterClick} // <-- Ensure onClick uses handleRegisterClick
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;