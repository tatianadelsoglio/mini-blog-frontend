import Link from "next/link";
import { buildHistoriasHref, type HistoriasParams } from "@/lib/postFilters";

interface PaginationProps {
  page: number;
  pageCount: number;
  filters: Pick<HistoriasParams, "categoria" | "q">;
}

const linkClass =
  "rounded-md border border-border px-4 py-2 font-body text-caption tracking-wide uppercase transition-colors";

export function Pagination({ page, pageCount, filters }: PaginationProps) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link
          href={buildHistoriasHref({ ...filters, pagina: page - 1 })}
          rel="prev"
          className={`${linkClass} text-text-secondary hover:border-accent`}
        >
          ← Anterior
        </Link>
      )}
      {pages.map((n) => (
        <Link
          key={n}
          href={buildHistoriasHref({ ...filters, pagina: n })}
          aria-current={n === page ? "page" : undefined}
          className={`${linkClass} ${
            n === page
              ? "border-accent bg-accent text-text-inverse"
              : "text-text-secondary hover:border-accent"
          }`}
        >
          {n}
        </Link>
      ))}
      {page < pageCount && (
        <Link
          href={buildHistoriasHref({ ...filters, pagina: page + 1 })}
          rel="next"
          className={`${linkClass} text-text-secondary hover:border-accent`}
        >
          Siguiente →
        </Link>
      )}
    </nav>
  );
}
