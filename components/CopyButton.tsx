"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons";

const FEEDBACK_MS = 2000;

/**
 * "Copiar" del bloque de código. Anuncia "Copiado" por aria-live; si el
 * navegador no tiene portapapeles (o lo bloquea) no hace nada, sin errores.
 */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), FEEDBACK_MS);
    } catch {
      // Degradación silenciosa: sin permiso o sin contexto seguro.
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-touch items-center gap-tight rounded-sm px-sm font-body text-caption text-code-muted transition-colors hover:text-text-code"
      >
        {copied ? (
          <CheckIcon className="size-icon-xs" />
        ) : (
          <CopyIcon className="size-icon-xs" />
        )}
        {copied ? "Copiado" : "Copiar"}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Código copiado" : ""}
      </span>
    </>
  );
}
