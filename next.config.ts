import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

function toPattern(rawUrl: string, pathname: string): RemotePattern {
  const url = new URL(rawUrl);
  return {
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
    port: url.port,
    pathname,
  };
}

const strapiUrl = new URL(process.env.STRAPI_URL ?? "http://localhost:1337");
const isLocalStrapi = ["localhost", "127.0.0.1", "::1"].includes(
  strapiUrl.hostname
);

// Las imágenes viven en Supabase Storage (bucket público); Strapi solo se
// permite por si algún archivo se sirve desde /uploads.
const remotePatterns: RemotePattern[] = [
  toPattern(strapiUrl.origin, "/uploads/**"),
];

if (process.env.SUPABASE_PUBLIC_URL) {
  const supabaseUrl = new URL(process.env.SUPABASE_PUBLIC_URL);
  const basePath = supabaseUrl.pathname.replace(/\/$/, "");
  remotePatterns.push(toPattern(supabaseUrl.origin, `${basePath}/**`));
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    // Strapi corre en localhost en dev; Next 16 bloquea el optimizador de
    // imágenes hacia direcciones loopback por defecto (protección SSRF).
    ...(isLocalStrapi && { dangerouslyAllowLocalIP: true }),
  },
};

export default nextConfig;
