"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  {
    href: "/historias",
    label: "Historias",
    match: (path: string) =>
      path.startsWith("/historias") || path.startsWith("/posts"),
  },
  {
    href: "/sobre",
    label: "Sobre",
    match: (path: string) => path.startsWith("/sobre"),
  },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Principal" className="flex items-center gap-6 sm:gap-8">
      {LINKS.map(({ href, label, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`border-b pb-0.5 font-body text-caption tracking-wide uppercase transition-colors ${
              active
                ? "border-accent text-text-primary"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
