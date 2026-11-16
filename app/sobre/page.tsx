import type { Metadata } from "next";
import Image from "next/image";
import { PostContent } from "@/components/PostContent";
import { getAbout } from "@/lib/about";
import { getExcerpt } from "@/lib/format";
import { getImageUrl } from "@/lib/images";
import {
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

const socialLink =
  "font-body text-caption tracking-wide text-accent uppercase underline-offset-4 hover:text-accent-hover hover:underline";

export default async function SobrePage() {
  const about = await getAbout();

  if (!about) {
    return (
      <div className="flex flex-col gap-3 px-6 py-16 sm:px-16">
        <h1 className="font-heading text-hero font-semibold text-text-primary">
          Sobre
        </h1>
        <p className="font-body text-body text-text-secondary">
          Esta sección todavía no tiene contenido.
        </p>
      </div>
    );
  }

  const photoUrl = getImageUrl(about.photo, "medium");

  return (
    <div className="mx-auto flex w-full max-w-reading flex-col gap-8 px-6 py-16 sm:px-0">
      <h1 className="font-heading text-hero font-semibold text-text-primary">
        {about.title}
      </h1>

      {photoUrl && about.photo && (
        <Image
          src={photoUrl}
          alt={about.photo.alternativeText || about.title}
          width={about.photo.formats?.medium?.width ?? about.photo.width ?? 640}
          height={
            about.photo.formats?.medium?.height ?? about.photo.height ?? 640
          }
          sizes="(min-width: 680px) 680px, 100vw"
          className="h-auto w-full rounded-md object-cover"
          priority
        />
      )}

      {about.content && <PostContent content={about.content} />}

      {(about.githubUrl || about.linkedinUrl) && (
        <ul className="flex flex-wrap gap-6">
          {about.githubUrl && (
            <li>
              <a
                href={about.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLink}
              >
                GitHub
              </a>
            </li>
          )}
          {about.linkedinUrl && (
            <li>
              <a
                href={about.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={socialLink}
              >
                LinkedIn
              </a>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
