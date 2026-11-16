export interface PoemSegment {
  text: string;
  style: "plain" | "italic" | "bold";
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

// Como en Markdown, el delimitador de apertura debe ir pegado a un carácter
// no espacio y el de cierre también: "* * *" no abre ni cierra nada y queda
// como texto literal. El guion bajo solo cuenta en límites de palabra.
//   1: **negrita**   2: *cursiva*   3: _cursiva_
const INLINE =
  /\*\*(?=\S)([^\n]*?\S)\*\*|\*(?=[^\s*])([^*\n]*?[^\s*])\*|(?<![\p{L}\p{N}_])_(?=[^\s_])([^_\n]*?[^\s_])_(?![\p{L}\p{N}_])/gu;

export function parseInline(line: string): PoemSegment[] {
  const segments: PoemSegment[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(INLINE)) {
    if (match.index > lastIndex) {
      segments.push({ text: line.slice(lastIndex, match.index), style: "plain" });
    }
    if (match[1] !== undefined) {
      segments.push({ text: match[1], style: "bold" });
    } else {
      segments.push({ text: match[2] ?? match[3], style: "italic" });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < line.length) {
    segments.push({ text: line.slice(lastIndex), style: "plain" });
  }
  return segments;
}

/** Estrofa que es solo un separador ornamental ("* * *", "***", "---"). */
export function isStanzaBreak(stanza: string): boolean {
  return /^\s*(?:(?:\*\s*){3,}|(?:-\s*){3,})$/.test(stanza);
}
