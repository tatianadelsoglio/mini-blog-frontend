import Image from "next/image";
import { PoemContent } from "@/components/PoemContent";
import { PostMeta } from "@/components/PostMeta";
import { formatDate, formatDateLong } from "@/lib/format";
import { getImageUrl } from "@/lib/images";
import type { Post } from "@/lib/schemas";

/**
 * Poema: título y versos alineados a la izquierda en una columna de 520 px.
 * La portada no va como header: en lg+ es una columna lateral sticky (3:4);
 * en mobile va después del poema, centrada. Sin portada, la columna va sola.
 */
export function PoemArticle({ post }: { post: Post }) {
  const imageUrl = getImageUrl(post.coverImage, "medium");
  const shortDate = formatDate(post.publishedAt);

  return (
    <div
      className={`mx-auto flex w-full max-w-page flex-col lg:px-4xl ${
        imageUrl
          ? "lg:grid lg:grid-cols-[minmax(0,var(--container-poem))_var(--container-poem-image)] lg:justify-center lg:gap-x-section-lg"
          : "lg:items-center"
      }`}
    >
      <div className="w-full px-xl pt-4xl pb-section-md lg:max-w-poem lg:px-0 lg:py-6xl">
        <PostMeta
          className="gap-xs lg:gap-snug"
          items={[
            { key: "category", content: post.category?.name, emphasis: "accent" },
            {
              key: "date",
              content: shortDate && (
                <>
                  <span className="lg:hidden">{shortDate}</span>
                  <span className="hidden lg:inline">
                    {formatDateLong(post.publishedAt)}
                  </span>
                </>
              ),
            },
          ]}
        />

        <div className="flex flex-col gap-airy pt-md pb-3xl lg:gap-relaxed lg:pt-roomy lg:pb-4xl">
          <h1 className="font-heading text-post-title-mobile font-semibold text-text-primary wrap-break-word lg:text-poem-title">
            {post.title}
          </h1>
          <span
            aria-hidden="true"
            className="h-px w-ornament-mobile bg-accent lg:w-ornament"
          />
        </div>

        <PoemContent content={post.content} />
      </div>

      {imageUrl && (
        <figure className="mx-auto w-full max-w-poem-image-mobile pb-section-md lg:sticky lg:top-4xl lg:mt-6xl lg:max-w-poem-image lg:self-start lg:pb-0">
          <div className="relative aspect-3/4 w-full overflow-hidden rounded-md bg-bg-card">
            <Image
              src={imageUrl}
              alt={post.coverImage?.alternativeText || ""}
              fill
              sizes="(min-width: 1024px) 360px, 240px"
              className="object-cover"
            />
          </div>
        </figure>
      )}
    </div>
  );
}
