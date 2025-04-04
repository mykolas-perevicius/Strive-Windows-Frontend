// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate

// --- Page Imports ---
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CreateProfilePage from '@/pages/CreateProfilePage';

// Layouts
import { MainLayout } from '@/components/layout/MainLayout';
import { SettingsLayout } from '@/components/layout/SettingsLayout'; // Import SettingsLayout

// App Pages
import ProfilePage from '@/pages/app/ProfilePage';
import PlaceholderPage from '@/pages/app/PlaceholderPage'; // Main placeholder
import PersonalRecordsPage from '@/pages/app/PersonalRecordsPage';

// Settings Pages (Paths should now match file locations)
import SettingsAccountPage from '@/pages/app/settings/SettingsAccountPage';
import SettingsPlaceholderPage from '@/pages/app/settings/SettingsPlaceholderPage';

// --- Not Found Page (Optional) ---
// import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* --- Public/Auth Routes (No Layout) --- */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create-profile" element={<CreateProfilePage />} />

      {/* --- Authenticated Routes (within MainLayout) --- */}
      <Route element={<MainLayout />}>
        {/* Redirect /dashboard to /profile */}
        <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/workouts" element={<PlaceholderPage />} />
        <Route path="/start-workout" element={<PlaceholderPage />} />
        <Route path="/calendar" element={<PlaceholderPage />} />
        <Route path="/stats" element={<PlaceholderPage />} />
        <Route path="/personal-records" element={<PersonalRecordsPage />} />
      </Route> {/* End of routes within MainLayout */}


      {/* --- Settings Routes (within SettingsLayout) --- */}
      <Route path="/settings" element={<SettingsLayout />}>
          {/* Default settings route redirects to account */}
          <Route index element={<Navigate to="/settings/account" replace />} />
          <Route path="account" element={<SettingsAccountPage />} />
          <Route path="appearance" element={<SettingsPlaceholderPage />} />
          <Route path="subscription" element={<SettingsPlaceholderPage />} />
          <Route path="language" element={<SettingsPlaceholderPage />} />
          <Route path="contact" element={<SettingsPlaceholderPage />} />
      </Route> {/* End of routes within SettingsLayout */}


      {/* --- Catch-all 404 Route (Optional) --- */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}

    </Routes>
  );
}

export default App;