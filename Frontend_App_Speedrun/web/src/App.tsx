// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Page Imports ---
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CreateProfilePage from '@/pages/CreateProfilePage';

// Layouts
import { MainLayout } from '@/components/layout/MainLayout';
import { SettingsLayout } from '@/components/layout/SettingsLayout';

// App Pages
import ProfilePage from '@/pages/app/ProfilePage';
import PlaceholderPage from '@/pages/app/PlaceholderPage';
import PersonalRecordsPage from '@/pages/app/PersonalRecordsPage';
import StartWorkoutPage from '@/pages/app/StartWorkoutPage'; // <-- Correct Import

// Settings Pages
import SettingsAccountPage from '@/pages/app/settings/SettingsAccountPage';
import SettingsAppearancePage from '@/pages/app/settings/SettingsAppearancePage';
import SettingsSubscriptionPage from '@/pages/app/settings/SettingsSubscriptionPage';
import SettingsLanguagePage from '@/pages/app/settings/SettingsLanguagePage';
import SettingsContactPage from '@/pages/app/settings/SettingsContactPage';

// --- Not Found Page (Optional) ---
// import NotFoundPage from '@/pages/NotFoundPage';

// --- App Component ---
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
        <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/workouts" element={<PlaceholderPage />} /> {/* Will replace this next */}
        <Route path="/start-workout" element={<StartWorkoutPage />} /> {/* Use imported component */}
        <Route path="/calendar" element={<PlaceholderPage />} /> {/* Will replace this later */}
        <Route path="/stats" element={<PlaceholderPage />} /> {/* Will replace this later */}
        <Route path="/personal-records" element={<PersonalRecordsPage />} />
      </Route> {/* End of routes within MainLayout */}


      {/* --- Settings Routes (within SettingsLayout) --- */}
      <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<Navigate to="/settings/account" replace />} />
          <Route path="account" element={<SettingsAccountPage />} />
          <Route path="appearance" element={<SettingsAppearancePage />} />
          <Route path="subscription" element={<SettingsSubscriptionPage />} />
          <Route path="language" element={<SettingsLanguagePage />} />
          <Route path="contact" element={<SettingsContactPage />} />
      </Route> {/* End of routes within SettingsLayout */}


      {/* --- Catch-all 404 Route (Optional) --- */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}

    </Routes>
  );
}

// --- Single Default Export ---
export default App;