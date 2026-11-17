import Link from "next/link";
import { textLinkClass } from "@/components/buttonStyles";
import { VersePreview } from "@/components/VersePreview";
import type { Post } from "@/lib/schemas";

/** "Último poema" del hero: primeros versos del poema más reciente. */
export function LatestPoemAside({ poem }: { poem: Post }) {
  return (
    <aside
      aria-labelledby="ultimo-poema"
      className="flex w-full flex-col gap-snug border-l-2 border-accent py-2xs pl-roomy lg:w-aside lg:shrink-0 lg:gap-cozy lg:py-0 lg:pl-relaxed"
    >
      <p
        id="ultimo-poema"
        className="font-body text-caption font-medium tracking-caps text-text-secondary uppercase"
      >
        Último poema
      </p>
      <VersePreview
        content={poem.content}
        className="text-verse-preview-mobile text-text-primary lg:text-verse-preview"
      />
      <div>
        <Link href={`/posts/${poem.slug}`} className={textLinkClass}>
          Leer el poema
          <span className="sr-only">: {poem.title}</span>
        </Link>
      </div>
    </aside>
  );
}
