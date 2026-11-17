import { CopyButton } from "@/components/CopyButton";

interface CodeBlockProps {
  code: string;
  /** Lenguaje del fence (```ts). */
  language: string | null;
  /** title="..." de la meta del fence. */
  title: string | null;
}

/** Bloque de código: cabecera con archivo (o lenguaje) + Copiar; scroll horizontal propio. */
export function CodeBlock({ code, language, title }: CodeBlockProps) {
  const label = title ?? language;

  return (
    <div className="overflow-hidden rounded-md bg-bg-code">
      <div className="flex min-h-touch items-center justify-between gap-md border-b border-code-divider pr-2xs pl-md lg:pr-xs lg:pl-roomy">
        <span className="truncate font-mono text-caption text-code-muted">
          {label ?? "Código"}
        </span>
        <CopyButton text={code} />
      </div>
      <pre
        // Focusable para poder scrollear con teclado cuando desborda.
        tabIndex={0}
        role="region"
        aria-label={label ? `Código: ${label}` : "Código"}
        className="overflow-x-auto p-md lg:px-lg lg:py-roomy"
      >
        <code className="font-mono text-code text-text-code">{code}</code>
      </pre>
    </div>
  );
}
