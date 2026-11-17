export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/historias", label: "Historias" },
  { href: "/sobre", label: "Sobre" },
];

/** Sección activa: los posts cuentan como parte de Historias. */
export function isActiveLink(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/historias") {
    return pathname.startsWith("/historias") || pathname.startsWith("/posts");
  }
  return pathname.startsWith(href);
}
