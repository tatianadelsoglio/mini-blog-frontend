import type { StrapiImage } from "@/lib/schemas";

type ImageSize = "thumbnail" | "small" | "medium" | "large";

/** URL de la imagen. Supabase devuelve URLs absolutas; las relativas son de Strapi. */
export function getImageUrl(
  image: StrapiImage | null,
  size: ImageSize = "large"
): string | null {
  if (!image) return null;
  const url = image.formats?.[size]?.url ?? image.url;
  if (/^https?:\/\//.test(url)) return url;
  return `${process.env.STRAPI_URL?.replace(/\/$/, "") ?? ""}${url}`;
}
