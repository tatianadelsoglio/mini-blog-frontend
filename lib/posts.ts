export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiImage {
  url: string;
  width: number;
  height: number;
  alternativeText?: string | null;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

export interface Post {
  id: number;
  documentId: string;
  title: string;
  content: string;
  publishedAt?: string;
  coverImage: StrapiImage | null;
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/posts?populate=coverImage`
  );
  if (!res.ok) {
    throw new Error("No se pudieron cargar los posts");
  }
  const json = await res.json();
  return json.data;
}

export async function getPost(documentId: string): Promise<Post | null> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/posts/${documentId}?populate=coverImage`
  );
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error("No se pudo cargar el post");
  }
  const json = await res.json();
  return json.data;
}

export function getImageUrl(
  image: Post["coverImage"],
  size: "thumbnail" | "small" | "medium" | "large" = "large"
): string | null {
  if (!image) return null;
  const url = image.formats?.[size]?.url ?? image.url;
  return url.startsWith("http")
    ? url
    : `${process.env.STRAPI_URL}${url}`;
}

export function getExcerpt(content: string, maxLength = 140): string {
  const plain = content.replace(/[#*_`>~[\]]/g, "").trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.slice(0, maxLength).trimEnd()}…`;
}

export function formatDate(dateString?: string): string | null {
  if (!dateString) return null;
  return new Date(dateString)
    .toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
}
