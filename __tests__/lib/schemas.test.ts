import { afterEach, describe, expect, it, vi } from "vitest";
import { getImageUrl } from "@/lib/images";
import { aboutSchema, postSchema } from "@/lib/schemas";
import { parseStrapi, parseStrapiList, StrapiError } from "@/lib/strapi";

const rawPost = (overrides: Record<string, unknown> = {}) => ({
  id: 1,
  documentId: "doc-1",
  title: "Un post",
  slug: "un-post",
  excerpt: null,
  content: "Texto",
  publishedAt: "2026-11-12T12:00:00.000Z",
  updatedAt: null,
  coverImage: null,
  category: null,
  ...overrides,
});

const envelope = (data: unknown[]) => ({
  data,
  meta: { pagination: { page: 1, pageCount: 1, total: data.length } },
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("parseStrapiList", () => {
  it("deja pasar los items válidos y devuelve la paginación", () => {
    const json = envelope([rawPost(), rawPost({ id: 2, slug: "otro" })]);
    const { items, pagination } = parseStrapiList(postSchema, json, "ctx-validos");

    expect(items.map((post) => post.slug)).toEqual(["un-post", "otro"]);
    expect(pagination).toEqual({ page: 1, pageCount: 1, total: 2 });
  });

  it("descarta los inválidos uno por uno sin romper la lista", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const json = envelope([
      rawPost({ slug: "bueno-1" }),
      rawPost({ documentId: "doc-roto", slug: undefined }),
      "no soy un objeto",
      rawPost({ id: 4, slug: "bueno-2" }),
    ]);

    const { items } = parseStrapiList(postSchema, json, "ctx-descarte");

    expect(items.map((post) => post.slug)).toEqual(["bueno-1", "bueno-2"]);
    expect(warn).toHaveBeenCalledTimes(2);
    expect(warn.mock.calls[0][0]).toContain("doc-roto");
    expect(warn.mock.calls[1][0]).toContain("#2");
  });

  it("loguea un item inválido una sola vez por contexto", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const json = envelope([rawPost({ documentId: "doc-repetido", title: 5 })]);

    parseStrapiList(postSchema, json, "ctx-repetido");
    parseStrapiList(postSchema, json, "ctx-repetido");

    expect(warn).toHaveBeenCalledTimes(1);
  });

  it("lanza StrapiError si el sobre es inválido", () => {
    expect(() => parseStrapiList(postSchema, { data: "x" }, "ctx-sobre")).toThrow(
      StrapiError
    );
  });
});

describe("parseStrapi", () => {
  it("el error nombra el contexto y el campo que falló", () => {
    expect(() => parseStrapi(postSchema, rawPost({ id: "x" }), "GET /api/posts")).toThrow(
      /GET \/api\/posts.*id/
    );
  });
});

describe("postSchema: campos opcionales y degradación", () => {
  it("sin imagen de portada el post sigue siendo válido (coverImage null)", () => {
    for (const coverImage of [null, undefined]) {
      const post = postSchema.parse(rawPost({ coverImage }));
      expect(post.coverImage).toBeNull();
      expect(getImageUrl(post.coverImage)).toBeNull();
    }
  });

  it("content, excerpt y category nulos se normalizan", () => {
    const post = postSchema.parse(
      rawPost({ content: null, excerpt: undefined, category: null })
    );
    expect(post.content).toBe("");
    expect(post.excerpt).toBeNull();
    expect(post.category).toBeNull();
  });

  it("una imagen sin dimensiones ni formatos es válida", () => {
    const post = postSchema.parse(
      rawPost({ coverImage: { url: "/uploads/foto.jpg" } })
    );
    expect(post.coverImage).toMatchObject({
      url: "/uploads/foto.jpg",
      alternativeText: null,
      formats: null,
    });
  });

  it("getImageUrl prefiere el formato pedido y cae a la url original", () => {
    const image = postSchema.parse(
      rawPost({
        coverImage: {
          url: "/uploads/original.jpg",
          formats: {
            small: { url: "/uploads/small.jpg", width: 500, height: 300 },
          },
        },
      })
    ).coverImage;

    expect(getImageUrl(image, "small")).toBe("http://localhost:1337/uploads/small.jpg");
    expect(getImageUrl(image, "large")).toBe("http://localhost:1337/uploads/original.jpg");
  });

  it("una imagen de un host no permitido degrada a null en vez de fallar", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const image = postSchema.parse(
      rawPost({ coverImage: { url: "https://otro-host.example/foto.jpg" } })
    ).coverImage;
    expect(getImageUrl(image)).toBeNull();
  });
});

describe("aboutSchema: enlaces externos", () => {
  const rawAbout = (urls: Record<string, unknown>) => ({
    id: 1,
    documentId: "about",
    title: "Sobre",
    ...urls,
  });

  it("acepta https y descarta lo demás", () => {
    const about = aboutSchema.parse(
      rawAbout({
        githubUrl: "https://github.com/alguien",
        linkedinUrl: "javascript:alert(1)",
      })
    );
    expect(about.githubUrl).toBe("https://github.com/alguien");
    expect(about.linkedinUrl).toBeNull();
  });

  it("http, texto suelto y vacío se normalizan a null", () => {
    const about = aboutSchema.parse(
      rawAbout({ githubUrl: "http://github.com/x", linkedinUrl: "no es url" })
    );
    expect(about.githubUrl).toBeNull();
    expect(about.linkedinUrl).toBeNull();
    expect(aboutSchema.parse(rawAbout({ githubUrl: "" })).githubUrl).toBeNull();
  });
});
