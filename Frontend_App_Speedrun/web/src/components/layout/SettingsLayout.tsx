// src/components/layout/SettingsLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import { SettingsNav } from "@/components/settings/SettingsNav";
// import { Separator } from "@/components/ui/separator"; // Removed unused import
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function SettingsLayout() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/profile'); // Or navigate(-1)
  };

  return (
    <div className="container mx-auto max-w-5xl p-4">
       {/* Header with Back Button */}
       <div className="relative mb-6 flex items-center">
         <Button
           variant="ghost"
           size="icon"
           className="-ml-4"
           onClick={handleBackClick}
           aria-label="Go back to profile"
         >
           <ArrowLeft className="h-5 w-5" />
         </Button>
       </div>

      {/* Main Settings Area */}
      <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <SettingsNav />
        </aside>

        {/* Content Area */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// Default export might be useful if you ever lazy load this layout
// export default SettingsLayout;