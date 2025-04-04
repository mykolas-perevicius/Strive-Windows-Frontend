# Frontend App Speedrun

This repository contains the frontend application for **Frontend App Speedrun**, initially focusing on a native Windows setup for the web component. Future plans include an Android application.

-   **Web:** A modern React application using Vite, TypeScript, Tailwind CSS v4, and Shadcn/ui, developed **natively on Windows**. This component has reached a Minimal Viable Prototype (MVP) stage.
-   **Android:** (Placeholder) A native Android application using Kotlin.

> **Note:** This is currently a frontend-only setup. Backend integration (e.g., authentication, API endpoints) is planned for future phases.

> **LLM Context:** This project's web component was intentionally set up *without* Docker or WSL2, using Node.js, npm, and associated tools installed directly on the Windows host OS. PowerShell scripts were used for initial scaffolding and configuration where possible. The tech stack is Vite + React 19 + TypeScript + Tailwind CSS v4 + Shadcn/ui.

---

## Project Structure

Below is an overview of the repository's directory layout:

    Frontend_App_Speedrun/
    ├── web/                       # React web application (Native Windows Setup)
    │   ├── node_modules/          # (Ignored by git) Project dependencies
    │   ├── public/                # Static assets
    │   ├── src/                   # Source code
    │   │   ├── components/        # Reusable components
    │   │   │   ├── contexts/      # React Context Providers (e.g., AppSettingsProvider)
    │   │   │   ├── layout/        # Layout components (MainLayout, BottomNav, etc.)
    │   │   │   ├── settings/      # Components specific to settings (SettingsNav)
    │   │   │   └── ui/            # Shadcn/ui generated components
    │   │   ├── contexts/          # Context definitions (e.g., appSettingsContext.ts) - *Could merge with components/contexts/*
    │   │   ├── hooks/             # Custom React hooks (e.g., useAppSettings)
    │   │   ├── lib/               # Utility functions (e.g., cn from Shadcn)
    │   │   ├── pages/             # Page-level components
    │   │   │   ├── app/           # Authenticated app screens
    │   │   │   │   ├── settings/  # Specific settings pages
    │   │   │   │   └── ...        # (ProfilePage, WorkoutsPage, CalendarPage, etc.)
    │   │   │   └── ...            # (LandingPage, LoginPage, etc.)
    │   │   ├── App.tsx            # Main App component (routing)
    │   │   ├── index.css          # Tailwind directives & global styles
    │   │   └── main.tsx           # React entry point
    │   ├── .gitignore             # Git ignore for web directory
    │   ├── components.json        # Shadcn/ui configuration
    │   ├── eslint.config.js       # ESLint configuration (using new flat config format)
    │   ├── index.html             # HTML template
    │   ├── package-lock.json      # Exact dependency versions
    │   ├── package.json           # Dependencies & scripts
    │   ├── README.md              # README specific to the web application MVP
    │   ├── tailwind.config.ts     # Tailwind CSS v4 configuration (TypeScript)
    │   ├── tsconfig.app.json      # TypeScript config for app code
    │   ├── tsconfig.json          # Root TypeScript configuration for web/
    │   ├── tsconfig.node.json     # TypeScript config for Node context (Vite/Tailwind config)
    │   └── vite.config.ts         # Vite configuration
    ├── android/                   # (Placeholder) Native Android application (Kotlin)
    │   # ... (Android structure will be added later)
    ├── .gitignore                 # Root Git ignore file
    └── README.md                  # This file (Root project README)

---

## Getting Started (Web MVP)

### Prerequisites

*   [Node.js](https://nodejs.org/) (v22+ recommended) - Installed **directly** on Windows.
*   [npm](https://www.npmjs.com/) (v11+ recommended) - Comes with Node.js.
*   [Git](https://git-scm.com/) - For version control.
*   Windows PowerShell or Command Prompt.
*   Your favorite code editor (e.g., [VSCode](https://code.visualstudio.com/)) with extensions like Tailwind CSS IntelliSense, Prettier, ESLint.

### Running the Web Application

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone https://github.com/mykolas-perevicius/Strive-Windows-Frontend.git
    cd Strive-Windows-Frontend
    ```
    *(Adjust `cd` command based on your cloned folder name)*

2.  **Navigate to the web directory:**
    ```bash
    cd web
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```
    *   **React 19 Note:** If you encounter `ERESOLVE` errors regarding peer dependencies (especially `react-day-picker`), try installing using the `--legacy-peer-deps` flag:
        ```bash
        npm install --legacy-peer-deps
        ```

4.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The web app will be available at `http://localhost:5173` (or the next available port).

---

### Android Application (Placeholder)

*(Instructions will be added here once the Android part is developed.)*

---

## Git Workflow Guidelines

-   **Branching Strategy:** Use feature branches (e.g., `feature/user-profile`). Merge into `main` via Pull Requests (if collaborating) or directly (if solo).
-   **Commit Messages:** Write clear, concise commit messages.
-   **Environment Files:** Use `.env` files (ignored by default in `web/.gitignore`) for environment variables. Use `.env.example` to document required variables. **Do not commit secrets.**

---

## Development Roadmap

-   **Web MVP UI Complete:** Foundational UI and navigation for key screens are implemented.
-   **Next Steps (Web):**
    *   Implement Workout Creation/Tracking UI & Timers.
    *   Integrate Recharts for visualizations on the Stats page.
    *   Replace dummy data and logic with actual state management and placeholder API calls.
    *   Implement form validation (e.g., `react-hook-form` + `zod`).
    *   Implement full i18n using `i18next`.
    *   Backend Integration (Future).
-   **Android UI Setup:** Initialize the Android project structure and implement basic screens (Future).
-   **Shared Logic/State:** Explore options for sharing logic (Future).