import { POSTS_TAG, postTag } from "@/lib/cacheTags";
import {
  listResponseSchema,
  postSchema,
  type Post,
} from "@/lib/schemas";
import { parseStrapi, strapiFetch } from "@/lib/strapi";

const PAGE_SIZE = 50;
const postListSchema = listResponseSchema(postSchema);

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
    const parsed = parseStrapi(postListSchema, json, "GET /api/posts");
    posts.push(...parsed.data);
    pageCount = parsed.meta.pagination.pageCount;
    page += 1;
  } while (page <= pageCount);

  return posts;
}

/** Un post por slug, o null si no existe. Tags: "posts" y "post:<slug>". */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const json = await strapiFetch(
    `/api/posts?${postsQuery({
      "filters[slug][$eq]": slug,
      "pagination[pageSize]": "1",
    })}`,
    { tags: [POSTS_TAG, postTag(slug)] }
  );
  const parsed = parseStrapi(postListSchema, json, `GET /api/posts (slug=${slug})`);
  return parsed.data[0] ?? null;
}
