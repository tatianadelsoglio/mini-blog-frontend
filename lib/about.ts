import { ABOUT_TAG } from "@/lib/cacheTags";
import { aboutSchema, singleResponseSchema, type About } from "@/lib/schemas";
import { parseStrapi, strapiFetch } from "@/lib/strapi";

const aboutResponseSchema = singleResponseSchema(aboutSchema);

/** About (single type). Devuelve null si todavía no está creado o publicado. */
export async function getAbout(): Promise<About | null> {
  const json = await strapiFetch("/api/about?populate[0]=photo", {
    tags: [ABOUT_TAG],
    allowNotFound: true,
  });
  if (json === null) return null;
  return parseStrapi(aboutResponseSchema, json, "GET /api/about").data;
}
