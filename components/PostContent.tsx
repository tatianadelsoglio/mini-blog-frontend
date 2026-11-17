import Image from "next/image";
import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/CodeBlock";
import { resolveImageSrc } from "@/lib/images";
import {
  getSoleImage,
  isCiteParagraph,
  parseCodeFence,
  type MarkdownImage,
} from "@/lib/markdown";

const headingBase = "font-heading font-semibold text-text-primary";

const cx = (...classes: (string | undefined)[]) =>
  classes.filter(Boolean).join(" ");

/** Props HTML de un componente de react-markdown, sin el nodo hast. */
function withoutNode<T extends { node?: unknown }>(props: T): Omit<T, "node"> {
  const rest = { ...props };
  delete rest.node;
  return rest;
}

/**
 * Heading del contenido. Conserva los props de hast (id, className): sin
 * ellos se rompen las notas al pie de GFM (anclas y el título sr-only).
 */
function heading(Tag: "h2" | "h3" | "h4" | "h5" | "h6", size: string) {
  return function MarkdownHeading(props: ComponentProps<"h2"> & { node?: unknown }) {
    const { className, ...rest } = withoutNode(props);
    return <Tag {...rest} className={cx(headingBase, size, className)} />;
  };
}

/** Imagen del cuerpo: caja de 400 px a ancho de lectura (o null si el host no está permitido). */
function BodyImage({ src, alt }: { src: string; alt: string }) {
  const url = resolveImageSrc(src);
  if (!url) return null;
  return (
    <span className="relative block h-body-image w-full overflow-hidden rounded-md bg-bg-card">
      <Image
        src={url}
        alt={alt}
        fill
        sizes="(min-width: 768px) 680px, 100vw"
        className="object-cover"
      />
    </span>
  );
}

function BodyFigure({ src, alt, title }: MarkdownImage) {
  if (!resolveImageSrc(src)) return null;
  return (
    <figure className="flex flex-col gap-sm py-sm">
      <BodyImage src={src} alt={alt} />
      {title && (
        <figcaption className="font-body text-figcaption text-text-secondary">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

// Viñeta (punto de 6 px en acento) o número (Playfair 600 en accent-hover) como
// primera columna de cada ítem, con 14 px hasta el texto.
const listItem =
  "[&>li]:grid [&>li]:grid-cols-[auto_1fr] [&>li]:gap-x-cozy [&>li]:before:content-['']";

const components: Components = {
  // El H1 de la página es el título del post: los del contenido bajan a h2.
  h1: heading("h2", "text-h2-mobile lg:text-h2"),
  h2: heading("h2", "text-h2-mobile lg:text-h2"),
  h3: heading("h3", "text-h3"),
  h4: heading("h4", "text-h3"),
  h5: heading("h5", "text-h3"),
  h6: heading("h6", "text-h3"),

  p: ({ node, children }) => {
    // Un párrafo que es solo una imagen se renderiza como figura con pie.
    const soleImage = getSoleImage(node);
    if (soleImage) return <BodyFigure {...soleImage} />;
    return (
      <p
        data-cite={isCiteParagraph(node) || undefined}
        className="font-body text-reading text-text-primary"
      >
        {children}
      </p>
    );
  },

  a: (allProps) => {
    const { href = "", className, children, ...props } = withoutNode(allProps);
    const external = /^https?:\/\//.test(href);
    return (
      <a
        {...props}
        href={href}
        className={cx(
          "text-accent underline underline-offset-2 transition-colors hover:text-accent-hover",
          className
        )}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
        {external && <span className="sr-only"> (abre en otra pestaña)</span>}
      </a>
    );
  },

  ul: ({ children }) => (
    <ul
      className={`flex flex-col gap-sm font-body text-reading text-text-primary ${listItem} [&>li]:before:mt-sm [&>li]:before:ml-2xs [&>li]:before:size-marker [&>li]:before:rounded-full [&>li]:before:bg-accent`}
    >
      {children}
    </ul>
  ),
  // Contador propio: un <li> con display:grid no incrementa list-item.
  ol: ({ children, start }) => (
    <ol
      start={start}
      style={{ counterReset: `item ${(start ?? 1) - 1}` }}
      className={`flex flex-col gap-sm font-body text-reading text-text-primary ${listItem} [&>li]:[counter-increment:item] [&>li]:before:font-heading [&>li]:before:font-semibold [&>li]:before:text-accent-hover [&>li]:before:content-[counter(item)_'.']`}
    >
      {children}
    </ol>
  ),
  // El contenido va en un solo contenedor (bloque, para no partir el texto en
  // línea): la segunda columna de la grilla.
  li: ({ children }) => (
    <li>
      <div className="min-w-0 [&>*+*]:mt-sm">{children}</div>
    </li>
  ),

  blockquote: ({ children }) => (
    <blockquote className="flex flex-col gap-xs border-l-2 border-accent py-3xs pl-chip lg:gap-snug lg:py-2xs lg:pl-lg [&>p]:font-heading [&>p]:text-quote-mobile [&>p]:italic lg:[&>p]:text-quote [&>p[data-cite]]:font-body [&>p[data-cite]]:text-label [&>p[data-cite]]:not-italic [&>p[data-cite]]:text-text-secondary">
      {children}
    </blockquote>
  ),

  code: ({ children }) => (
    <code className="rounded-sm bg-bg-card px-tight py-3xs font-mono text-code-inline text-text-primary">
      {children}
    </code>
  ),
  pre: ({ node }) => <CodeBlock {...parseCodeFence(node)} />,

  hr: () => (
    <hr className="my-xs h-px w-ornament border-0 bg-accent" />
  ),

  // Imagen dentro de un párrafo con texto: span (válido dentro de <p>).
  img: ({ src, alt = "" }) =>
    typeof src === "string" ? (
      <span className="block py-sm">
        <BodyImage src={src} alt={alt} />
      </span>
    ) : null,

  // Tablas (GFM): scroll horizontal propio para no desbordar en mobile.
  table: ({ children }) => (
    <div
      tabIndex={0}
      role="region"
      aria-label="Tabla"
      className="overflow-x-auto rounded-sm border border-border"
    >
      <table className="w-full border-collapse font-body text-body text-text-primary">
        {children}
      </table>
    </div>
  ),
  th: ({ children, style }) => (
    <th
      style={style}
      className="border-b border-border-strong bg-bg-card px-sm py-xs text-left font-medium"
    >
      {children}
    </th>
  ),
  td: ({ children, style }) => (
    <td style={style} className="border-b border-border px-sm py-xs align-top">
      {children}
    </td>
  ),
};

/** Cuerpo de un post de prosa (Markdown + GFM) con los estilos del diseño. */
export function PostContent({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-lg wrap-break-word lg:gap-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        remarkRehypeOptions={{ footnoteLabel: "Notas", footnoteBackLabel: "Volver al texto" }}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
