import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/buttonStyles";
import { ArrowRightIcon } from "@/components/icons";
import { PostMeta } from "@/components/PostMeta";
import { formatDate, getPostSummary, getReadingTime } from "@/lib/format";
import { getImageUrl } from "@/lib/images";
import type { Post } from "@/lib/schemas";

export function FeaturedPost({ post }: { post: Post }) {
  const imageUrl = getImageUrl(post.coverImage, "large");
  const href = `/posts/${post.slug}`;
  const date = formatDate(post.publishedAt);

  return (
    <article className="flex flex-col gap-cozy lg:flex-row lg:items-center lg:gap-section-sm">
      <div className="relative h-featured-cover-mobile w-full shrink-0 overflow-hidden rounded-md bg-bg-card lg:h-featured-cover lg:w-1/2 xl:w-featured-cover">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={post.coverImage?.alternativeText || ""}
            fill
            sizes="(min-width: 1280px) 760px, (min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            fetchPriority="high"
            loading="eager"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-cozy lg:gap-md">
        <PostMeta
          className="gap-xs pt-tight lg:pt-0"
          items={[
            { key: "badge", content: "Destacado", emphasis: "primary" },
            { key: "category", content: post.category?.name, emphasis: "accent" },
          ]}
        />
        <h2 className="font-heading text-featured-title-mobile font-semibold text-text-primary lg:text-featured-title">
          <Link href={href} className="hover:text-accent-hover">
            {post.title}
          </Link>
        </h2>
        <p className="font-body text-excerpt text-text-secondary lg:text-featured-excerpt">
          {getPostSummary(post, 220)}
        </p>
        <p className="font-body text-caption text-text-secondary">
          {[date, `${getReadingTime(post.content)} min de lectura`]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div>
          <Link
            href={href}
            className={`${buttonVariants.primary} w-full lg:w-auto`}
          >
            Leer la historia
            <ArrowRightIcon className="size-icon-sm" />
          </Link>
        </div>
      </div>
    </article>
  );
}
