// Clases de los componentes Button y Text link del .pen, compartidas por
// <Link>, <a> y <button>.

const buttonBase =
  "inline-flex h-control items-center justify-center gap-xs rounded-sm px-lg font-body text-label font-medium transition-colors";

export const buttonVariants = {
  primary: `${buttonBase} bg-bg-inverse text-text-inverse hover:bg-accent-hover`,
  secondary: `${buttonBase} border border-border-strong text-text-primary hover:bg-bg-card`,
} as const;

export const textLinkClass =
  "inline-flex min-h-touch items-center gap-xs font-body text-label font-medium text-accent transition-colors hover:text-accent-hover";
