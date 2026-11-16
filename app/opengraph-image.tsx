import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} — Historias breves para leer con calma`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen Open Graph por defecto del sitio (colores del tema).
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 96px",
          background: "#f5f2e9",
          color: "#2d2926",
          borderLeft: "24px solid #7d6b3d",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#7d6b3d",
          }}
        >
          Cuaderno de notas
        </div>
        <div style={{ fontSize: 112, fontWeight: 700, marginTop: 16 }}>
          {SITE_NAME}
        </div>
        <div style={{ fontSize: 44, marginTop: 24, color: "#5e5954" }}>
          Historias breves para leer con calma
        </div>
      </div>
    ),
    size
  );
}
