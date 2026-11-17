import { isStanzaBreak, parseInline, splitStanzas } from "@/lib/poem";

/**
 * Estrofas del poema sin pasar por Markdown: respeta espacios iniciales,
 * saltos de línea, cursivas/negritas marcadas y el separador "* * *". Cada
 * verso es un bloque con sangría francesa para que los largos no corten a ras.
 */
export function PoemContent({ content }: { content: string }) {
  const stanzas = splitStanzas(content);

  return (
    <div className="flex flex-col gap-loose lg:gap-touch">
      {stanzas.map((stanza, index) =>
        isStanzaBreak(stanza) ? (
          <p
            key={index}
            aria-hidden="true"
            className="font-heading text-poem-mobile tracking-caps text-text-secondary lg:text-poem"
          >
            * * *
          </p>
        ) : (
          <p
            key={index}
            className="font-heading text-poem-mobile text-text-primary lg:text-poem"
          >
            {stanza.split("\n").map((verse, i) => (
              <span
                key={i}
                className="block pl-verse-hang -indent-verse-hang whitespace-pre-wrap"
              >
                {parseInline(verse).map((segment, j) => {
                  if (segment.style === "italic") return <em key={j}>{segment.text}</em>;
                  if (segment.style === "bold") return <strong key={j}>{segment.text}</strong>;
                  return segment.text;
                })}
              </span>
            ))}
          </p>
        )
      )}
    </div>
  );
}
