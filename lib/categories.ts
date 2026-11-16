import { CATEGORIES_TAG } from "@/lib/cacheTags";
import { categorySchema, listResponseSchema, type Category } from "@/lib/schemas";
import { parseStrapi, strapiFetch } from "@/lib/strapi";

const categoryListSchema = listResponseSchema(categorySchema);

export const POEMS_CATEGORY_SLUG = "poemas";

export async function getCategories(): Promise<Category[]> {
  const query = new URLSearchParams({
    sort: "name:asc",
    "pagination[pageSize]": "100",
  });
  const json = await strapiFetch(`/api/categories?${query}`, {
    tags: [CATEGORIES_TAG],
  });
  return parseStrapi(categoryListSchema, json, "GET /api/categories").data;
}

export interface CategoryWithCount extends Category {
  postCount: number;
}

/** Cantidad de posts publicados por categoría, calculada sobre los posts cacheados. */
export function withPostCount(
  categories: Category[],
  posts: { category: { slug: string } | null }[]
): CategoryWithCount[] {
  return categories.map((category) => ({
    ...category,
    postCount: posts.filter((post) => post.category?.slug === category.slug)
      .length,
  }));
}
