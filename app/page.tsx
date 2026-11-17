import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants, textLinkClass } from "@/components/buttonStyles";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedPost } from "@/components/FeaturedPost";
import { ArrowRightIcon } from "@/components/icons";
import { LatestPoemAside } from "@/components/LatestPoemAside";
import { PostList } from "@/components/PostList";
import {
  getCategories,
  POEMS_CATEGORY_SLUG,
  withPostCount,
} from "@/lib/categories";
import { getPosts } from "@/lib/posts";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — Historias breves para leer con calma` },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

const RECENT_COUNT = 3;
const pageX = "mx-auto w-full max-w-page px-lg lg:px-4xl";

export default async function Home() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  const isPoem = (slug?: string) => slug === POEMS_CATEGORY_SLUG;

  // Destacado: la historia (no poema) más reciente. El último poema va en el hero.
  const latestPoem = posts.find((post) => isPoem(post.category?.slug));
  const featured = posts.find((post) => !isPoem(post.category?.slug));
  const recent = posts
    .filter((post) => post !== featured)
    .slice(0, RECENT_COUNT);

  return (
    <>
      <section
        className={`${pageX} flex flex-col gap-md pt-section-sm pb-2xl lg:flex-row lg:items-end lg:gap-section-lg lg:pt-section-lg lg:pb-section-md`}
      >
        <div className="flex flex-1 flex-col gap-md lg:gap-roomy">
          <p className="font-body text-caption font-medium tracking-caps text-accent uppercase">
            Cuaderno de notas
          </p>
          <h1 className="max-w-hero-title font-heading text-hero-mobile font-semibold text-text-primary lg:text-hero">
            Historias breves para leer con calma
          </h1>
          <p className="max-w-hero-lead font-body text-lead-mobile text-text-secondary lg:text-body-lg">
            Notas sobre tecnología, cosas que me interesan y algunos poemas
            propios. Sin apuro.
          </p>
        </div>
        {latestPoem && <LatestPoemAside poem={latestPoem} />}
      </section>

      {posts.length === 0 && (
        <p className={`${pageX} pb-section-lg font-body text-body text-text-secondary`}>
          Todavía no hay historias publicadas.
        </p>
      )}

      {featured && (
        <section
          aria-label="Destacado"
          className={`${pageX} pt-md pb-section-sm lg:pt-lg lg:pb-section-lg`}
        >
          <FeaturedPost post={featured} />
        </section>
      )}

      {recent.length > 0 && (
        <section className="border-t border-border">
          <div
            className={`${pageX} flex flex-col gap-2xl pt-3xl pb-section-sm lg:pt-section-md lg:pb-section-lg`}
          >
            <div className="flex items-end justify-between gap-md">
              <h2 className="font-heading text-h2 font-semibold text-text-primary">
                Recientes
              </h2>
              <Link href="/historias" className={`${textLinkClass} hidden lg:inline-flex`}>
                Ver todas las historias →
              </Link>
            </div>
            <PostList posts={recent} />
            <Link
              href="/historias"
              className={`${buttonVariants.secondary} w-full lg:hidden`}
            >
              Ver todas las historias
              <ArrowRightIcon className="size-icon-sm" />
            </Link>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="bg-bg-card">
          <div
            className={`${pageX} flex flex-col gap-xs pt-3xl pb-section-sm lg:gap-xl lg:pt-section-md lg:pb-section-lg`}
          >
            <h2 className="font-heading text-h2 font-semibold text-text-primary">
              Explorá por tema
            </h2>
            <CategoryGrid categories={withPostCount(categories, posts)} />
          </div>
        </section>
      )}
    </>
  );
}
