import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, formatDate, getImageUrl } from "@/lib/posts";
import { PostContent } from "@/components/PostContent";

export default async function PostPage(
  props: PageProps<"/posts/[documentId]">
) {
  const { documentId } = await props.params;
  const post = await getPost(documentId);

  if (!post) {
    notFound();
  }

  const date = formatDate(post.publishedAt);
  const imageUrl = getImageUrl(post.coverImage, "large");

  return (
    <div className="flex flex-col">
      <div className="px-6 pt-8 sm:px-16">
        <Link
          href="/"
          className="font-body text-caption tracking-wide text-accent uppercase"
        >
          ← Volver al inicio
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
        {date && (
          <span className="font-body text-caption text-text-secondary">
            {date}
          </span>
        )}

        <PostContent content={post.content} />
      </article>
    </div>
  );
}
