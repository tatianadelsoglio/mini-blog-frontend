import type { NextConfig } from "next";
import { getImagePatterns } from "./lib/imageHosts";

const strapiUrl = new URL(process.env.STRAPI_URL ?? "http://localhost:1337");
const isLocalStrapi = ["localhost", "127.0.0.1", "::1"].includes(
  strapiUrl.hostname
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getImagePatterns(),
    // Strapi corre en localhost en dev; Next 16 bloquea el optimizador de
    // imágenes hacia direcciones loopback por defecto (protección SSRF).
    ...(isLocalStrapi && { dangerouslyAllowLocalIP: true }),
  },
};

export default nextConfig;
