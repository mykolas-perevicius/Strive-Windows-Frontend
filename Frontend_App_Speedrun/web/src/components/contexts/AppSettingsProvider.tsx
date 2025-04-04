// src/components/contexts/AppSettingsProvider.tsx
import React, { useEffect, useState } from "react"; // Removed createContext
// Import the context object from its new file
import { AppSettingsProviderContext } from './appSettingsContext';

// --- Type Definitions ---
type Theme = "dark" | "light" | "system";
type Language = "en" | "es";

// Keep the exported State type here as it describes the provider's value
export type AppSettingsProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
};

type AppSettingsProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultLanguage?: Language;
  storageKeyTheme?: string;
  storageKeyLanguage?: string;
};

// Remove createContext call from here
// const initialState: AppSettingsProviderState = { ... };
// export const AppSettingsProviderContext = createContext<AppSettingsProviderState>(initialState);

// --- Provider Component ---
export function AppSettingsProvider({
  children,
  defaultTheme = "system",
  defaultLanguage = "en",
  storageKeyTheme = "vite-ui-theme",
  storageKeyLanguage = "vite-ui-language",
  ...props
}: AppSettingsProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKeyTheme) as Theme) || defaultTheme
  );
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem(storageKeyLanguage) as Language) || defaultLanguage
  );

  // --- Theme Effects ---
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    let systemTheme: Theme = 'light';
    if (theme === "system") {
        systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.classList.add(theme === "system" ? systemTheme : theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(systemTheme);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);
  // --- End Theme Effects ---

  const value: AppSettingsProviderState = { // Explicitly type value
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKeyTheme, newTheme);
      setThemeState(newTheme);
    },
    language,
    setLanguage: (newLanguage: Language) => {
      localStorage.setItem(storageKeyLanguage, newLanguage);
      setLanguageState(newLanguage);
      console.log(`Language set to ${newLanguage} in context`);
    },
  };

  // Use the imported context here
  return (
    <AppSettingsProviderContext.Provider {...props} value={value}>
      {children}
    </AppSettingsProviderContext.Provider>
  );
}