import Link from "next/link";
import type { AdjacentPosts } from "@/lib/postNavigation";

interface PostNavigationProps extends AdjacentPosts {
  /** En poemas la etiqueta es "Poema anterior" (navega entre poemas). */
  isPoem?: boolean;
}

const card =
  "group flex h-full flex-col gap-tight rounded-md border border-border p-roomy transition-colors hover:border-border-strong lg:gap-snug lg:px-xl lg:py-relaxed";
const label =
  "font-body text-caption font-medium tracking-caps text-accent-hover uppercase";
const title =
  "font-heading text-card-title-mobile font-semibold text-text-primary group-hover:text-accent-hover lg:text-card-title";

export function PostNavigation({ previous, next, isPoem = false }: PostNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label={isPoem ? "Otros poemas" : "Otras historias"}
      className="grid grid-cols-1 gap-sm lg:grid-cols-2 lg:gap-lg"
    >
      {previous ? (
        <Link href={`/posts/${previous.slug}`} rel="prev" className={card}>
          <span className={label}>← {isPoem ? "Poema anterior" : "Anterior"}</span>
          <span className={title}>{previous.title}</span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden lg:block" />
      )}
      {next && (
        <Link
          href={`/posts/${next.slug}`}
          rel="next"
          className={`${card} lg:items-end lg:text-right`}
        >
          <span className={label}>Siguiente →</span>
          <span className={title}>{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
