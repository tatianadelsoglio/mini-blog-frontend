import { POEMS_CATEGORY_SLUG } from "@/lib/categories";
import type { Post } from "@/lib/schemas";

export interface AdjacentPosts {
  previous: Post | null;
  next: Post | null;
}

/**
 * `posts` viene ordenado del más nuevo al más viejo. "Anterior" es el más
 * viejo y "siguiente" el más nuevo. Los poemas navegan solo entre poemas.
 */
export function getAdjacentPosts(posts: Post[], current: Post): AdjacentPosts {
  const isPoem = current.category?.slug === POEMS_CATEGORY_SLUG;
  const pool = isPoem
    ? posts.filter((post) => post.category?.slug === POEMS_CATEGORY_SLUG)
    : posts;

  const index = pool.findIndex((post) => post.slug === current.slug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: pool[index + 1] ?? null,
    next: pool[index - 1] ?? null,
  };
}
