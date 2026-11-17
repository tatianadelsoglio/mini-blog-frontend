import type { Element } from "hast";
import { describe, expect, it } from "vitest";
import { getSoleImage, isCiteParagraph, parseCodeFence } from "@/lib/markdown";

const text = (value: string) => ({ type: "text" as const, value });

const el = (
  tagName: string,
  properties: Element["properties"] = {},
  children: Element["children"] = []
): Element => ({ type: "element", tagName, properties, children });

function fence(opts: { language?: string; meta?: string; code?: string }): Element {
  const code = el(
    "code",
    opts.language ? { className: [`language-${opts.language}`] } : {},
    [text(opts.code ?? "const a = 1;\n")]
  );
  if (opts.meta !== undefined) code.data = { meta: opts.meta } as Element["data"];
  return el("pre", {}, [code]);
}

describe("parseCodeFence", () => {
  it("toma el title= del fence como nombre de archivo", () => {
    expect(
      parseCodeFence(fence({ language: "ts", meta: 'title="app/page.tsx"' }))
    ).toMatchObject({ title: "app/page.tsx", language: "ts" });
  });

  it("acepta comillas simples y valor sin comillas", () => {
    expect(parseCodeFence(fence({ meta: "title='a b.ts'" })).title).toBe("a b.ts");
    expect(parseCodeFence(fence({ meta: "title=index.ts" })).title).toBe("index.ts");
  });

  it("encuentra title= entre otras opciones de la meta", () => {
    expect(parseCodeFence(fence({ meta: '{1,3} title="x.js" showLineNumbers' })).title).toBe(
      "x.js"
    );
  });

  it("sin title el título es null y queda el lenguaje", () => {
    expect(parseCodeFence(fence({ language: "python" }))).toMatchObject({
      title: null,
      language: "python",
    });
    expect(parseCodeFence(fence({ language: "python", meta: "{1}" })).title).toBeNull();
  });

  it("sin lenguaje ni title ambos son null", () => {
    expect(parseCodeFence(fence({}))).toMatchObject({ title: null, language: null });
  });

  it("devuelve el código sin el salto de línea final", () => {
    expect(parseCodeFence(fence({ code: "a\nb\n" })).code).toBe("a\nb");
  });

  it("un pre sin <code> o indefinido no rompe", () => {
    expect(parseCodeFence(el("pre"))).toEqual({ code: "", language: null, title: null });
    expect(parseCodeFence(undefined).code).toBe("");
  });
});

describe("getSoleImage", () => {
  const img = (props: Element["properties"]) => el("img", props);

  it("un párrafo con solo una imagen devuelve sus datos", () => {
    const paragraph = el("p", {}, [img({ src: "/a.jpg", alt: "Alt", title: "Pie" })]);
    expect(getSoleImage(paragraph)).toEqual({ src: "/a.jpg", alt: "Alt", title: "Pie" });
  });

  it("ignora los espacios en blanco alrededor", () => {
    const paragraph = el("p", {}, [text("\n"), img({ src: "/a.jpg" }), text(" ")]);
    expect(getSoleImage(paragraph)).toEqual({ src: "/a.jpg", alt: "", title: null });
  });

  it("imagen mezclada con texto u otras imágenes no es 'sola'", () => {
    expect(getSoleImage(el("p", {}, [text("Hola "), img({ src: "/a.jpg" })]))).toBeNull();
    expect(
      getSoleImage(el("p", {}, [img({ src: "/a.jpg" }), img({ src: "/b.jpg" })]))
    ).toBeNull();
  });

  it("otro elemento, sin src o sin nodo da null", () => {
    expect(getSoleImage(el("p", {}, [el("strong")]))).toBeNull();
    expect(getSoleImage(el("p", {}, [img({ alt: "x" })]))).toBeNull();
    expect(getSoleImage(undefined)).toBeNull();
  });
});

describe("isCiteParagraph", () => {
  it.each(["— Autor", "-- Autor", "  — Autor"])("%j es firma de cita", (value) => {
    expect(isCiteParagraph(el("p", {}, [text(value)]))).toBe(true);
  });

  it.each(["Autor — x", "—Autor", "texto"])("%j no lo es", (value) => {
    expect(isCiteParagraph(el("p", {}, [text(value)]))).toBe(false);
  });
});
