import { getPosts } from "@/lib/posts";
import { PostList } from "@/components/PostList";

export default async function Home() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex flex-col gap-3 px-6 py-16 sm:px-16 sm:pb-10">
        <span className="font-body text-caption tracking-wide text-accent uppercase">
          Cuaderno de notas
        </span>
        <h1 className="max-w-2xl font-heading text-hero font-semibold text-text-primary">
          Historias breves para leer con calma
        </h1>
        <p className="max-w-xl font-body text-body-lg text-text-secondary">
          Notas, reflexiones y pequeños hallazgos de todos los días.
        </p>
      </div>
      <div className="px-6 pt-6 pb-20 sm:px-16">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
