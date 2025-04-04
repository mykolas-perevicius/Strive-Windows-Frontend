// src/hooks/useAppSettings.ts
import { useContext } from 'react';
// Import the context object from its new file
import { AppSettingsProviderContext } from '@/components/contexts/appSettingsContext';
// Import the type from the Provider file
import type { AppSettingsProviderState } from '@/components/contexts/AppSettingsProvider';

export const useAppSettings = (): AppSettingsProviderState => {
  const context = useContext(AppSettingsProviderContext);

  if (context === undefined) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider");
  }

  return context;
};