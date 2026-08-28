import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-6 border-b border-border bg-bg px-6 py-6 sm:px-16">
      <Link
        href="/"
        className="font-heading text-2xl font-semibold text-text-primary"
      >
        Cuaderno
      </Link>
      <nav className="flex items-center gap-8">
        <Link
          href="/"
          className="font-body text-caption tracking-wide text-text-primary uppercase"
        >
          Home
        </Link>
        <span className="font-body text-caption tracking-wide text-text-secondary uppercase">
          Historias
        </span>
        <span className="font-body text-caption tracking-wide text-text-secondary uppercase">
          Sobre
        </span>
      </nav>
    </header>
  );
}
