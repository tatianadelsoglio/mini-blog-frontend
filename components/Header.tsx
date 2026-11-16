import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";

export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border bg-bg px-6 py-6 sm:px-16">
      <Link
        href="/"
        className="font-heading text-2xl font-semibold text-text-primary"
      >
        Cuaderno
      </Link>
      <NavLinks />
    </header>
  );
}
