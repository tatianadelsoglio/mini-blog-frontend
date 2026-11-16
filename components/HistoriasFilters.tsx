import Link from "next/link";
import type { Category } from "@/lib/schemas";
import { buildHistoriasHref } from "@/lib/postFilters";

interface HistoriasFiltersProps {
  categories: Category[];
  categoria: string;
  q: string;
}

const chipBase =
  "rounded-full border px-4 py-1.5 font-body text-caption tracking-wide uppercase transition-colors";
const chipActive = "border-accent bg-accent text-text-inverse";
const chipIdle = "border-border text-text-secondary hover:border-accent";

// Formulario GET: funciona sin JS y deja filtro y búsqueda reflejados en la URL.
export function HistoriasFilters({
  categories,
  categoria,
  q,
}: HistoriasFiltersProps) {
  return (
    <div className="flex flex-col gap-6">
      <form
        action="/historias"
        method="get"
        role="search"
        className="flex flex-col gap-3 sm:flex-row"
      >
        {categoria && <input type="hidden" name="categoria" value={categoria} />}
        <label htmlFor="historias-q" className="sr-only">
          Buscar historias
        </label>
        <input
          id="historias-q"
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Buscar por título, extracto o contenido"
          className="w-full rounded-md border border-border bg-bg px-4 py-3 font-body text-body text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none sm:max-w-md"
        />
        <button
          type="submit"
          className="rounded-md bg-bg-inverse px-6 py-3 font-body text-caption tracking-wide text-text-inverse uppercase transition-opacity hover:opacity-90"
        >
          Buscar
        </button>
      </form>

      {categories.length > 0 && (
        <nav aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
          <Link
            href={buildHistoriasHref({ q })}
            aria-current={!categoria ? "true" : undefined}
            className={`${chipBase} ${!categoria ? chipActive : chipIdle}`}
          >
            Todas
          </Link>
          {categories.map((category) => {
            const active = category.slug === categoria;
            return (
              <Link
                key={category.id}
                href={buildHistoriasHref({ categoria: category.slug, q })}
                aria-current={active ? "true" : undefined}
                className={`${chipBase} ${active ? chipActive : chipIdle}`}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
