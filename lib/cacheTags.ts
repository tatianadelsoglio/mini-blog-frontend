// Tags de caché compartidos entre la capa de datos y /api/revalidate.
export const POSTS_TAG = "posts";
export const CATEGORIES_TAG = "categories";
export const ABOUT_TAG = "about";

export const postTag = (slug: string) => `post:${slug}`;

export const ALL_TAGS = [POSTS_TAG, CATEGORIES_TAG, ABOUT_TAG] as const;

// Fallback por si el webhook falla: Next sirve lo cacheado y regenera en
// segundo plano cuando pasó este tiempo. 7 días.
export const FALLBACK_REVALIDATE_SECONDS = 60 * 60 * 24 * 7;
