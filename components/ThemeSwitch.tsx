"use client";

import { useTheme } from "@/hooks/useTheme";

// Switch "Modo de lectura nocturna" del menú mobile: mismo estado que ThemeToggle.
export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  const checked = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={toggleTheme}
      className="flex min-h-touch w-full items-center justify-between gap-md text-left"
    >
      <span className="font-body text-input text-text-primary">
        Modo de lectura nocturna
      </span>
      <span
        aria-hidden="true"
        className={`flex h-switch-height w-switch-width shrink-0 items-center rounded-full p-2xs transition-colors ${
          checked ? "bg-accent" : "bg-border-strong"
        }`}
      >
        <span
          className={`size-switch-knob rounded-full bg-bg transition-transform ${
            checked ? "translate-x-switch-travel" : ""
          }`}
        />
      </span>
    </button>
  );
}
