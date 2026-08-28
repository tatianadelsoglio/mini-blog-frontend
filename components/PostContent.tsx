import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children }) => (
    <h2 className="font-heading text-h2 font-semibold text-text-primary">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="font-heading text-h2 font-semibold text-text-primary">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-heading text-h3 font-semibold text-text-primary">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="font-body text-body text-text-primary">{children}</p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-accent underline hover:text-accent-hover"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="flex flex-col gap-2 pl-6 font-body text-body text-text-primary list-disc">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="flex flex-col gap-2 pl-6 font-body text-body text-text-primary list-decimal">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent pl-4 [&>p]:font-heading [&>p]:text-h3 [&>p]:text-text-primary [&>p]:italic">
      {children}
    </blockquote>
  ),
};

export function PostContent({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-6">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
