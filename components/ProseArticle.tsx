import Image from "next/image";
import { PostContent } from "@/components/PostContent";
import { PostMeta } from "@/components/PostMeta";
import { formatDate, formatDateLong, getReadingTime } from "@/lib/format";
import { getImageUrl } from "@/lib/images";
import type { Post } from "@/lib/schemas";

/**
 * Post de prosa: cabecera (centrada en desktop), portada como figura debajo
 * del título y cuerpo a 680 px (~68 caracteres por línea).
 */
export function ProseArticle({ post }: { post: Post }) {
  const imageUrl = getImageUrl(post.coverImage, "large");
  const readingTime = `${getReadingTime(post.content)} min de lectura`;
  const shortDate = formatDate(post.publishedAt);
  const longDate = formatDateLong(post.publishedAt);

  return (
    <>
      <header className="mx-auto flex w-full max-w-post-head flex-col gap-cozy px-lg pt-lg pb-relaxed lg:items-center lg:gap-roomy lg:px-0 lg:py-3xl lg:text-center">
        <PostMeta
          className="gap-xs lg:justify-center lg:gap-snug"
          items={[
            { key: "category", content: post.category?.name, emphasis: "accent" },
            {
              key: "date",
              content: shortDate && (
                <>
                  <span className="lg:hidden">{shortDate}</span>
                  <span className="hidden lg:inline">{longDate}</span>
                </>
              ),
            },
            { key: "reading", content: readingTime, className: "hidden lg:inline" },
          ]}
        />
        <h1 className="font-heading text-post-title-mobile font-semibold text-text-primary wrap-break-word lg:text-post-title">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="max-w-reading font-body text-lead-mobile text-text-secondary lg:text-lead-post">
            {post.excerpt}
          </p>
        )}
        <p className="font-body text-caption text-text-secondary lg:hidden">
          {readingTime}
        </p>
      </header>

      {imageUrl && (
        <figure className="mx-auto w-full max-w-wide lg:px-4xl xl:px-0">
          <div className="relative h-post-cover-mobile w-full overflow-hidden bg-bg-card lg:h-post-cover lg:rounded-md">
            <Image
              src={imageUrl}
              alt={post.coverImage?.alternativeText || ""}
              fill
              sizes="(min-width: 1100px) 1100px, 100vw"
              className="object-cover"
              fetchPriority="high"
              loading="eager"
            />
          </div>
        </figure>
      )}

      <div className="mx-auto w-full max-w-reading px-lg pt-loose lg:px-0 lg:pt-4xl">
        <PostContent content={post.content} />
      </div>
    </>
  );
}
