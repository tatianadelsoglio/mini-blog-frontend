const MARKDOWN_SYMBOLS = /[#*_`>~[\]]/g;

/** Texto plano corto a partir de markdown, para cuando el post no tiene excerpt. */
export function getExcerpt(content: string, maxLength = 140): string {
  const plain = content.replace(MARKDOWN_SYMBOLS, "").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trimEnd()}…`;
}

export function formatDate(dateString?: string | null): string | null {
  if (!dateString) return null;
  return new Date(dateString)
    .toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}

const WORDS_PER_MINUTE = 200;

/** Minutos de lectura (mínimo 1) a ~200 palabras por minuto. */
export function getReadingTime(content: string): number {
  const words = content.replace(MARKDOWN_SYMBOLS, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Resumen de un post: el excerpt de Strapi, o un recorte del contenido si falta. */
export function getPostSummary(
  post: { excerpt: string | null; content: string },
  maxLength = 140
): string {
  return post.excerpt?.trim() || getExcerpt(post.content, maxLength);
}
