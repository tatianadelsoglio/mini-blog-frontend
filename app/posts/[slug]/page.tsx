import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { PoemContent } from "@/components/PoemContent";
import { PostNavigation } from "@/components/PostNavigation";
import { ProseArticle } from "@/components/ProseArticle";
import { POEMS_CATEGORY_SLUG } from "@/lib/categories";
import { getPostSummary } from "@/lib/format";
import { getImageUrl } from "@/lib/images";
import { getAdjacentPosts } from "@/lib/postNavigation";
import { getPostBySlug, getPosts } from "@/lib/posts";
import { DEFAULT_OG_IMAGE, SITE_LOCALE, SITE_NAME } from "@/lib/site";

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
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title: post.title,
      description,
      url: `/posts/${post.slug}`,
      publishedTime: post.publishedAt ?? undefined,
      images: cover
        ? [{ url: cover, alt: post.coverImage?.alternativeText || post.title }]
        : [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
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
  const isPoem = post.category?.slug === POEMS_CATEGORY_SLUG;

  return (
    <article>
      <BackLink />

      {isPoem ? (
        <div className="mx-auto w-full max-w-poem px-xl py-4xl">
          <h1 className="font-heading text-post-title-mobile font-semibold text-text-primary lg:text-poem-title">
            {post.title}
          </h1>
          <PoemContent content={post.content} />
        </div>
      ) : (
        <ProseArticle post={post} />
      )}

      <div className="mx-auto w-full max-w-wide px-lg pt-3xl pb-section-sm lg:px-4xl lg:pt-5xl lg:pb-section-lg xl:px-0">
        <PostNavigation {...adjacent} isPoem={isPoem} />
      </div>
    </article>
  );
}
