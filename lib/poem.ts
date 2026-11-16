export interface PoemSegment {
  text: string;
  italic: boolean;
}

// Separa estrofas por líneas en blanco, sin tocar los espacios iniciales de
// cada verso (a diferencia de Markdown, que los colapsa).
export function splitStanzas(content: string): string[] {
  return content
    .replace(/\r\n?/g, "\n")
    .split(/\n[ \t]*\n(?:[ \t]*\n)*/)
    .map((stanza) => stanza.replace(/^(?:[ \t]*\n)+/, "").trimEnd())
    .filter((stanza) => stanza.length > 0);
}

// Cursiva marcada con *texto* o _texto_ (el guion bajo solo en límites de palabra).
const ITALIC =
  /\*([^*\n]+)\*|(?<![\p{L}\p{N}])_([^_\n]+)_(?![\p{L}\p{N}])/gu;

export function parseItalics(line: string): PoemSegment[] {
  const segments: PoemSegment[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(ITALIC)) {
    if (match.index > lastIndex) {
      segments.push({ text: line.slice(lastIndex, match.index), italic: false });
    }
    segments.push({ text: match[1] ?? match[2], italic: true });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    segments.push({ text: line.slice(lastIndex), italic: false });
  }
  return segments;
}
