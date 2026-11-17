import Image from "next/image";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/CodeBlock";
import { resolveImageSrc } from "@/lib/images";
import {
  isCiteParagraph,
  isImageOnlyParagraph,
  parseCodeFence,
} from "@/lib/markdown";

const heading = "font-heading font-semibold text-text-primary";

// Viñeta (punto de 6 px en acento) o número (Playfair 600 en accent-hover) como
// primera columna de cada ítem, con 14 px hasta el texto.
const listItem =
  "[&>li]:grid [&>li]:grid-cols-[auto_1fr] [&>li]:gap-x-cozy [&>li]:before:content-['']";

const components: Components = {
  // El H1 de la página es el título del post: los del contenido bajan a h2.
  h1: ({ children }) => (
    <h2 className={`${heading} text-h2-mobile lg:text-h2`}>{children}</h2>
  ),
  h2: ({ children }) => (
    <h2 className={`${heading} text-h2-mobile lg:text-h2`}>{children}</h2>
  ),
  h3: ({ children }) => <h3 className={`${heading} text-h3`}>{children}</h3>,
  h4: ({ children }) => <h4 className={`${heading} text-h3`}>{children}</h4>,
  h5: ({ children }) => <h5 className={`${heading} text-h3`}>{children}</h5>,
  h6: ({ children }) => <h6 className={`${heading} text-h3`}>{children}</h6>,

  p: ({ node, children }) => {
    // Un párrafo que es solo una imagen se renderiza como figura.
    if (isImageOnlyParagraph(node)) return <figure>{children}</figure>;
    return (
      <p
        data-cite={isCiteParagraph(node) || undefined}
        className="font-body text-reading text-text-primary"
      >
        {children}
      </p>
    );
  },

  a: ({ href = "", children }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className="text-accent underline underline-offset-2 transition-colors hover:text-accent-hover"
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
  // El contenido va en un solo contenedor: la segunda columna de la grilla.
  li: ({ children }) => (
    <li>
      <div className="flex min-w-0 flex-col gap-sm">{children}</div>
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

  // Spans (válidos dentro de <p>): si la imagen va sola, el <p> la envuelve en <figure>.
  img: ({ src, alt = "", title }) => {
    const url = typeof src === "string" ? resolveImageSrc(src) : null;
    if (!url) return null;
    return (
      <span className="flex flex-col gap-sm py-sm">
        <span className="relative block h-body-image w-full overflow-hidden rounded-md bg-bg-card">
          <Image
            src={url}
            alt={alt}
            fill
            sizes="(min-width: 768px) 680px, 100vw"
            className="object-cover"
          />
        </span>
        {title && (
          <span className="font-body text-figcaption text-text-secondary">
            {title}
          </span>
        )}
      </span>
    );
  },

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
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
