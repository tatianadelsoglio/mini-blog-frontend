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

const TIME_ZONE = "America/Argentina/Buenos_Aires";

const SHORT_FORMATTER = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const LONG_FORMATTER = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
});

function parseDate(dateString?: string | null): Date | null {
  if (!dateString) return null;
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "12 nov 2026" en horario de Argentina (el servidor suele estar en UTC). null si falta o es inválida. */
export function formatDate(dateString?: string | null): string | null {
  const date = parseDate(dateString);
  if (!date) return null;
  const parts = SHORT_FORMATTER.formatToParts(date);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value.replace(/\.$/, "") ?? "";
  return `${pick("day")} ${pick("month")} ${pick("year")}`;
}

/** "12 de noviembre de 2026" en horario de Argentina. null si falta o es inválida. */
export function formatDateLong(dateString?: string | null): string | null {
  const date = parseDate(dateString);
  return date ? LONG_FORMATTER.format(date) : null;
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
