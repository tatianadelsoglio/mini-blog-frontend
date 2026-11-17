"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { useTheme } from "@/hooks/useTheme";

// El ícono y el nombre accesible dependen del tema vía CSS (variante dark),
// así el HTML del servidor coincide con el del cliente sin parpadeo.
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex size-touch items-center justify-center rounded-full text-text-primary transition-colors hover:bg-bg-card ${className}`}
    >
      <MoonIcon className="size-icon-md dark:hidden" />
      <SunIcon className="hidden size-icon-md dark:block" />
      <span className="sr-only dark:hidden">Activar modo oscuro</span>
      <span className="sr-only hidden dark:inline">Activar modo claro</span>
    </button>
  );
}
