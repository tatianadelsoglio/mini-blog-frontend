import { isAllowedImageUrl } from "@/lib/imageHosts";
import type { StrapiImage } from "@/lib/schemas";

type ImageSize = "thumbnail" | "small" | "medium" | "large";

const warnedUrls = new Set<string>();

/**
 * URL de la imagen lista para next/image, o null si no hay imagen o su origen
 * no está permitido (en ese caso se omite y se loguea una vez, en lugar de
 * romper la página). Supabase devuelve URLs absolutas; las relativas son de Strapi.
 */
export function getImageUrl(
  image: StrapiImage | null,
  size: ImageSize = "large"
): string | null {
  if (!image) return null;
  return resolveImageSrc(image.formats?.[size]?.url ?? image.url);
}

/**
 * Igual que getImageUrl pero para una URL suelta (p. ej. una imagen dentro del
 * Markdown de un post).
 */
export function resolveImageSrc(raw: string): string | null {
  const url = /^https?:\/\//.test(raw)
    ? raw
    : `${process.env.STRAPI_URL?.replace(/\/$/, "") ?? ""}${raw}`;

  if (isAllowedImageUrl(url)) return url;

  if (!warnedUrls.has(url)) {
    warnedUrls.add(url);
    console.warn(
      `[images] Imagen omitida: ${url} no está en los dominios permitidos (revisar STRAPI_URL y SUPABASE_PUBLIC_URL).`
    );
  }
  return null;
}
