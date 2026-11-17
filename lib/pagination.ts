export type PageSlot = number | "ellipsis";

/**
 * Páginas a mostrar: la primera, la última y una ventana de 3 alrededor de la
 * actual, con "…" cuando se saltean dos o más (1 2 3 … 8, 1 … 4 5 6 … 9). Si
 * se saltea una sola, se muestra esa página en vez de "…" (1 2 3 4 5).
 */
export function getPageSlots(current: number, pageCount: number): PageSlot[] {
  if (pageCount <= 1) return [1];
  const start = Math.max(1, Math.min(current - 1, pageCount - 2));
  const end = Math.min(pageCount, start + 2);

  const pages = new Set<number>([1, pageCount]);
  for (let page = start; page <= end; page++) pages.add(page);

  const sorted = [...pages].sort((a, b) => a - b);
  const slots: PageSlot[] = [];
  sorted.forEach((page, index) => {
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous === 2) slots.push(previous + 1);
    else if (previous !== undefined && page - previous > 2) slots.push("ellipsis");
    slots.push(page);
  });
  return slots;
}
