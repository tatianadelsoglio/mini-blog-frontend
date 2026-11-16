// Símbolos de Markdown a quitar. El guion bajo solo se quita en límites de
// palabra (_cursiva_), no dentro de ella (snake_case).
const MARKDOWN_SYMBOLS = /[#*`>~[\]]|(?<![\p{L}\p{N}])_|_(?![\p{L}\p{N}])/gu;
// ![alt](url) y [texto](url): se conserva solo el texto.
const MARKDOWN_LINKS = /!?\[([^\]]*)\]\([^)]*\)/g;

function stripMarkdown(content: string, replacement: string): string {
  return content
    .replace(MARKDOWN_LINKS, "$1")
    .replace(MARKDOWN_SYMBOLS, replacement);
}

/** Texto plano corto a partir de markdown, para cuando el post no tiene excerpt. */
export function getExcerpt(content: string, maxLength = 140): string {
  const plain = stripMarkdown(content, "").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trimEnd()}…`;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "America/Argentina/Buenos_Aires",
});

/** Fecha en horario de Argentina (el servidor suele estar en UTC). null si falta o es inválida. */
export function formatDate(dateString?: string | null): string | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return DATE_FORMATTER.format(date).toUpperCase();
}

const WORDS_PER_MINUTE = 200;

/** Minutos de lectura (mínimo 1) a ~200 palabras por minuto. */
export function getReadingTime(content: string): number {
  const words = stripMarkdown(content, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** Resumen de un post: el excerpt de Strapi, o un recorte del contenido si falta. */
export function getPostSummary(
  post: { excerpt: string | null; content: string },
  maxLength = 140
): string {
  return post.excerpt?.trim() || getExcerpt(post.content, maxLength);
}
