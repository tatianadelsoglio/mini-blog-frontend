"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-4 px-6 py-16 sm:px-16">
      <h1 className="font-heading text-h2 font-semibold text-text-primary">
        Algo salió mal
      </h1>
      <p className="font-body text-body text-text-secondary">
        {error.message || "No pudimos cargar el contenido."}
      </p>
      <button
        onClick={reset}
        className="font-body text-caption tracking-wide text-accent uppercase"
      >
        Reintentar
      </button>
    </div>
  );
}
