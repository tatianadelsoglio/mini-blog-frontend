import Link from "next/link";
import type { Metadata } from "next";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedPost } from "@/components/FeaturedPost";
import { PostList } from "@/components/PostList";
import { getCategories, withPostCount } from "@/lib/categories";
import { getPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — Historias breves para leer con calma` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const RECENT_COUNT = 3;

export default async function Home() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  const [featured, ...rest] = posts;
  const recent = rest.slice(0, RECENT_COUNT);

  return (
    <div className="flex flex-col gap-16 pb-20">
      <section className="flex flex-col gap-3 px-6 pt-16 sm:px-16">
        <span className="font-body text-caption tracking-wide text-accent uppercase">
          Cuaderno de notas
        </span>
        <h1 className="max-w-2xl font-heading text-hero font-semibold text-text-primary">
          Historias breves para leer con calma
        </h1>
        <p className="max-w-xl font-body text-body-lg text-text-secondary">
          Notas, reflexiones y pequeños hallazgos de todos los días.
        </p>
      </section>

      {featured ? (
        <section className="px-6 sm:px-16">
          <FeaturedPost post={featured} />
        </section>
      ) : (
        <p className="px-6 font-body text-body text-text-secondary sm:px-16">
          Todavía no hay posts publicados.
        </p>
      )}

      {recent.length > 0 && (
        <section className="flex flex-col gap-8 px-6 sm:px-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-heading text-h2 font-semibold text-text-primary">
              Recientes
            </h2>
            <Link
              href="/historias"
              className="font-body text-caption tracking-wide text-accent uppercase"
            >
              Ver todas →
            </Link>
          </div>
          <PostList posts={recent} />
        </section>
      )}

      {categories.length > 0 && (
        <section className="flex flex-col gap-8 px-6 sm:px-16">
          <h2 className="font-heading text-h2 font-semibold text-text-primary">
            Explorá por tema
          </h2>
          <CategoryGrid categories={withPostCount(categories, posts)} />
        </section>
      )}
    </div>
  );
}
