import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/schemas";
import { formatDate, getPostSummary } from "@/lib/format";
import { getImageUrl } from "@/lib/images";

export function FeaturedPost({ post }: { post: Post }) {
  const date = formatDate(post.publishedAt);
  const imageUrl = getImageUrl(post.coverImage, "large");

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center"
    >
      <div className="relative h-72 w-full overflow-hidden rounded-md bg-bg-card transition-colors group-hover:bg-border md:h-96">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={post.coverImage?.alternativeText || post.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        )}
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-body text-caption tracking-wide text-accent uppercase">
          Destacado{post.category ? ` · ${post.category.name}` : ""}
        </span>
        <h2 className="font-heading text-h2 font-semibold text-text-primary">
          {post.title}
        </h2>
        <p className="font-body text-body text-text-secondary">
          {getPostSummary(post, 220)}
        </p>
        {date && (
          <span className="font-body text-caption text-text-secondary">
            {date}
          </span>
        )}
      </div>
    </Link>
  );
}
