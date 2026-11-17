import { CATEGORIES_TAG } from "@/lib/cacheTags";
import { categorySchema, type Category } from "@/lib/schemas";
import { parseStrapiList, strapiFetch } from "@/lib/strapi";

export const POEMS_CATEGORY_SLUG = "poemas";

export async function getCategories(): Promise<Category[]> {
  const query = new URLSearchParams({
    sort: "name:asc",
    "pagination[pageSize]": "100",
  });
  const json = await strapiFetch(`/api/categories?${query}`, {
    tags: [CATEGORIES_TAG],
  });
  return parseStrapiList(categorySchema, json, "GET /api/categories").items;
}

export interface CategoryWithCount extends Category {
  postCount: number;
}

/** "3 historias" / "1 poema": cantidad con el sustantivo de la categoría. */
export function getCategoryCountLabel(category: CategoryWithCount): string {
  const isPoems = category.slug === POEMS_CATEGORY_SLUG;
  const one = isPoems ? "poema" : "historia";
  const many = isPoems ? "poemas" : "historias";
  return `${category.postCount} ${category.postCount === 1 ? one : many}`;
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
