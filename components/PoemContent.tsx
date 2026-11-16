import { parseItalics, splitStanzas } from "@/lib/poem";

export function PoemContent({ content }: { content: string }) {
  const stanzas = splitStanzas(content);

  return (
    <div className="flex flex-col gap-8">
      {stanzas.map((stanza, index) => (
        <p
          key={index}
          className="font-heading text-body-lg whitespace-pre-wrap text-text-primary"
        >
          {parseItalics(stanza).map((segment, i) =>
            segment.italic ? <em key={i}>{segment.text}</em> : segment.text
          )}
        </p>
      ))}
    </div>
  );
}
