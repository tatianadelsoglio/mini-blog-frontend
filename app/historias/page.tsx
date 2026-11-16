import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HistoriasFilters } from "@/components/HistoriasFilters";
import { Pagination } from "@/components/Pagination";
import { PostList } from "@/components/PostList";
import { getCategories } from "@/lib/categories";
import { getPosts } from "@/lib/posts";
import {
  filterPosts,
  paginate,
  parseHistoriasParams,
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

// Los parámetros de la URL hacen que la página se renderice por request, pero
// los datos salen de la caché de fetch (tags posts/categories): Strapi no se
// consulta en cada búsqueda.
export default async function HistoriasPage(props: PageProps<"/historias">) {
  const filters = parseHistoriasParams(await props.searchParams);
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);

  const filtered = filterPosts(posts, filters);
  const { items, page, pageCount, total } = paginate(filtered, filters.pagina);
  const hasFilters = Boolean(filters.categoria || filters.q);

  // paginate ajusta la página al rango válido; si pidieron una que no existe, 404.
  if (filters.pagina > pageCount) notFound();

  return (
    <div className="flex flex-col gap-10 px-6 py-16 sm:px-16">
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-hero font-semibold text-text-primary">
          Historias
        </h1>
        <p className="font-body text-body-lg text-text-secondary">
          {total} {total === 1 ? "historia" : "historias"}
          {hasFilters ? (total === 1 ? " encontrada" : " encontradas") : ""}
        </p>
      </header>

      <HistoriasFilters
        categories={categories}
        categoria={filters.categoria}
        q={filters.q}
      />

      <PostList
        posts={items}
        emptyMessage={
          hasFilters
            ? "No encontramos historias con esos filtros."
            : "Todavía no hay posts publicados."
        }
      />

      <Pagination page={page} pageCount={pageCount} filters={filters} />
    </div>
  );
}
