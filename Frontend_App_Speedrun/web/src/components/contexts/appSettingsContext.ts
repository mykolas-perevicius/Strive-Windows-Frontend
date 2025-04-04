// src/components/contexts/appSettingsContext.ts
import { createContext } from 'react';
import type { AppSettingsProviderState } from './AppSettingsProvider'; // Import the type

// Define the initial state here as well or import it
const initialState: AppSettingsProviderState = {
  theme: "system",
  setTheme: () => null,
  language: "en",
  setLanguage: () => null,
};

// Create and export the context
export const AppSettingsProviderContext = createContext<AppSettingsProviderState>(initialState);