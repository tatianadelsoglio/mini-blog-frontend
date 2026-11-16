import type { Post } from "@/lib/schemas";

export const POSTS_PER_PAGE = 6;

export interface HistoriasParams {
  categoria: string;
  q: string;
  pagina: number;
}

type RawParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined): string =>
  (Array.isArray(value) ? value[0] : value) ?? "";

export function parseHistoriasParams(raw: RawParams): HistoriasParams {
  const pagina = Number.parseInt(first(raw.pagina), 10);
  return {
    categoria: first(raw.categoria).trim(),
    q: first(raw.q).trim().slice(0, 100),
    pagina: Number.isFinite(pagina) && pagina > 0 ? pagina : 1,
  };
}

// Búsqueda sin distinguir mayúsculas ni tildes.
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

export function filterPosts(
  posts: Post[],
  { categoria, q }: Pick<HistoriasParams, "categoria" | "q">
): Post[] {
  const query = normalize(q);

  return posts.filter((post) => {
    if (categoria && post.category?.slug !== categoria) return false;
    if (!query) return true;
    const haystack = normalize(
      `${post.title} ${post.excerpt ?? ""} ${post.content}`
    );
    return haystack.includes(query);
  });
}

export interface Page<T> {
  items: T[];
  page: number;
  pageCount: number;
  total: number;
}

/** Pagina y ajusta la página pedida al rango válido. */
export function paginate<T>(items: T[], page: number, perPage = POSTS_PER_PAGE): Page<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / perPage));
  const current = Math.min(page, pageCount);
  return {
    items: items.slice((current - 1) * perPage, current * perPage),
    page: current,
    pageCount,
    total: items.length,
  };
}

/** Arma /historias?categoria=&q=&pagina= omitiendo los valores por defecto. */
export function buildHistoriasHref({ categoria, q, pagina }: Partial<HistoriasParams>): string {
  const params = new URLSearchParams();
  if (categoria) params.set("categoria", categoria);
  if (q) params.set("q", q);
  if (pagina && pagina > 1) params.set("pagina", String(pagina));
  const query = params.toString();
  return query ? `/historias?${query}` : "/historias";
}
