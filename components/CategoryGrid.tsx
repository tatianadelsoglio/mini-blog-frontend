import Link from "next/link";
import type { CategoryWithCount } from "@/lib/categories";

export function CategoryGrid({
  categories,
}: {
  categories: CategoryWithCount[];
}) {
  if (categories.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`/historias?categoria=${encodeURIComponent(category.slug)}`}
            className="flex h-full flex-col gap-2 rounded-md bg-bg-card p-6 transition-colors hover:bg-border"
          >
            <span className="font-heading text-h3 font-semibold text-text-primary">
              {category.name}
            </span>
            {category.description && (
              <span className="font-body text-body text-text-secondary">
                {category.description}
              </span>
            )}
            <span className="mt-auto pt-2 font-body text-caption tracking-wide text-accent uppercase">
              {category.postCount}{" "}
              {category.postCount === 1 ? "historia" : "historias"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
