// src/components/settings/SettingsNav.tsx
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppSettings } from "@/hooks/useAppSettings";
import {
  UserCog, Palette, CreditCard, Languages, Mail, LogOut,
} from "lucide-react";

// --- Data and Types ---
const settingsNavItems = [
  { href: "/settings/account", label: "Account", icon: UserCog, tKey: 'account' },
  { href: "/settings/appearance", label: "Appearance", icon: Palette, tKey: 'appearance' },
  { href: "/settings/subscription", label: "Subscription", icon: CreditCard, tKey: 'subscription' },
  { href: "/settings/language", label: "Language", icon: Languages, tKey: 'language' },
  { href: "/settings/contact", label: "Contact Us", icon: Mail, tKey: 'contact' },
];

// Type for translation keys
type TranslationKey = 'account' | 'appearance' | 'subscription' | 'language' | 'contact' | 'logout';

// Type for the translations object
type Translations = {
  [lang in 'en' | 'es']: { // Use specific language codes
    [key in TranslationKey]: string;
  };
};

const translations: Translations = {
  en: {
    account: 'Account',
    appearance: 'Appearance',
    subscription: 'Subscription',
    language: 'Language',
    contact: 'Contact Us',
    logout: 'Logout',
  },
  es: {
    account: 'Cuenta',
    appearance: 'Apariencia',
    subscription: 'Suscripción',
    language: 'Idioma',
    contact: 'Contacto',
    logout: 'Cerrar sesión',
  },
};
// --- End Data and Types ---


export function SettingsNav() {
  const { language } = useAppSettings();

  const handleLogout = () => {
    console.log("Logout clicked - Implement actual logout");
  };

  // Helper function with refined typing
  const t = (key: TranslationKey): string => {
    // Determine the language key, defaulting to 'en' if the current language isn't in our translations
    const langKey: keyof Translations = language in translations ? language : 'en';
    // Get the translation for the determined language and key, fallback to English, then the key itself
    return translations[langKey]?.[key] ?? translations['en']?.[key] ?? key;
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
          <span>{t(item.tKey as TranslationKey)}</span> {/* Cast tKey for safety */}
        </NavLink>
      ))}

      {/* Logout Button */}
      <Button
        variant="ghost"
        className="mt-4 flex w-full justify-start px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>{t('logout')}</span>
      </Button>
    </nav>
  );
}