import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PoemContent } from "@/components/PoemContent";
import { PostContent } from "@/components/PostContent";
import { PostNavigation } from "@/components/PostNavigation";
import { POEMS_CATEGORY_SLUG } from "@/lib/categories";
import { formatDate, getPostSummary, getReadingTime } from "@/lib/format";
import { getImageUrl } from "@/lib/images";
import { getAdjacentPosts } from "@/lib/postNavigation";
import { getPostBySlug, getPosts } from "@/lib/posts";

// Se prerenderizan los posts conocidos en el build; uno nuevo se genera en la
// primera visita y queda cacheado hasta que el webhook lo revalide.
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  props: PageProps<"/posts/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const description = getPostSummary(post, 160);
  const cover = getImageUrl(post.coverImage, "large");

  return {
    title: post.title,
    description,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/posts/${post.slug}`,
      publishedTime: post.publishedAt ?? undefined,
      ...(cover && {
        images: [
          {
            url: cover,
            alt: post.coverImage?.alternativeText || post.title,
          },
        ],
      }),
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title: post.title,
      description,
    },
  };
}

export default async function PostPage(props: PageProps<"/posts/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const posts = await getPosts();
  const adjacent = getAdjacentPosts(posts, post);
  const date = formatDate(post.publishedAt);
  const readingTime = getReadingTime(post.content);
  const imageUrl = getImageUrl(post.coverImage, "large");
  const isPoem = post.category?.slug === POEMS_CATEGORY_SLUG;

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-8 sm:px-16">
        <Link
          href="/historias"
          className="font-body text-caption tracking-wide text-accent uppercase"
        >
          ← Volver a historias
        </Link>
      </div>

      {imageUrl ? (
        <div className="relative mt-6 h-90 w-full">
          <Image
            src={imageUrl}
            alt={post.coverImage?.alternativeText || post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg-inverse/85 via-bg-inverse/10 to-transparent" />
          <h1 className="absolute inset-x-0 bottom-0 px-6 pb-8 font-heading text-hero font-semibold text-text-inverse sm:px-16">
            {post.title}
          </h1>
        </div>
      ) : (
        <h1 className="mt-6 px-6 font-heading text-hero font-semibold text-text-primary sm:px-16">
          {post.title}
        </h1>
      )}

      <article className="mx-auto flex w-full max-w-reading flex-col gap-6 px-6 py-10 sm:px-0">
        <div className="flex flex-wrap items-center gap-x-3 font-body text-caption text-text-secondary">
          {post.category && (
            <Link
              href={`/historias?categoria=${encodeURIComponent(post.category.slug)}`}
              className="tracking-wide text-accent uppercase"
            >
              {post.category.name}
            </Link>
          )}
          {date && <span>{date}</span>}
          <span>{readingTime} min de lectura</span>
        </div>

        {isPoem ? (
          <PoemContent content={post.content} />
        ) : (
          <PostContent content={post.content} />
        )}

        <PostNavigation {...adjacent} />
      </article>
    </div>
  );
}
