import type { Element, ElementContent } from "hast";

/** Texto plano de un nodo hast (concatena los textos de sus hijos). */
export function hastText(node: Element | ElementContent | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(hastText).join("");
  return "";
}

export interface CodeFence {
  code: string;
  language: string | null;
  title: string | null;
}

/** Datos de un <pre><code> generado desde un fence de Markdown. */
export function parseCodeFence(pre: Element | undefined): CodeFence {
  const code = pre?.children.find(
    (child): child is Element => child.type === "element" && child.tagName === "code"
  );
  const classNames = code?.properties?.className;
  const languageClass = Array.isArray(classNames)
    ? classNames.map(String).find((name) => name.startsWith("language-"))
    : undefined;
  const meta = (code?.data as { meta?: string } | undefined)?.meta ?? "";
  const title = meta.match(/title=(?:"([^"]*)"|'([^']*)'|(\S+))/);

  return {
    code: hastText(code).replace(/\n$/, ""),
    language: languageClass?.replace("language-", "") ?? null,
    title: title ? (title[1] ?? title[2] ?? title[3]) : null,
  };
}

export interface MarkdownImage {
  src: string;
  alt: string;
  title: string | null;
}

/** Si el párrafo contiene solo una imagen, sus datos (se renderiza como figura). */
export function getSoleImage(node: Element | undefined): MarkdownImage | null {
  const meaningful = node?.children.filter(
    (child) => !(child.type === "text" && child.value.trim() === "")
  );
  const img = meaningful?.length === 1 ? meaningful[0] : undefined;
  if (img?.type !== "element" || img.tagName !== "img") return null;
  const { src, alt, title } = img.properties;
  if (typeof src !== "string") return null;
  return {
    src,
    alt: typeof alt === "string" ? alt : "",
    title: typeof title === "string" ? title : null,
  };
}

/** Párrafo de firma de cita: empieza con raya ("— Autor"). */
export function isCiteParagraph(node: Element | undefined): boolean {
  return /^\s*(—|--)\s/.test(hastText(node));
}
