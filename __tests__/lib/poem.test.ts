import { describe, expect, it } from "vitest";
import { getPoemPreview, isStanzaBreak, parseInline, splitStanzas } from "@/lib/poem";

describe("splitStanzas", () => {
  it("separa estrofas por líneas en blanco y conserva los saltos de verso", () => {
    expect(splitStanzas("uno\ndos\n\ntres")).toEqual(["uno\ndos", "tres"]);
  });

  it("varias líneas vacías (o con espacios) cuentan como un solo corte", () => {
    expect(splitStanzas("uno\n\n\n   \n\ndos")).toEqual(["uno", "dos"]);
  });

  it("normaliza CRLF", () => {
    expect(splitStanzas("uno\r\ndos\r\n\r\ntres")).toEqual(["uno\ndos", "tres"]);
  });

  it("conserva la sangría de 4 espacios de cada verso", () => {
    const [stanza] = splitStanzas("primero\n    sangrado\n        más");
    expect(stanza.split("\n")).toEqual(["primero", "    sangrado", "        más"]);
  });

  it("conserva la sangría del primer verso de una estrofa", () => {
    expect(splitStanzas("uno\n\n    dos\ntres")).toEqual(["uno", "    dos\ntres"]);
  });

  it("descarta líneas en blanco al inicio y final y el contenido vacío", () => {
    expect(splitStanzas("\n\nuno\n\n")).toEqual(["uno"]);
    expect(splitStanzas("")).toEqual([]);
    expect(splitStanzas("  \n \n")).toEqual([]);
  });
});

describe("parseInline", () => {
  it("texto sin marcas es un solo segmento plano", () => {
    expect(parseInline("hola mundo")).toEqual([{ text: "hola mundo", style: "plain" }]);
  });

  it("*cursiva* y _cursiva_", () => {
    expect(parseInline("a *b* c")).toEqual([
      { text: "a ", style: "plain" },
      { text: "b", style: "italic" },
      { text: " c", style: "plain" },
    ]);
    expect(parseInline("_b_")).toEqual([{ text: "b", style: "italic" }]);
  });

  it("**negrita**", () => {
    expect(parseInline("**fuerte** y suave")).toEqual([
      { text: "fuerte", style: "bold" },
      { text: " y suave", style: "plain" },
    ]);
  });

  it("varias marcas en el mismo verso", () => {
    const styles = parseInline("*uno* dos **tres**").map((s) => s.style);
    expect(styles).toEqual(["italic", "plain", "bold"]);
  });

  it("el guion bajo dentro de una palabra no es cursiva", () => {
    expect(parseInline("snake_case_word")).toEqual([
      { text: "snake_case_word", style: "plain" },
    ]);
  });

  it("'* * *' queda como texto literal", () => {
    expect(parseInline("* * *")).toEqual([{ text: "* * *", style: "plain" }]);
  });

  it("un asterisco suelto sin cierre no abre nada", () => {
    expect(parseInline("a * b")).toEqual([{ text: "a * b", style: "plain" }]);
  });

  it("conserva los espacios iniciales", () => {
    expect(parseInline("    verso")).toEqual([{ text: "    verso", style: "plain" }]);
  });
});

describe("isStanzaBreak", () => {
  it.each(["* * *", "***", "*  *  *", "---", "- - -", "  * * *  "])(
    "%j es un separador",
    (value) => expect(isStanzaBreak(value)).toBe(true)
  );

  it.each(["*cursiva*", "**negrita**", "--", "* *", "texto", "* * * fin"])(
    "%j no es un separador",
    (value) => expect(isStanzaBreak(value)).toBe(false)
  );
});

describe("getPoemPreview (primeros versos del 'Último poema')", () => {
  const poem = [
    "Primer verso",
    "    segundo con sangría",
    "",
    "tercero *itálica*",
    "* * *",
    "cuarto",
  ].join("\n");

  it("devuelve 3 versos por defecto, sin líneas en blanco", () => {
    expect(getPoemPreview(poem)).toEqual([
      "Primer verso",
      "    segundo con sangría",
      "tercero *itálica*",
    ]);
  });

  it("conserva la sangría y las marcas inline (las resuelve el componente)", () => {
    const [, second, third] = getPoemPreview(poem);
    expect(second.startsWith("    ")).toBe(true);
    expect(third).toContain("*itálica*");
  });

  it("omite los separadores ornamentales", () => {
    expect(getPoemPreview("uno\n* * *\ndos\n---\ntres", 5)).toEqual(["uno", "dos", "tres"]);
  });

  it("respeta maxLines y devuelve todos si hay menos", () => {
    expect(getPoemPreview("a\nb\nc\nd", 2)).toEqual(["a", "b"]);
    expect(getPoemPreview("a\nb")).toEqual(["a", "b"]);
  });

  it("quita el espacio final pero no el inicial; acepta CRLF", () => {
    expect(getPoemPreview("  a   \r\nb\r\n")).toEqual(["  a", "b"]);
  });

  it("contenido vacío o solo separadores no da versos", () => {
    expect(getPoemPreview("")).toEqual([]);
    expect(getPoemPreview("\n* * *\n\n")).toEqual([]);
  });
});
