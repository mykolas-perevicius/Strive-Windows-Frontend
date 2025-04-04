// src/pages/app/settings/SettingsAppearancePage.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

// Import the actual useTheme hook from the correct location
import { useTheme } from "@/components/contexts/ThemeProvider"; // <-- Corrected path alias
import { Sun, Moon, Laptop } from "lucide-react";

export function SettingsAppearancePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Appearance</h1>

      {/* Theme Selection Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Theme</h2>
        <p className="text-sm text-muted-foreground">
          Select the theme for the application.
        </p>
        <RadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
          className="grid max-w-md grid-cols-1 gap-4 pt-2 sm:grid-cols-3"
        >
          {/* Light Theme Option */}
          <div>
            <RadioGroupItem value="light" id="theme-light" className="peer sr-only" />
            <Label
              htmlFor="theme-light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Sun className="h-5 w-5 mb-2" />
              Light
            </Label>
          </div>
          {/* Dark Theme Option */}
          <div>
            <RadioGroupItem value="dark" id="theme-dark" className="peer sr-only" />
            <Label
              htmlFor="theme-dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Moon className="h-5 w-5 mb-2" />
              Dark
            </Label>
          </div>
          {/* System Theme Option */}
          <div>
            <RadioGroupItem value="system" id="theme-system" className="peer sr-only" />
            <Label
              htmlFor="theme-system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <Laptop className="h-5 w-5 mb-2" />
              System
            </Label>
          </div>
        </RadioGroup>
        <Separator className="mt-6" />
      </section>

       {/* Other appearance sections... */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Background</h2>
        <p className="text-sm text-muted-foreground">
          Background settings coming soon...
        </p>
      </section>

    </div>
  );
}

export default SettingsAppearancePage;