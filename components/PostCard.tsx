import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/schemas";
import { formatDate, getPostSummary } from "@/lib/format";
import { getImageUrl } from "@/lib/images";

export function PostCard({ post }: { post: Post }) {
  const date = formatDate(post.publishedAt);
  const imageUrl = getImageUrl(post.coverImage, "small");

  return (
    <Link href={`/posts/${post.slug}`} className="group flex flex-col gap-4">
      <div className="relative h-55 w-full overflow-hidden rounded-md bg-bg-card transition-colors group-hover:bg-border">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={post.coverImage?.alternativeText || post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 font-body text-caption text-text-secondary">
          {post.category && (
            <span className="tracking-wide text-accent uppercase">
              {post.category.name}
            </span>
          )}
          {date && <span>{date}</span>}
        </div>
        <h3 className="font-heading text-h3 font-semibold text-text-primary">
          {post.title}
        </h3>
        <p className="font-body text-body text-text-secondary">
          {getPostSummary(post)}
        </p>
      </div>
    </Link>
  );
}
