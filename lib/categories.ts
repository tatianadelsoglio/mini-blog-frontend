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
