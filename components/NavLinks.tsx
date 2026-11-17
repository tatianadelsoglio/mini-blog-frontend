"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveLink, NAV_LINKS } from "@/lib/navigation";

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal">
      <ul className="flex items-center gap-roomy">
        {NAV_LINKS.map(({ href, label }) => {
          const active = isActiveLink(href, pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className="group flex min-h-touch items-center justify-center rounded-sm px-sm"
              >
                <span
                  className={`border-b-2 pt-cozy pb-sm font-body text-caption font-medium tracking-caps uppercase transition-colors ${
                    active
                      ? "border-accent text-text-primary"
                      : "border-transparent text-text-secondary group-hover:text-text-primary"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
