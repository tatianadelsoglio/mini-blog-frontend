import { describe, expect, it } from "vitest";
import { getCategoryCountLabel, withPostCount } from "@/lib/categories";
import { getPageSlots } from "@/lib/pagination";
import {
  buildHistoriasHref,
  filterPosts,
  getResultsLabel,
  isPageOutOfRange,
  paginate,
  parseHistoriasParams,
  POSTS_PER_PAGE,
} from "@/lib/postFilters";
import type { Post } from "@/lib/schemas";

const makePost = (
  slug: string,
  extra: { title?: string; excerpt?: string | null; content?: string; category?: string } = {}
): Post => ({
  id: 1,
  documentId: `doc-${slug}`,
  title: extra.title ?? slug,
  slug,
  excerpt: extra.excerpt ?? null,
  content: extra.content ?? "",
  publishedAt: null,
  updatedAt: null,
  coverImage: null,
  category: extra.category
    ? {
        id: 1,
        documentId: extra.category,
        name: extra.category,
        slug: extra.category,
        description: null,
      }
    : null,
});

describe("paginate", () => {
  const items = Array.from({ length: 14 }, (_, i) => i + 1);

  it("corta por página (6 por defecto)", () => {
    expect(POSTS_PER_PAGE).toBe(6);
    expect(paginate(items, 1).items).toEqual([1, 2, 3, 4, 5, 6]);
    expect(paginate(items, 3)).toMatchObject({ items: [13, 14], page: 3, pageCount: 3, total: 14 });
  });

  it("ajusta una página fuera de rango a la última", () => {
    expect(paginate(items, 99).page).toBe(3);
  });

  it("una lista vacía tiene 1 página y ningún item", () => {
    expect(paginate([], 1)).toEqual({ items: [], page: 1, pageCount: 1, total: 0 });
  });

  it("una cantidad exacta no genera página extra", () => {
    expect(paginate(items.slice(0, 12), 1).pageCount).toBe(2);
  });
});

describe("isPageOutOfRange (404)", () => {
  it("dentro de rango no es 404", () => {
    expect(isPageOutOfRange(1, 3)).toBe(false);
    expect(isPageOutOfRange(3, 3)).toBe(false);
  });

  it("pasado el último número es 404", () => {
    expect(isPageOutOfRange(4, 3)).toBe(true);
  });

  it("sin resultados solo la página 1 es válida", () => {
    const { pageCount } = paginate([], 2);
    expect(isPageOutOfRange(1, pageCount)).toBe(false);
    expect(isPageOutOfRange(2, pageCount)).toBe(true);
  });
});

describe("getPageSlots", () => {
  it("una sola página", () => {
    expect(getPageSlots(1, 1)).toEqual([1]);
    expect(getPageSlots(1, 0)).toEqual([1]);
  });

  it("pocas páginas se muestran todas (sin '…' que oculte una sola)", () => {
    expect(getPageSlots(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageSlots(3, 3)).toEqual([1, 2, 3]);
  });

  it("trunca con '…' al inicio, en el medio y al final", () => {
    expect(getPageSlots(1, 8)).toEqual([1, 2, 3, "ellipsis", 8]);
    expect(getPageSlots(5, 9)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 9]);
    expect(getPageSlots(8, 8)).toEqual([1, "ellipsis", 6, 7, 8]);
  });
});

describe("parseHistoriasParams", () => {
  it("valores por defecto", () => {
    expect(parseHistoriasParams({})).toEqual({ categoria: "", q: "", pagina: 1 });
  });

  it("recorta espacios y toma el primer valor si viene repetido", () => {
    expect(
      parseHistoriasParams({ categoria: ["poemas", "otra"], q: "  luz  ", pagina: "2" })
    ).toEqual({ categoria: "poemas", q: "luz", pagina: 2 });
  });

  it("limita la búsqueda a 100 caracteres", () => {
    expect(parseHistoriasParams({ q: "a".repeat(150) }).q).toHaveLength(100);
  });

  it.each(["0", "-3", "abc", ""])("pagina %j inválida cae a 1", (pagina) => {
    expect(parseHistoriasParams({ pagina }).pagina).toBe(1);
  });
});

