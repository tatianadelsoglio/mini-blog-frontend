import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";
import { NavLinks } from "@/components/NavLinks";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex max-w-page items-center justify-between px-lg py-snug lg:px-4xl lg:py-chip">
        <Link
          href="/"
          className="flex min-h-touch items-center font-heading text-logo-mobile font-semibold text-text-primary lg:text-logo"
        >
          Cuaderno
        </Link>

        <div className="hidden items-center gap-md lg:flex">
          <NavLinks />
          <ThemeToggle className="border border-border" />
        </div>

        <div className="flex items-center gap-2xs lg:hidden">
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
