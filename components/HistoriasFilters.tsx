import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { buildHistoriasHref } from "@/lib/postFilters";
import type { Category } from "@/lib/schemas";

interface HistoriasFiltersProps {
  categories: Category[];
  categoria: string;
  q: string;
}

const chipBase =
  "inline-flex h-touch shrink-0 items-center rounded-full border px-chip font-body text-label font-medium whitespace-nowrap transition-colors";
const chipActive = "border-bg-inverse bg-bg-inverse text-text-inverse";
const chipIdle = "border-border-strong text-text-primary hover:bg-bg-card";

// Formulario GET: funciona sin JS y deja filtro y búsqueda reflejados en la URL.
export function HistoriasFilters({
  categories,
  categoria,
  q,
}: HistoriasFiltersProps) {
  return (
    <div className="flex flex-col gap-md lg:flex-row lg:items-center lg:justify-between lg:gap-lg">
      <form
        action="/historias"
        method="get"
        role="search"
        className="lg:order-2"
      >
        {categoria && <input type="hidden" name="categoria" value={categoria} />}
        <label htmlFor="historias-q" className="sr-only">
          Buscar historias por título, extracto o contenido
        </label>
        <div
          className={`focus-ring-within flex h-control w-full items-center gap-snug rounded-sm border bg-bg px-md lg:w-search ${
            q ? "border-text-primary" : "border-border-strong"
          }`}
        >
          <SearchIcon className="size-icon-md shrink-0 text-text-secondary" />
          <input
            id="historias-q"
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Buscar por título o palabra…"
            className="h-full w-full min-w-0 bg-transparent font-body text-input text-text-primary placeholder:text-text-secondary"
          />
        </div>
      </form>

      {categories.length > 0 && (
        <nav aria-label="Filtrar por categoría" className="lg:order-1">
          {/* En mobile los chips scrollean en horizontal; el padding deja ver el foco. */}
          <ul className="-mx-lg flex gap-xs overflow-x-auto px-lg py-2xs lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
            <li>
              <Link
                href={buildHistoriasHref({ q })}
                aria-current={!categoria ? "page" : undefined}
                className={`${chipBase} ${!categoria ? chipActive : chipIdle}`}
              >
                Todas
              </Link>
            </li>
            {categories.map((category) => {
              const active = category.slug === categoria;
              return (
                <li key={category.id}>
                  <Link
                    href={buildHistoriasHref({ categoria: category.slug, q })}
                    aria-current={active ? "page" : undefined}
                    className={`${chipBase} ${active ? chipActive : chipIdle}`}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
