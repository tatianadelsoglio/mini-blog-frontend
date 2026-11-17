import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyResults } from "@/components/EmptyResults";
import { HistoriasFilters } from "@/components/HistoriasFilters";
import { Pagination } from "@/components/Pagination";
import { PostList } from "@/components/PostList";
import { getCategories } from "@/lib/categories";
import { getPosts } from "@/lib/posts";
import {
  filterPosts,
  paginate,
  parseHistoriasParams,
  POSTS_PER_PAGE,
} from "@/lib/postFilters";

export async function generateMetadata(
  props: PageProps<"/historias">
): Promise<Metadata> {
  const { q } = parseHistoriasParams(await props.searchParams);

  return {
    title: "Historias",
    description:
      "Todas las historias de Cuaderno: filtrá por tema o buscá por palabra.",
    alternates: { canonical: "/historias" },
    // Los resultados de búsqueda no se indexan; las páginas y categorías sí.
    ...(q && { robots: { index: false, follow: true } }),
  };
}

const pageX = "mx-auto w-full max-w-page px-lg lg:px-4xl";

function resultsLabel(page: number, total: number): string {
  const from = (page - 1) * POSTS_PER_PAGE + 1;
  const to = Math.min(page * POSTS_PER_PAGE, total);
  const noun = total === 1 ? "historia" : "historias";
  return `Mostrando ${from}–${to} de ${total} ${noun}`;
}

// Los parámetros de la URL hacen que la página se renderice por request, pero
// los datos salen de la caché de fetch (tags posts/categories): Strapi no se
// consulta en cada búsqueda.
export default async function HistoriasPage(props: PageProps<"/historias">) {
  const filters = parseHistoriasParams(await props.searchParams);
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  const filtered = filterPosts(posts, filters);
  const { items, page, pageCount, total } = paginate(filtered, filters.pagina);

  // paginate ajusta la página al rango válido; si pidieron una que no existe, 404.
  if (filters.pagina > pageCount) notFound();

  const categoryName =
    categories.find((category) => category.slug === filters.categoria)?.name ??
    null;

  return (
    <>
      <header
        className={`${pageX} flex flex-col gap-sm pt-3xl pb-lg lg:gap-md lg:pt-5xl lg:pb-2xl`}
      >
        <p className="font-body text-caption font-medium tracking-caps text-accent uppercase">
          Archivo
        </p>
        <h1 className="font-heading text-hero-mobile font-semibold text-text-primary lg:text-hero">
          Historias
        </h1>
        <p className="max-w-page-lead font-body text-lead-compact text-text-secondary lg:text-body-lg">
          Todo lo publicado, del más reciente al más antiguo.
          <span className="hidden lg:inline">
            {" "}
            Filtrá por tema o buscá una palabra.
          </span>
        </p>
      </header>

      <div className={`${pageX} pb-lg`}>
        <HistoriasFilters
          categories={categories}
          categoria={filters.categoria}
          q={filters.q}
        />
      </div>

      <section aria-label="Resultados" className="border-t border-border">
        <div
          className={`${pageX} flex flex-col gap-touch pt-lg pb-section-sm lg:gap-3xl lg:pt-xl lg:pb-section-lg`}
        >
          {/* Anuncia el resultado al filtrar o buscar (navegación del cliente). */}
          <p role="status" className="font-body text-caption text-text-secondary">
            {total === 0 ? "0 historias encontradas" : resultsLabel(page, total)}
          </p>

          {items.length > 0 ? (
            <>
              <PostList posts={items} />
              <Pagination page={page} pageCount={pageCount} filters={filters} />
            </>
          ) : (
            <EmptyResults
              q={filters.q}
              categoria={filters.categoria}
              categoryName={categoryName}
            />
          )}
        </div>
      </section>
    </>
  );
}
