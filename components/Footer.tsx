import Image from "next/image";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { getAbout } from "@/lib/about";
import type { About } from "@/lib/schemas";
import { AUTHOR_FULL_NAME, AUTHOR_NAME } from "@/lib/site";

async function getAboutSafely(): Promise<About | null> {
  try {
    return await getAbout();
  } catch (error) {
    // El footer no debe tumbar la página: sin About no hay íconos sociales.
    console.error("[footer] No se pudo cargar About:", error);
    return null;
  }
}

const socialLink =
  "inline-flex size-touch items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-bg-card hover:text-text-primary";

export async function Footer() {
  const about = await getAboutSafely();
  const year = new Date().getFullYear();

  const socials = [
    about?.githubUrl && {
      href: about.githubUrl,
      label: `GitHub de ${AUTHOR_NAME} (abre en otra pestaña)`,
      Icon: GitHubIcon,
    },
    about?.linkedinUrl && {
      href: about.linkedinUrl,
      label: `LinkedIn de ${AUTHOR_NAME} (abre en otra pestaña)`,
      Icon: LinkedInIcon,
    },
  ].filter((social) => !!social);

  return (
    <footer className="border-t border-border bg-bg px-lg py-relaxed lg:px-4xl lg:py-xl">
      <div className="flex flex-col items-center gap-tight lg:gap-xs">
        {socials.length > 0 && (
          <ul className="flex items-center gap-xs">
            {socials.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={socialLink}
                >
                  <Icon className="size-icon-lg" />
                </a>
              </li>
            ))}
          </ul>
        )}

        <p className="flex flex-col items-center gap-tight text-center font-body text-caption text-text-secondary lg:flex-row lg:gap-xs">
          <span>
            © {year} Cuaderno · Diseñado y desarrollado por
            <span className="hidden lg:inline"> {AUTHOR_FULL_NAME} ·</span>
          </span>
          <span className="flex items-center gap-xs">
            <span className="lg:hidden">{AUTHOR_FULL_NAME} ·</span>
            <span className="flex items-center gap-tight">
              <span className="font-medium tracking-brand">TAMADE</span>
              <Image
                src="/brand/tamade-icon.png"
                alt=""
                width={23}
                height={20}
                className="h-icon-lg w-auto dark:hidden"
              />
              <Image
                src="/brand/tamade-icon-white.png"
                alt=""
                width={23}
                height={20}
                className="hidden h-icon-lg w-auto dark:block"
              />
            </span>
          </span>
        </p>
      </div>
    </footer>
  );
}
