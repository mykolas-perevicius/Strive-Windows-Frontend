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
// import PlaceholderPage from '@/pages/app/PlaceholderPage'; // Can remove import
import PersonalRecordsPage from '@/pages/app/PersonalRecordsPage';
import { StartWorkoutPage } from '@/pages/app/StartWorkoutPage';
import WorkoutsPage from '@/pages/app/WorkoutsPage';
import CalendarPage from '@/pages/app/CalendarPage';
import { StatsPage } from '@/pages/app/StatsPage';
import { CreateWorkoutPage } from '@/pages/app/CreateWorkoutPage'; // *** IMPORT THE NEW PAGE ***
import { ActiveWorkoutPage } from '@/pages/app/ActiveWorkoutPage';

// Settings Pages
import SettingsAccountPage from '@/pages/app/settings/SettingsAccountPage';
import SettingsAppearancePage from '@/pages/app/settings/SettingsAppearancePage';
import SettingsSubscriptionPage from '@/pages/app/settings/SettingsSubscriptionPage';
import SettingsLanguagePage from '@/pages/app/settings/SettingsLanguagePage';
import SettingsContactPage from '@/pages/app/settings/SettingsContactPage';

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
        <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/workouts" element={<WorkoutsPage />} />
        <Route path="/start-workout" element={<StartWorkoutPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/personal-records" element={<PersonalRecordsPage />} />
        {/* *** ADD THE ROUTE FOR CREATING A WORKOUT *** */}
        <Route path="/app/workouts/new" element={<CreateWorkoutPage />} />
        <Route path="/app/active-workout" element={<ActiveWorkoutPage />} />
        {/* Example route for viewing/editing a specific workout template (future) */}
        {/* <Route path="/app/workouts/:templateId" element={<ViewWorkoutTemplatePage />} /> */}
        {/* Example route for an active workout session (future) */}
        {/* <Route path="/app/active-workout/:sessionId" element={<ActiveWorkoutPage />} /> */}

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

export default App;
