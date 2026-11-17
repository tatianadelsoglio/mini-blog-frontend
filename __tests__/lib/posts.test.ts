import { beforeEach, describe, expect, it, vi } from "vitest";
import { getAdjacentPosts } from "@/lib/postNavigation";
import { getPostBySlug, getPosts } from "@/lib/posts";
import { postSchema, type Post } from "@/lib/schemas";
import { strapiFetch } from "@/lib/strapi";

// Se mockea solo la red; la validación y el armado de la lista son los reales.
vi.mock("@/lib/strapi", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/strapi")>()),
  strapiFetch: vi.fn(),
}));

const fetchMock = vi.mocked(strapiFetch);

const rawPost = (slug: string, category?: string) => ({
  id: slug.length,
  documentId: `doc-${slug}`,
  title: slug,
  slug,
  content: "",
  category: category
    ? { id: 1, documentId: `cat-${category}`, name: category, slug: category }
    : null,
});

const page = (data: unknown[], pageNumber: number, pageCount: number) => ({
  data,
  meta: { pagination: { page: pageNumber, pageCount, total: 99 } },
});

beforeEach(() => {
  fetchMock.mockReset();
});

describe("getPosts", () => {
  it("recorre todas las páginas de Strapi y usa el tag 'posts'", async () => {
    fetchMock
      .mockResolvedValueOnce(page([rawPost("a")], 1, 2))
      .mockResolvedValueOnce(page([rawPost("b")], 2, 2));

    const posts = await getPosts();

    expect(posts.map((post) => post.slug)).toEqual(["a", "b"]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][0]).toContain("pagination%5Bpage%5D=1");
    expect(fetchMock.mock.calls[1][0]).toContain("pagination%5Bpage%5D=2");
    expect(fetchMock.mock.calls[0][1]).toEqual({ tags: ["posts"] });
  });
});

describe("getPostBySlug", () => {
  it("resuelve el slug contra la lista cacheada", async () => {
    fetchMock.mockResolvedValue(page([rawPost("a"), rawPost("b")], 1, 1));

    const post = await getPostBySlug("b");

    expect(post?.slug).toBe("b");
  });

  it("devuelve null si el slug no existe", async () => {
    fetchMock.mockResolvedValue(page([rawPost("a")], 1, 1));

    await expect(getPostBySlug("no-existe")).resolves.toBeNull();
  });

  it("un slug inexistente no hace ningún pedido extra a Strapi", async () => {
    fetchMock.mockResolvedValue(page([rawPost("a")], 1, 1));

    await getPostBySlug("no-existe");

    // Un solo fetch: el de la lista (cacheada); no hay consulta por slug.
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).not.toContain("no-existe");
  });
});

describe("getAdjacentPosts", () => {
  const parse = (slug: string, category?: string): Post =>
    postSchema.parse(rawPost(slug, category));

  // Del más nuevo al más viejo.
  const posts = [
    parse("nuevo"),
    parse("poema-2", "poemas"),
    parse("medio"),
    parse("poema-1", "poemas"),
    parse("viejo"),
  ];

  it("anterior es el más viejo y siguiente el más nuevo", () => {
    const { previous, next } = getAdjacentPosts(posts, posts[2]);
    expect(previous?.slug).toBe("poema-1");
    expect(next?.slug).toBe("poema-2");
  });

  it("los extremos no tienen vecino de ese lado", () => {
    expect(getAdjacentPosts(posts, posts[0]).next).toBeNull();
    expect(getAdjacentPosts(posts, posts[4]).previous).toBeNull();
  });

  it("los poemas navegan solo entre poemas", () => {
    const { previous, next } = getAdjacentPosts(posts, posts[1]);
    expect(previous?.slug).toBe("poema-1");
    expect(next).toBeNull();
  });
});
