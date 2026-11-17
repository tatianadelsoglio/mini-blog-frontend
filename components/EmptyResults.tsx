import Link from "next/link";
import { buttonVariants } from "@/components/buttonStyles";
import { CloseIcon, SearchXIcon } from "@/components/icons";
import { buildHistoriasHref } from "@/lib/postFilters";

interface EmptyResultsProps {
  q: string;
  categoria: string;
  categoryName: string | null;
}

/** Estado "Sin resultados" de /historias. */
export function EmptyResults({ q, categoria, categoryName }: EmptyResultsProps) {
  const hasFilters = Boolean(q || categoria);

  const title = q
    ? `No encontramos historias para “${q}”`
    : categoryName
      ? `Todavía no hay historias en ${categoryName}`
      : categoria
        ? "No encontramos esa categoría"
        : "Todavía no hay historias publicadas";

  return (
    <div className="flex flex-col items-center gap-roomy pt-4xl pb-section-lg text-center lg:pb-section-xl">
      <span className="flex size-status-icon items-center justify-center rounded-full bg-bg-card">
        <SearchXIcon className="size-icon-status text-accent-hover" />
      </span>
      <h2 className="font-heading text-h2 font-semibold text-text-primary">
        {title}
      </h2>
      {hasFilters && (
        <>
          <p className="font-body text-body text-text-secondary">
            {q
              ? "Probá con otra palabra, revisá la ortografía o mirá todas las categorías."
              : "Mirá todas las categorías."}
          </p>
          <div className="pt-sm">
            <Link
              href={q ? buildHistoriasHref({ categoria }) : buildHistoriasHref({})}
              className={buttonVariants.secondary}
            >
              {q ? "Limpiar búsqueda" : "Ver todas las categorías"}
              <CloseIcon className="size-icon-sm" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
