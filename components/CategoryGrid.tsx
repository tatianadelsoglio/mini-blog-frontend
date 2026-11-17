import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { POEMS_CATEGORY_SLUG, type CategoryWithCount } from "@/lib/categories";

function countLabel(category: CategoryWithCount): string {
  const isPoems = category.slug === POEMS_CATEGORY_SLUG;
  const one = isPoems ? "poema" : "historia";
  const many = isPoems ? "poemas" : "historias";
  return `${category.postCount} ${category.postCount === 1 ? one : many}`;
}

const href = (slug: string) => `/historias?categoria=${encodeURIComponent(slug)}`;

/** "Explorá por tema": columnas con borde superior en desktop, filas en mobile. */
export function CategoryGrid({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  if (categories.length === 0) return null;

  return (
    <>
      <ul className="flex flex-col lg:hidden">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={href(category.slug)}
              className="flex min-h-topic-row items-center justify-between gap-md border-b border-text-primary py-xs"
            >
              <div className="flex flex-col gap-3xs">
                <h3 className="font-heading text-h3 font-semibold text-text-primary">
                  {category.name}
                </h3>
                <span className="font-body text-note text-accent-hover">
                  {countLabel(category)}
                </span>
              </div>
              <ArrowUpRightIcon className="size-icon-lg shrink-0 text-accent-hover" />
            </Link>
          </li>
        ))}
      </ul>

      <ul className="hidden gap-xl lg:grid lg:grid-cols-3">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={href(category.slug)}
              className="group flex h-full flex-col gap-snug border-t border-text-primary pt-lg"
            >
              <div className="flex items-center justify-between gap-md">
                <h3 className="font-heading text-topic-title font-semibold text-text-primary group-hover:text-accent-hover">
                  {category.name}
                </h3>
                <ArrowUpRightIcon className="size-icon-lg shrink-0 text-accent-hover" />
              </div>
              {category.description && (
                <span className="font-body text-excerpt text-text-secondary">
                  {category.description}
                </span>
              )}
              <span className="font-body text-caption font-medium tracking-caps text-accent-hover uppercase">
                {countLabel(category)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
