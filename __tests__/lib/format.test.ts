import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateLong,
  getExcerpt,
  getPostSummary,
  getReadingTime,
} from "@/lib/format";

describe("formatDate / formatDateLong (zona Argentina)", () => {
  it("usa el día de Buenos Aires aunque el servidor esté en UTC", () => {
    // 02:30 UTC del 12 = 23:30 del 11 en Argentina (UTC-3).
    expect(formatDate("2026-11-12T02:30:00.000Z")).toBe("11 nov 2026");
    expect(formatDateLong("2026-11-12T02:30:00.000Z")).toBe("11 de noviembre de 2026");
  });

  it("pasadas las 03:00 UTC ya es el día siguiente en Argentina", () => {
    expect(formatDate("2026-11-12T03:00:00.000Z")).toBe("12 nov 2026");
  });

  it("cruza el año por la diferencia horaria", () => {
    expect(formatDate("2026-01-01T02:59:59.000Z")).toBe("31 dic 2025");
    expect(formatDateLong("2026-01-01T02:59:59.000Z")).toBe("31 de diciembre de 2025");
  });

  it("los 12 meses salen abreviados, sin punto y con 3 partes", () => {
    for (let month = 0; month < 12; month++) {
      const formatted = formatDate(new Date(Date.UTC(2026, month, 15, 12)).toISOString());
      expect(formatted).toMatch(/^15 [a-zñ]+ 2026$/);
    }
  });

  it("una fecha sin hora se toma como medianoche UTC (día anterior en Argentina)", () => {
    expect(formatDate("2026-11-12")).toBe("11 nov 2026");
  });

  it.each([undefined, null, "", "no es una fecha"])("%j devuelve null", (value) => {
    expect(formatDate(value)).toBeNull();
    expect(formatDateLong(value)).toBeNull();
  });
});

describe("getReadingTime", () => {
  const words = (n: number) => Array.from({ length: n }, () => "palabra").join(" ");

  it("mínimo 1 minuto, incluso vacío", () => {
    expect(getReadingTime("")).toBe(1);
    expect(getReadingTime("hola")).toBe(1);
  });

  it("200 palabras son 1 minuto; 201, 2 (redondea hacia arriba)", () => {
    expect(getReadingTime(words(200))).toBe(1);
    expect(getReadingTime(words(201))).toBe(2);
    expect(getReadingTime(words(1000))).toBe(5);
  });

  it("no cuenta símbolos de Markdown ni la URL de los enlaces", () => {
    const markup = `# **${words(199)}** [uno](https://ejemplo.com/${"x".repeat(500)})`;
    // 199 palabras + "uno" = 200 -> 1 minuto.
    expect(getReadingTime(markup)).toBe(1);
  });
});

describe("getExcerpt", () => {
  it("quita Markdown y colapsa espacios", () => {
    expect(getExcerpt("# Título\n\n**negrita** y `código`  [enlace](http://x.com)")).toBe(
      "Título negrita y código enlace"
    );
  });

  it("no toca el guion bajo dentro de una palabra", () => {
    expect(getExcerpt("usa snake_case y _cursiva_")).toBe("usa snake_case y cursiva");
  });

  it("recorta al máximo con '…'", () => {
    expect(getExcerpt("a".repeat(50), 10)).toBe(`${"a".repeat(10)}…`);
  });

  it("no agrega '…' si entra justo", () => {
    expect(getExcerpt("a".repeat(10), 10)).toBe("a".repeat(10));
  });
});

describe("getPostSummary", () => {
  it("prefiere el excerpt de Strapi (sin espacios de los bordes)", () => {
    expect(getPostSummary({ excerpt: "  Resumen  ", content: "Otro" })).toBe("Resumen");
  });

  it.each([null, "", "   "])("excerpt %j cae al recorte del contenido", (excerpt) => {
    expect(getPostSummary({ excerpt, content: "**Contenido** largo" })).toBe("Contenido largo");
  });
});
