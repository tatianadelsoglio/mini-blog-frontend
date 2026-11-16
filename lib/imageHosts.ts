// Fuente única de los orígenes de imagen permitidos: la usan next.config.ts
// (images.remotePatterns) y getImageUrl (para no pedirle a next/image una URL
// que lanzaría error de render). Sin alias "@/" porque next.config.ts lo importa.

export interface ImageHostPattern {
  protocol: "http" | "https";
  hostname: string;
  port: string;
  pathname: string;
}

function toPattern(rawUrl: string, pathname: string): ImageHostPattern {
  const url = new URL(rawUrl);
  return {
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
    port: url.port,
    pathname,
  };
}

// Las imágenes viven en Supabase Storage (bucket público); Strapi solo se
// permite por si algún archivo se sirve desde /uploads.
export function getImagePatterns(
  env: NodeJS.ProcessEnv = process.env
): ImageHostPattern[] {
  const strapiUrl = new URL(env.STRAPI_URL ?? "http://localhost:1337");
  const patterns = [toPattern(strapiUrl.origin, "/uploads/**")];

  if (env.SUPABASE_PUBLIC_URL) {
    const supabaseUrl = new URL(env.SUPABASE_PUBLIC_URL);
    const basePath = supabaseUrl.pathname.replace(/\/$/, "");
    patterns.push(toPattern(supabaseUrl.origin, `${basePath}/**`));
  }
  return patterns;
}

export function isAllowedImageUrl(rawUrl: string): boolean {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }

  return getImagePatterns().some((pattern) => {
    const prefix = pattern.pathname.replace(/\/\*\*$/, "");
    return (
      url.protocol === `${pattern.protocol}:` &&
      url.hostname === pattern.hostname &&
      url.port === pattern.port &&
      url.pathname.startsWith(`${prefix}/`)
    );
  });
}
