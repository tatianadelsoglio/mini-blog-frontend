import Image from "next/image";
import Link from "next/link";
import { PostMeta } from "@/components/PostMeta";
import { VersePreview } from "@/components/VersePreview";
import { POEMS_CATEGORY_SLUG } from "@/lib/categories";
import { formatDate, getPostSummary, getReadingTime } from "@/lib/format";
import { getImageUrl } from "@/lib/images";
import type { Post } from "@/lib/schemas";

/** Tarjeta de post (Post card) o de poema (Post card / Poema: versos sin portada). */
export function PostCard({ post }: { post: Post }) {
  const isPoem = post.category?.slug === POEMS_CATEGORY_SLUG;
  const imageUrl = isPoem ? null : getImageUrl(post.coverImage, "small");

  return (
    <article className="group relative flex flex-col gap-md">
      {isPoem ? (
        <div className="flex h-card-cover flex-col justify-center rounded-md bg-accent-soft px-2xl">
          <VersePreview
            content={post.content}
            className="text-verse-preview text-text-primary"
          />
        </div>
      ) : (
        <div className="relative h-card-cover overflow-hidden rounded-md bg-bg-card">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={post.coverImage?.alternativeText || ""}
              fill
              sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
      )}

      <PostMeta
        items={[
          { key: "category", content: post.category?.name, emphasis: "accent" },
          { key: "date", content: formatDate(post.publishedAt) },
        ]}
      />

      <h3 className="font-heading text-card-title font-semibold text-text-primary">
        {/* El link cubre toda la tarjeta (un solo destino por tarjeta). */}
        <Link
          href={`/posts/${post.slug}`}
          className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent-hover"
        >
          {post.title}
        </Link>
      </h3>

      {!isPoem && (
        <p className="font-body text-excerpt text-text-secondary">
          {getPostSummary(post)}
        </p>
      )}

      <p className="font-body text-caption text-text-secondary">
        {getReadingTime(post.content)} min de lectura
      </p>
    </article>
  );
}
