import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

// Create the context
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Create the provider component
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme", // Key for localStorage
  ...props // Spread any other props if needed
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    // Get theme from localStorage or use default
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    let systemTheme: Theme = 'light'; // Default if matchMedia is not supported or no preference
    if (theme === "system") {
        // Check system preference
        systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                      .matches
                      ? "dark"
                      : "light";

    }

    // Apply the determined theme (either explicitly set or system-derived)
    root.classList.add(theme === "system" ? systemTheme : theme);
  }, [theme]); // Re-run effect when theme changes

  // Listener for system theme changes (if current theme is 'system')
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      // Only update if the current setting is 'system'
      if (theme === 'system') {
        const systemTheme = mediaQuery.matches ? "dark" : "light";
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(systemTheme);
        console.log("System theme changed, applying:", systemTheme);
      }
    };

    // Add listener only if theme is 'system' initially or switched to it
    // For simplicity, we can just always add/remove, but checking `theme === 'system'` is cleaner
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup listener on component unmount or when theme is no longer 'system'
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]); // Dependency on theme ensures listener logic is up-to-date


  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme); // Save theme choice
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Custom hook to use the theme context easily
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};