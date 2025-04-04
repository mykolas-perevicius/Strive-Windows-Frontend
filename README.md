# Frontend App Speedrun

This repository contains the frontend application for **Frontend App Speedrun**, initially focusing on a native Windows setup for the web component. Future plans include an Android application.

-   **Web:** A modern React application using Vite, TypeScript, Tailwind CSS v4, and Shadcn/ui, developed **natively on Windows**.
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
    │   │   ├── components/        # Shadcn/ui components
    │   │   │   └── ui/
    │   │   │       └── button.tsx # Example component
    │   │   ├── lib/               # Shadcn/ui utilities
    │   │   │   └── utils.ts
    │   │   ├── App.tsx            # Main App component
    │   │   ├── index.css          # Tailwind directives & global styles
    │   │   └── main.tsx           # React entry point
    │   ├── .eslintrc.cjs          # ESLint configuration
    │   ├── .gitignore             # Git ignore for web directory
    │   ├── components.json        # Shadcn/ui configuration
    │   ├── index.html             # HTML template
    │   ├── package-lock.json      # Exact dependency versions
    │   ├── package.json           # Dependencies & scripts
    │   ├── postcss.config.js      # PostCSS configuration (for Tailwind)
    │   ├── tailwind.config.js     # Tailwind CSS v4 configuration
    │   ├── tsconfig.app.json      # TypeScript config for app code
    │   ├── tsconfig.json          # Root TypeScript configuration
    │   ├── tsconfig.node.json     # TypeScript config for Node context (Vite config)
    │   └── vite.config.ts         # Vite configuration
    ├── android/                   # (Placeholder) Native Android application (Kotlin)
    │   # ... (Android structure will be added later)
    └── .gitignore                 # Root Git ignore file

---

## Getting Started

### Prerequisites

#### For Web Development (Native Windows):
-   [Node.js](https://nodejs.org/) (v22.14.0+ recommended) - Installed **directly** on Windows.
-   [npm](https://www.npmjs.com/) (v11.2.0+ recommended) - Comes with Node.js.
-   [Git](https://git-scm.com/) - For version control.
-   Windows PowerShell - For running setup scripts (optional) and commands.
-   Your favorite code editor (e.g., [VSCode](https://code.visualstudio.com/))

#### For Android Development (Placeholder):
-   [Android Studio](https://developer.android.com/studio)
-   Android SDK and JDK

---

### Windows-Specific Setup (Native - This Project's Approach)

This project's web component is configured for **native Windows development**, meaning tools are installed and run directly on Windows without WSL or Docker.

1.  **Install Prerequisites:** Ensure Node.js, npm, and Git are installed directly on your Windows machine and accessible from your terminal (PowerShell or Command Prompt).
2.  **Clone the Repository:** Use Git to clone this repository to your local machine.
3.  **Code Editor:** Use VS Code (or your preferred editor) installed on Windows.
    *   **Recommended VS Code Extensions:**
        *   `Tailwind CSS IntelliSense` (by Tailwind Labs)
        *   `Prettier - Code formatter` (by Prettier) - Consider `npm install -D prettier prettier-plugin-tailwindcss` and configure `.prettierrc` in the `web` dir.
        *   `ESLint` (by Microsoft)
        *   `PostCSS Language Support` (by csstools)
4.  **Navigate & Install:** Open PowerShell/CMD, navigate into the `web` directory, and run `npm install`.
5.  **Run:** Use `npm run dev` inside the `web` directory to start the development server.

*(Note: The setup script `setup_project.ps1` included in previous instructions performed some initial steps automatically but is not required for cloning and running the existing setup).*

---

### Setting Up the Web Application

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mykolas-perevicius/Strive-Windows-Frontend.git
    cd Strive-Windows-Frontend/web
    ```
    *(Note: The root folder might be named `Strive-Windows-Frontend` if you cloned directly, adjust `cd` command if needed)*

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The web app will be available at `http://localhost:5173` (or the next available port). Vite provides Hot Module Replacement (HMR) for a fast development experience.

---

### Setting Up the Android Application (Placeholder)

*(Instructions will be added here once the Android part is developed.)*

1.  **Open the Android Project in Android Studio:**
    -   Launch Android Studio.
    -   Select **File > Open...** and navigate to the `android` directory within the project.
2.  **Build and Run:**
    -   Use Android Studio's tools or Gradle commands.

---

## Git Workflow Guidelines

-   **Branching Strategy:** Use feature branches (e.g., `feature/user-profile`). Merge into `main` via Pull Requests.
-   **Commit Messages:** Write clear, concise commit messages (e.g., `feat: Add login form component`).
-   **Pull Requests:** Use PRs for code review before merging to `main`.
-   **Environment Files:** The Vite `.gitignore` in `web/` ignores `.env` files. Use `.env.example` if you need to document environment variables. Do not commit secrets.

---

## Development Roadmap (Initial Ideas)

-   **Web UI Completion:** Finalize static versions and basic interactivity for key screens using Shadcn/ui components.
-   **Android UI Setup:** Initialize the Android project structure and implement basic screens.
-   **Shared Logic/State:** Explore options for sharing logic if applicable (not a primary goal initially).
-   **Backend Integration (Future):** Connect to backend services once UI is mature.