describe("filterPosts", () => {
  const posts = [
    makePost("a", { title: "Canción del Mar", category: "poemas" }),
    makePost("b", { excerpt: "Una tarde en la montaña", category: "relatos" }),
    makePost("c", { content: "Hablaba del corazón", category: "relatos" }),
    makePost("d"),
  ];

  it("sin filtros devuelve todo", () => {
    expect(filterPosts(posts, { categoria: "", q: "" })).toHaveLength(4);
  });

  it("filtra por categoría (los sin categoría quedan afuera)", () => {
    expect(filterPosts(posts, { categoria: "relatos", q: "" }).map((p) => p.slug)).toEqual([
      "b",
      "c",
    ]);
  });

  it("busca en título, excerpt y contenido", () => {
    const find = (q: string) => filterPosts(posts, { categoria: "", q }).map((p) => p.slug);
    expect(find("mar")).toEqual(["a"]);
    expect(find("montaña")).toEqual(["b"]);
    expect(find("corazon")).toEqual(["c"]);
  });

  it("no distingue mayúsculas ni tildes, en ninguno de los dos lados", () => {
    expect(filterPosts(posts, { categoria: "", q: "CANCION" })).toHaveLength(1);
    expect(filterPosts(posts, { categoria: "", q: "montana" })).toHaveLength(1);
    expect(filterPosts(posts, { categoria: "", q: "corazón" })).toHaveLength(1);
  });

  it("combina categoría y búsqueda", () => {
    expect(filterPosts(posts, { categoria: "poemas", q: "montaña" })).toEqual([]);
    expect(filterPosts(posts, { categoria: "relatos", q: "montaña" })).toHaveLength(1);
  });

  it("sin coincidencias devuelve lista vacía", () => {
    expect(filterPosts(posts, { categoria: "", q: "zzz" })).toEqual([]);
  });
});

describe("buildHistoriasHref", () => {
  it("omite los valores por defecto", () => {
    expect(buildHistoriasHref({})).toBe("/historias");
    expect(buildHistoriasHref({ categoria: "", q: "", pagina: 1 })).toBe("/historias");
  });

  it("arma y codifica los parámetros", () => {
    expect(buildHistoriasHref({ categoria: "poemas", q: "luz y sombra", pagina: 2 })).toBe(
      "/historias?categoria=poemas&q=luz+y+sombra&pagina=2"
    );
  });
});

describe("pluralización", () => {
  it("getResultsLabel: singular, plural y rango de la última página", () => {
    expect(getResultsLabel(1, 1)).toBe("Mostrando 1–1 de 1 historia");
    expect(getResultsLabel(1, 14)).toBe("Mostrando 1–6 de 14 historias");
    expect(getResultsLabel(3, 14)).toBe("Mostrando 13–14 de 14 historias");
  });

  it("getCategoryCountLabel: cuenta con el sustantivo de la categoría", () => {
    const base = { id: 1, documentId: "x", name: "x", description: null };
    const label = (slug: string, postCount: number) =>
      getCategoryCountLabel({ ...base, slug, postCount });
    expect(label("poemas", 1)).toBe("1 poema");
    expect(label("poemas", 0)).toBe("0 poemas");
    expect(label("relatos", 1)).toBe("1 historia");
    expect(label("relatos", 5)).toBe("5 historias");
  });

  it("withPostCount cuenta los posts por categoría", () => {
    const category = { id: 1, documentId: "x", name: "R", slug: "relatos", description: null };
    const [counted] = withPostCount(
      [category],
      [{ category: { slug: "relatos" } }, { category: null }, { category: { slug: "otra" } }]
    );
    expect(counted.postCount).toBe(1);
  });
});
