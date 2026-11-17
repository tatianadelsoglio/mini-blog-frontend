import { Fragment, type ReactNode } from "react";

export interface MetaItem {
  key: string;
  content: ReactNode;
  /** Categoría o etiqueta: mayúsculas con tracking. */
  emphasis?: "accent" | "accent-strong" | "primary";
  className?: string;
}

const emphasisClass = {
  accent: "font-medium tracking-caps text-accent uppercase",
  // Sobre bg-card el acento no llega a AA: se usa accent-hover.
  "accent-strong": "font-medium tracking-caps text-accent-hover uppercase",
  primary: "font-medium tracking-caps text-text-primary uppercase",
};

/** Fila de meta "CATEGORÍA · fecha · N min de lectura". */
export function PostMeta({
  items,
  className = "gap-xs",
}: {
  items: MetaItem[];
  className?: string;
}) {
  const visible = items.filter((item) => item.content);
  if (visible.length === 0) return null;

  return (
    <p
      className={`flex flex-wrap items-center font-body text-caption text-text-secondary ${className}`}
    >
      {visible.map((item, index) => (
        <Fragment key={item.key}>
          {/* El separador comparte la visibilidad responsive del ítem. */}
          {index > 0 && (
            <span aria-hidden="true" className={item.className}>
              ·
            </span>
          )}
          <span
            className={`${item.emphasis ? emphasisClass[item.emphasis] : ""} ${item.className ?? ""}`}
          >
            {item.content}
          </span>
        </Fragment>
      ))}
    </p>
  );
}
