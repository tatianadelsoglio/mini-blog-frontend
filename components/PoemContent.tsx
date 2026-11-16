import { isStanzaBreak, parseInline, splitStanzas } from "@/lib/poem";

export function PoemContent({ content }: { content: string }) {
  const stanzas = splitStanzas(content);

  return (
    <div className="flex flex-col gap-8">
      {stanzas.map((stanza, index) =>
        isStanzaBreak(stanza) ? (
          <p
            key={index}
            aria-hidden="true"
            className="text-center font-heading text-body-lg tracking-widest text-text-secondary"
          >
            * * *
          </p>
        ) : (
          <p
            key={index}
            className="font-heading text-body-lg whitespace-pre-wrap text-text-primary"
          >
            {parseInline(stanza).map((segment, i) => {
              if (segment.style === "italic") return <em key={i}>{segment.text}</em>;
              if (segment.style === "bold") return <strong key={i}>{segment.text}</strong>;
              return segment.text;
            })}
          </p>
        )
      )}
    </div>
  );
}
