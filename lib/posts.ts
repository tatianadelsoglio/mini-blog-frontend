import { POSTS_TAG } from "@/lib/cacheTags";
import { postSchema, type Post } from "@/lib/schemas";
import { parseStrapiList, strapiFetch } from "@/lib/strapi";

const PAGE_SIZE = 50;

function postsQuery(extra: Record<string, string> = {}): string {
  const params = new URLSearchParams({
    "populate[0]": "coverImage",
    "populate[1]": "category",
    sort: "publishedAt:desc",
    "pagination[pageSize]": String(PAGE_SIZE),
    ...extra,
  });
  return params.toString();
}

/** Todos los posts publicados, del más nuevo al más viejo. Cacheado con el tag "posts". */
export async function getPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    const json = await strapiFetch(
      `/api/posts?${postsQuery({ "pagination[page]": String(page) })}`,
      { tags: [POSTS_TAG] }
    );
    const parsed = parseStrapiList(postSchema, json, "GET /api/posts");
    posts.push(...parsed.items);
    pageCount = parsed.pagination.pageCount;
    page += 1;
  } while (page <= pageCount);

  return posts;
}

/**
 * Un post por slug, o null si no existe. Se resuelve contra la lista cacheada:
 * un slug inexistente no consulta a Strapi (ni lo despierta).
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}
