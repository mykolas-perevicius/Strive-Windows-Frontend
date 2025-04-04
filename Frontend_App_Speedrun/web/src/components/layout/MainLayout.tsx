import { Outlet } from "react-router-dom"; // Outlet renders the matched child route component
import { BottomNav } from "./BottomNav";

export function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Main content area */}
      <main className="flex-1 pb-16"> {/* Add padding-bottom equal to nav height */}
        <Outlet /> {/* Child routes (ProfilePage, etc.) will render here */}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}