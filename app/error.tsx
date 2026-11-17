"use client";

import Link from "next/link";
import { buttonVariants, textLinkClass } from "@/components/buttonStyles";
import { CloudOffIcon, RotateCcwIcon } from "@/components/icons";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-status-page-mobile w-full max-w-page flex-col items-center justify-center gap-md px-lg text-center lg:min-h-status-page lg:gap-roomy lg:px-4xl">
      <span className="flex size-error-icon items-center justify-center rounded-full bg-bg-card">
        <CloudOffIcon className="size-icon-error text-error" />
      </span>
      <h1 className="font-heading text-status-title-mobile font-semibold text-text-primary lg:text-status-title">
        Algo salió mal
      </h1>
      <p className="max-w-status-text font-body text-excerpt text-text-secondary lg:text-body-lg">
        No pudimos cargar el contenido. Suele ser algo momentáneo: probá de
        nuevo en unos segundos.
      </p>
      <div className="flex w-full flex-col items-center gap-sm pt-sm lg:w-auto lg:flex-row lg:pt-md">
        <button
          type="button"
          onClick={reset}
          className={`${buttonVariants.primary} w-full lg:w-auto`}
        >
          Reintentar
          <RotateCcwIcon className="size-icon-sm" />
        </button>
        <Link href="/" className={`${textLinkClass} px-sm`}>
          Volver al inicio
        </Link>
      </div>
      {error.digest && (
        <p className="font-mono text-note text-text-secondary">
          Código de referencia: {error.digest}
        </p>
      )}
    </div>
  );
}
