// src/pages/app/settings/SettingsLanguagePage.tsx
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Import the real hook
import { useAppSettings } from "@/hooks/useAppSettings"; // <-- Update path/name

// Remove the placeholder useLanguage hook

const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export function SettingsLanguagePage() {
  // Use the real hook
  const { language, setLanguage } = useAppSettings(); // Use language parts here

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Language</h1>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Select Language</h2>
        <p className="text-sm text-muted-foreground"> Choose the language displayed in the application. </p>
        <RadioGroup
          value={language}
          // Ensure the type matches the Language type in the context
          onValueChange={(value) => setLanguage(value as "en" | "es")}
          className="grid max-w-md grid-cols-1 gap-4 pt-2 sm:grid-cols-2"
        >
          {availableLanguages.map((lang) => (
            <div key={lang.code}>
              <RadioGroupItem value={lang.code} id={`lang-${lang.code}`} className="peer sr-only" />
              <Label
                htmlFor={`lang-${lang.code}`}
                className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span>{lang.name}</span>
                <span className="text-xl" role="img" aria-label={`${lang.name} flag`}>{lang.flag}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </section>
    </div>
  );
}

export default SettingsLanguagePage;