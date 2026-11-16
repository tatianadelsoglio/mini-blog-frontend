import Link from "next/link";
import type { AdjacentPosts } from "@/lib/postNavigation";

export function PostNavigation({ previous, next }: AdjacentPosts) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Navegación entre posts"
      className="grid grid-cols-1 gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {previous ? (
        <Link href={`/posts/${previous.slug}`} className="flex flex-col gap-1">
          <span className="font-body text-caption tracking-wide text-accent uppercase">
            ← Anterior
          </span>
          <span className="font-heading text-h3 font-semibold text-text-primary">
            {previous.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={`/posts/${next.slug}`}
          className="flex flex-col gap-1 sm:items-end sm:text-right"
        >
          <span className="font-body text-caption tracking-wide text-accent uppercase">
            Siguiente →
          </span>
          <span className="font-heading text-h3 font-semibold text-text-primary">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
