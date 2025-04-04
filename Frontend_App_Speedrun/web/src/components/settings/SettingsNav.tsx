// src/components/settings/SettingsNav.tsx
import { NavLink } from "react-router-dom"; // Use NavLink for active styling
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  UserCog,     // Account
  Palette,     // Appearance
  CreditCard,  // Subscription
  Languages,   // Language
  Mail,        // Contact Us
  LogOut,      // Logout
} from "lucide-react";

const settingsNavItems = [
  { href: "/settings/account", label: "Account", icon: UserCog },
  { href: "/settings/appearance", label: "Appearance", icon: Palette },
  { href: "/settings/subscription", label: "Subscription", icon: CreditCard },
  { href: "/settings/language", label: "Language", icon: Languages },
  { href: "/settings/contact", label: "Contact Us", icon: Mail },
];

// Removed unused class name variables:
// const activeClassName = "bg-muted hover:bg-muted text-primary";
// const inactiveClassName = "hover:bg-transparent hover:underline";

export function SettingsNav() {

  const handleLogout = () => {
    console.log("Logout clicked - Implement actual logout");
    // navigate('/login');
  };

  return (
    <nav className="flex flex-col space-y-1 p-2 md:p-0">
      {settingsNavItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-muted",
              isActive ? "bg-muted text-primary" : "text-muted-foreground"
            )
          }
          end
        >
          <item.icon className="mr-2 h-4 w-4" />
          <span>{item.label}</span>
        </NavLink>
      ))}

      {/* Logout Button */}
      <Button
        variant="ghost"
        className="mt-4 flex w-full justify-start px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </Button>
    </nav>
  );
}