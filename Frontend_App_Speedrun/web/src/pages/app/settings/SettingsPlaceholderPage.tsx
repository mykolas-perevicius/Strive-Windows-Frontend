import { useLocation } from 'react-router-dom';

export function SettingsPlaceholderPage() {
  const location = useLocation();
  // Extract a readable name from the path (e.g., /settings/appearance -> Appearance)
  const pageName = location.pathname.split('/').pop()?.replace('-', ' ') || 'Settings';

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold capitalize">{pageName}</h1>
      <p className="text-muted-foreground">Settings for {pageName} coming soon!</p>
      {/* You could add relevant icons or specific messages based on pageName */}
    </div>
  );
}

export default SettingsPlaceholderPage;