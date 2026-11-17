// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PostContent } from "@/components/PostContent";

// next/image necesita el servidor de imágenes de Next; acá solo interesa el markup.
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const BUCKET = "https://proyecto.supabase.co/storage/v1/object/public/uploads";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("PostContent: bloques de código", () => {
  it("usa el title= del fence como nombre de archivo", () => {
    render(
      <PostContent content={'```ts title="app/page.tsx"\nconst a = 1;\n```'} />
    );

    const block = screen.getByRole("region", { name: "Código: app/page.tsx" });
    expect(block.textContent).toBe("const a = 1;");
    expect(screen.getByText("app/page.tsx")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Copiar" })).toBeTruthy();
  });

  it("sin title cae al lenguaje", () => {
    render(<PostContent content={"```python\nprint(1)\n```"} />);

    expect(screen.getByRole("region", { name: "Código: python" })).toBeTruthy();
    expect(screen.getByText("python")).toBeTruthy();
  });

  it("sin title ni lenguaje muestra 'Código'", () => {
    render(<PostContent content={"```\nsuelto\n```"} />);

    expect(screen.getByRole("region", { name: "Código" })).toBeTruthy();
    expect(screen.getByText("Código")).toBeTruthy();
  });
});

describe("PostContent: imágenes", () => {
  it("una imagen sola en su párrafo es una figure con figcaption", () => {
    const { container } = render(
      <PostContent content={`![Un paisaje](${BUCKET}/a.jpg "Pie de la foto")`} />
    );

    const figure = container.querySelector("figure");
    expect(figure).not.toBeNull();
    expect(figure?.querySelector("figcaption")?.textContent).toBe("Pie de la foto");
    expect(figure?.querySelector("img")?.getAttribute("alt")).toBe("Un paisaje");
    expect(figure?.querySelector("img")?.getAttribute("src")).toBe(`${BUCKET}/a.jpg`);
    // No queda envuelta en un <p> (HTML inválido).
    expect(container.querySelector("p")).toBeNull();
  });

  it("sin title la figure no tiene figcaption", () => {
    const { container } = render(<PostContent content={`![Alt](${BUCKET}/a.jpg)`} />);

    expect(container.querySelector("figure")).not.toBeNull();
    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("una imagen dentro de un párrafo con texto no genera figure", () => {
    const { container } = render(
      <PostContent content={`Mirá esto ![Alt](${BUCKET}/a.jpg "Pie") y seguí.`} />
    );

    expect(container.querySelector("figure")).toBeNull();
    expect(container.querySelector("p img")).not.toBeNull();
  });

  it("una imagen de un host no permitido se omite sin romper el post", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      <PostContent content={"![x](https://otro-host.example/a.jpg)\n\nTexto después."} />
    );

    expect(container.querySelector("figure")).toBeNull();
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("Texto después.")).toBeTruthy();
  });
});
