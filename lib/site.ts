export const SITE_NAME = "Cuaderno";
export const SITE_DESCRIPTION =
  "Historias breves para leer con calma. Notas, reflexiones y pequeños hallazgos de todos los días.";

/** URL pública del sitio: SITE_URL, o el dominio de producción de Vercel, o localhost. */
export function getSiteUrl(): string {
  const explicit = process.env.SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** Imagen Open Graph por defecto (app/opengraph-image.tsx), para páginas sin imagen propia. */
export const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};
