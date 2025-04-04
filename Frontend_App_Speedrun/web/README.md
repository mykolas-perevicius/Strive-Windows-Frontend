# Frontend_App_Speedrun (Web Prototype - Strive App)

This project is the web frontend prototype for a fitness tracking application, tentatively named "Strive" (based on initial designs). It's being developed iteratively as part of the `Frontend_App_Speedrun` initiative.

## Current Status: Minimal Viable Prototype (MVP)

This prototype currently includes the foundational UI and navigation flow for key application areas.

*   **Functionality:** Core navigation, basic form handling (login, register, profile creation), theme switching, and demo language switching (for settings navigation) are implemented. Most data displayed is **dummy data**.
*   **UI:** Built using Shadcn/ui components with the specified theme (New York style, Gray base color). Layouts are responsive.
*   **Backend:** **No backend integration** exists yet. All actions (login, register, save profile, etc.) currently simulate success and log to the console or navigate accordingly.
*   **Core Logic:** Workout tracking timers, detailed stats calculations, and template application logic are **not yet implemented**.

## Tech Stack

*   **Framework/Library:** React 19
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`)
*   **Component Library:** Shadcn/ui
    *   Style: New York
    *   Base Color: Gray
    *   Mode: CSS Variables
*   **Routing:** React Router DOM v6
*   **Icons:** Lucide React
*   **State Management (Implicit):** React Context (for Theme/Language)
*   **Persistence:** `localStorage` (for theme/language preference)
*   **Charting (Installed):** Recharts (integration pending)
*   **Code Quality:** ESLint, Prettier (based on standard Vite setup)

## Project Structure (`web/src/`)

*   `components/`: Contains Shadcn `ui` components, shared `layout` components (BottomNav, MainLayout, SettingsLayout), and specific `settings` components (SettingsNav).
*   `contexts/`: Holds React context providers (e.g., `AppSettingsProvider`).
*   `hooks/`: Custom hooks (e.g., `useAppSettings`).
*   `lib/`: Utility functions (e.g., Shadcn's `cn`).
*   `pages/`: Page-level components, organized into:
    *   `app/`: Authenticated application screens (Profile, Workouts, Calendar, Stats, etc.).
        *   `settings/`: Specific settings pages (Account, Appearance, etc.).
    *   Auth/Public pages (LandingPage, LoginPage, etc.).

## Getting Started

### Prerequisites

*   Node.js (v22+ recommended)
*   npm (v11+ recommended)
*   Developed natively on Windows (should not affect standard commands but provided for context).

### Installation

1.  Navigate to the web project directory:
    ```bash
    cd Frontend_App_Speedrun/web
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
    *   **Note (React 19):** Due to ongoing ecosystem updates for React 19, some peer dependencies (especially related to `react-day-picker` used by Shadcn's Calendar) might cause conflicts during installation. If you encounter `ERESOLVE` errors, try installing with the `--legacy-peer-deps` flag (as was necessary during development for certain packages like `recharts`):
        ```bash
        npm install --legacy-peer-deps
        ```

### Running the Development Server

1.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to the local URL provided (usually `http://localhost:5173`).

## Implemented Features (MVP)

*   **Authentication Flow:**
    *   Landing Page (Login/Register options)
    *   Login Page (dummy submit -> navigates to dashboard)
    *   Registration Page (dummy validation & submit -> navigates to profile creation)
    *   Create Profile Page (dummy submit/skip -> navigates to dashboard)
*   **Main Application Layout:**
    *   Persistent Bottom Navigation for authenticated sections.
    *   Main content area rendering routed pages.
*   **Core App Screens:**
    *   Profile Screen: Displays basic user info (dummy), links to Settings & Personal Records.
    *   Personal Records Screen: Displays PRs in a table (dummy data).
    *   Start Workout Screen: Options for blank workout or selecting from Barbell/Bodyweight templates (dummy data, navigation placeholders).
    *   Workouts Screen: Displays workout history log grouped by date (dummy data).
    *   Calendar Screen: Monthly view highlighting workout days (dummy data), basic date selection.
    *   Stats Screen: Time range selection, progress bar summaries, exercise progression list (dummy data), chart placeholders.
*   **Settings:**
    *   Dedicated Settings Layout with sidebar navigation.
    *   Account Settings Page (UI complete, actions are dummies).
    *   Appearance Settings Page (Theme selection: Light/Dark/System, functional).
    *   Subscription Settings Page (UI complete, shows dummy plans).
    *   Language Settings Page (UI complete, demo language switching EN/ES for Settings Nav text).
    *   Contact Us Page (Displays dummy contact info).
    *   Logout button (dummy action).
*   **General:**
    *   Functional Dark Mode (Light/Dark/System) persisted in localStorage.
    *   Basic responsive design.

## Next Steps

*   Implement Workout Creation/Tracking UI & Timers.
*   Integrate Recharts for visualizations on the Stats page.
*   Replace dummy data and logic with actual state management and API calls.
*   Refine UI/UX based on further testing and feedback.
*   Add form validation using a library (e.g., `react-hook-form` with `zod`).
*   Implement actual i18n using `i18next`.