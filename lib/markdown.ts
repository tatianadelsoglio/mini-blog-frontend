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

/** true si el párrafo contiene solo una imagen (se renderiza como figura). */
export function isImageOnlyParagraph(node: Element | undefined): boolean {
  const meaningful = node?.children.filter(
    (child) => !(child.type === "text" && child.value.trim() === "")
  );
  return (
    meaningful?.length === 1 &&
    meaningful[0].type === "element" &&
    meaningful[0].tagName === "img"
  );
}

/** Párrafo de firma de cita: empieza con raya ("— Autor"). */
export function isCiteParagraph(node: Element | undefined): boolean {
  return /^\s*(—|--)\s/.test(hastText(node));
}
