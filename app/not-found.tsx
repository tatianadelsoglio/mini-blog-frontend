import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-start gap-4 px-6 py-16 sm:px-16">
      <h1 className="font-heading text-h2 font-semibold text-text-primary">
        No encontramos esta página
      </h1>
      <p className="font-body text-body text-text-secondary">
        El post que buscás no existe o fue movido.
      </p>
      <Link
        href="/"
        className="font-body text-caption tracking-wide text-accent uppercase"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}
