import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Alias "@/..." de tsconfig, resuelto por Vite (reemplaza a vite-tsconfig-paths).
  resolve: { tsconfigPaths: true },
  test: {
    // node por defecto (rápido); el test de componentes pide jsdom con un docblock.
    environment: "node",
    include: ["__tests__/**/*.test.{ts,tsx}"],
    // Sin STRAPI_URL el filtro de imágenes usa localhost; se fija para que
    // los tests no dependan del .env de cada máquina.
    env: {
      STRAPI_URL: "http://localhost:1337",
      SUPABASE_PUBLIC_URL:
        "https://proyecto.supabase.co/storage/v1/object/public/uploads",
    },
  },
});
