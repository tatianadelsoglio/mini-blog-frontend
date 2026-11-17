import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import { getPageSlots } from "@/lib/pagination";
import { buildHistoriasHref, type HistoriasParams } from "@/lib/postFilters";

interface PaginationProps {
  page: number;
  pageCount: number;
  filters: Pick<HistoriasParams, "categoria" | "q">;
}

const stepBase =
  "inline-flex h-touch items-center gap-tight rounded-sm px-sm font-body text-label font-medium text-text-primary";
const pageBase =
  "inline-flex size-touch items-center justify-center rounded-sm font-body text-label font-medium";
const mobileStep =
  "inline-flex size-touch items-center justify-center rounded-sm border text-text-primary";

export function Pagination({ page, pageCount, filters }: PaginationProps) {
  if (pageCount <= 1) return null;

  const href = (target: number) => buildHistoriasHref({ ...filters, pagina: target });
  const hasPrev = page > 1;
  const hasNext = page < pageCount;

  return (
    <nav aria-label="Paginación" className="border-t border-border pt-lg lg:pt-xl">
      {/* Desktop: Anterior · páginas · Siguiente */}
      <ul className="hidden items-center justify-center gap-2xs lg:flex">
        <li>
          {hasPrev ? (
            <Link href={href(page - 1)} rel="prev" className={`${stepBase} hover:bg-bg-card`}>
              <ArrowLeftIcon className="size-icon-sm" />
              Anterior
            </Link>
          ) : (
            <span aria-hidden="true" className={`${stepBase} opacity-40`}>
              <ArrowLeftIcon className="size-icon-sm" />
              Anterior
            </span>
          )}
        </li>
        {getPageSlots(page, pageCount).map((slot, index) =>
          slot === "ellipsis" ? (
            <li key={`ellipsis-${index}`} aria-hidden="true" className={`${pageBase} text-text-secondary`}>
              …
            </li>
          ) : (
            <li key={slot}>
              <Link
                href={href(slot)}
                aria-current={slot === page ? "page" : undefined}
                aria-label={`Página ${slot}`}
                className={`${pageBase} ${
                  slot === page
                    ? "bg-bg-inverse text-text-inverse"
                    : "text-text-primary hover:bg-bg-card"
                }`}
              >
                {slot}
              </Link>
            </li>
          )
        )}
        <li>
          {hasNext ? (
            <Link href={href(page + 1)} rel="next" className={`${stepBase} hover:bg-bg-card`}>
              Siguiente
              <ArrowRightIcon className="size-icon-sm" />
            </Link>
          ) : (
            <span aria-hidden="true" className={`${stepBase} opacity-40`}>
              Siguiente
              <ArrowRightIcon className="size-icon-sm" />
            </span>
          )}
        </li>
      </ul>

      {/* Mobile: ← Página N de M → */}
      <div className="flex items-center justify-between lg:hidden">
        {hasPrev ? (
          <Link href={href(page - 1)} rel="prev" className={`${mobileStep} border-border-strong`}>
            <ArrowLeftIcon className="size-icon-sm" />
            <span className="sr-only">Página anterior</span>
          </Link>
        ) : (
          <span aria-hidden="true" className={`${mobileStep} border-border opacity-40`}>
            <ArrowLeftIcon className="size-icon-sm" />
            <span className="sr-only">Página anterior</span>
          </span>
        )}
        <p className="font-body text-label font-medium text-text-primary">
          Página {page} de {pageCount}
        </p>
        {hasNext ? (
          <Link href={href(page + 1)} rel="next" className={`${mobileStep} border-border-strong`}>
            <ArrowRightIcon className="size-icon-sm" />
            <span className="sr-only">Página siguiente</span>
          </Link>
        ) : (
          <span aria-hidden="true" className={`${mobileStep} border-border opacity-40`}>
            <ArrowRightIcon className="size-icon-sm" />
            <span className="sr-only">Página siguiente</span>
          </span>
        )}
      </div>
    </nav>
  );
}
