"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { isActiveLink, NAV_LINKS } from "@/lib/navigation";

const DIALOG_ID = "menu-principal";

/**
 * Menú a pantalla completa con <dialog> nativo: showModal() aporta Esc, fondo
 * inerte y foco atrapado. Al cerrar, el foco vuelve al botón de menú.
 */
export function MobileMenu() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // Se cierra al navegar a otra ruta.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  const openMenu = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };

  const closeMenu = () => dialogRef.current?.close();

  const handleClose = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={openMenu}
        aria-expanded={open}
        aria-controls={DIALOG_ID}
        className="inline-flex size-touch items-center justify-center rounded-full text-text-primary transition-colors hover:bg-bg-card"
      >
        <MenuIcon className="size-icon-xl" />
        <span className="sr-only">Abrir menú</span>
      </button>

      <dialog
        ref={dialogRef}
        id={DIALOG_ID}
        aria-label="Menú"
        onClose={handleClose}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 text-text-primary backdrop:bg-bg open:flex open:flex-col"
      >
        <div className="flex items-center justify-between border-b border-border px-lg py-snug">
          <span className="font-heading text-logo-mobile font-semibold text-text-primary">
            Cuaderno
          </span>
          <button
            type="button"
            onClick={closeMenu}
            className="inline-flex size-touch items-center justify-center rounded-full text-text-primary transition-colors hover:bg-bg-card"
          >
            <CloseIcon className="size-icon-xl" />
            <span className="sr-only">Cerrar menú</span>
          </button>
        </div>

        <nav aria-label="Principal" className="p-lg">
          <ul>
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActiveLink(href, pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-menu-link items-center gap-cozy border-b border-border font-heading text-menu-link font-semibold ${
                      active ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="h-active-bar-height w-active-bar bg-accent"
                      />
                    )}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-lg py-xs">
          <ThemeSwitch />
        </div>
      </dialog>
    </>
  );
}
