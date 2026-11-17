import type { Metadata } from "next";
import Image from "next/image";
import { PostContent } from "@/components/PostContent";
import { getAbout } from "@/lib/about";
import { getExcerpt } from "@/lib/format";
import { getImageUrl } from "@/lib/images";
import { buttonVariants } from "@/components/buttonStyles";
import { ArrowUpRightIcon } from "@/components/icons";
import {
  AUTHOR_NAME,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
} from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout();
  const description = about?.content
    ? getExcerpt(about.content, 160)
    : SITE_DESCRIPTION;
  const photo = getImageUrl(about?.photo ?? null, "large");

  return {
    // Título fijo: el template del layout agrega " | Cuaderno" y el título de
    // About (editable en Strapi) queda para el H1 y Open Graph.
    title: "Sobre",
    description,
    alternates: { canonical: "/sobre" },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      title: about?.title ?? "Sobre",
      description,
      url: "/sobre",
      images: photo ? [{ url: photo, alt: about?.title }] : [DEFAULT_OG_IMAGE],
    },
  };
}

const pageX = "mx-auto w-full max-w-page px-lg lg:px-4xl";

export default async function SobrePage() {
  const about = await getAbout();

  if (!about) {
    return (
      <div className={`${pageX} flex flex-col gap-roomy pt-2xl pb-4xl lg:gap-lg lg:pt-section-lg lg:pb-6xl`}>
        <p className="font-body text-caption font-medium tracking-caps text-accent uppercase">
          Sobre
        </p>
        <h1 className="font-heading text-hero-mobile font-semibold text-text-primary lg:text-hero">
          Sobre
        </h1>
        <p className="font-body text-reading text-text-secondary">
          Esta sección todavía no tiene contenido.
        </p>
      </div>
    );
  }

  const photoUrl = getImageUrl(about.photo, "large");
  const links = [
    about.githubUrl && { href: about.githubUrl, label: "GitHub" },
    about.linkedinUrl && { href: about.linkedinUrl, label: "LinkedIn" },
  ].filter((link) => !!link);

  return (
    <div
      className={`${pageX} flex flex-col gap-roomy pt-2xl pb-4xl lg:flex-row lg:items-start lg:justify-center lg:gap-section-lg lg:pt-section-lg lg:pb-6xl`}
    >
      {photoUrl && (
        <figure className="relative h-about-photo-mobile w-full shrink-0 overflow-hidden rounded-md bg-bg-card lg:h-about-photo lg:w-2/5 xl:w-about-photo">
          <Image
            src={photoUrl}
            alt={about.photo?.alternativeText || ""}
            fill
            sizes="(min-width: 1280px) 440px, (min-width: 1024px) 40vw, 100vw"
            className="object-cover"
            fetchPriority="high"
            loading="eager"
          />
        </figure>
      )}

      <div className="flex w-full flex-col gap-roomy lg:max-w-about-text lg:gap-lg lg:pt-lg">
        <p className="font-body text-caption font-medium tracking-caps text-accent uppercase">
          Sobre
        </p>
        <h1 className="font-heading text-hero-mobile font-semibold text-text-primary wrap-break-word lg:text-hero">
          {about.title}
        </h1>

        {about.content && <PostContent content={about.content} />}

        {links.length > 0 && (
          <ul className="flex flex-col gap-sm pt-xs lg:flex-row lg:pt-md">
            {links.map(({ href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} de ${AUTHOR_NAME} (abre en otra pestaña)`}
                  className={`${buttonVariants.secondary} w-full lg:w-auto`}
                >
                  {label}
                  <ArrowUpRightIcon className="size-icon-sm" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
