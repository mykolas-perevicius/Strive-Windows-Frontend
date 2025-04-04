import { Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CreateProfilePage from '@/pages/CreateProfilePage'; // <-- Import CreateProfilePage

// Placeholder Dashboard component
function DashboardPlaceholder() {
  return <div className="flex min-h-screen items-center justify-center"><h1 className="text-3xl">Dashboard</h1><p>(Placeholder)</p></div>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create-profile" element={<CreateProfilePage />} /> {/* <-- Add Create Profile Route */}

      {/* Placeholder route for where the app goes after login/profile creation */}
      <Route path="/dashboard" element={<DashboardPlaceholder />} />

      {/* Add other routes here later */}
      {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

      {/* Optional: Add a catch-all route for 404 Not Found */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;