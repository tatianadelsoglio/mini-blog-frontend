import { getPoemPreview, parseInline } from "@/lib/poem";

/** Primeros versos de un poema, con saltos de línea, sangría y cursivas. */
export function VersePreview({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  const lines = getPoemPreview(content);
  if (lines.length === 0) return null;

  return (
    <p className={`font-heading whitespace-pre-wrap italic ${className}`}>
      {lines.map((line, index) => (
        <span key={index} className="block">
          {parseInline(line).map((segment, i) =>
            segment.style === "bold" ? (
              <strong key={i}>{segment.text}</strong>
            ) : (
              segment.text
            )
          )}
        </span>
      ))}
    </p>
  );
}
