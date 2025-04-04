import { useLocation } from 'react-router-dom';

export function PlaceholderPage() {
  const location = useLocation();
  const pageName = location.pathname.replace('/', '').replace('-', ' '); // Basic name extraction

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center p-4 text-center"> {/* Adjust min-height if needed */}
      <h1 className="mb-4 text-3xl font-bold capitalize">{pageName || 'Page'}</h1>
      <p className="text-muted-foreground">Content coming soon!</p>
      {/* You can add relevant icons here based on pageName if desired */}
    </div>
  );
}

export default PlaceholderPage;