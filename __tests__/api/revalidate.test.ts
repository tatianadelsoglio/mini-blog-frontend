import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/revalidate/route";

vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));

const SECRET = "secreto-de-prueba";

function makeRequest(body: BodyInit | null, secret?: string): NextRequest {
  return new NextRequest("http://localhost:3000/api/revalidate", {
    method: "POST",
    headers: secret === undefined ? {} : { "x-revalidate-secret": secret },
    body,
  });
}

const json = (value: unknown) => JSON.stringify(value);

beforeEach(() => {
  vi.stubEnv("REVALIDATE_SECRET", SECRET);
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.mocked(revalidateTag).mockClear();
});

describe("POST /api/revalidate: autenticación", () => {
  it("401 sin el header del secreto", async () => {
    const res = await POST(makeRequest(json({ model: "post" })));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("401 con un secreto incorrecto (misma y distinta longitud)", async () => {
    for (const wrong of ["secreto-de-pruebX", "corto"]) {
      const res = await POST(makeRequest(json({ model: "post" }), wrong));
      expect(res.status).toBe(401);
    }
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("401 si el servidor no tiene REVALIDATE_SECRET configurado", async () => {
    vi.stubEnv("REVALIDATE_SECRET", "");
    const res = await POST(makeRequest(json({ model: "post" }), ""));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("valida el secreto antes de leer el body", async () => {
    const res = await POST(makeRequest("{no es json", "incorrecto"));
    expect(res.status).toBe(401);
  });
});

describe("POST /api/revalidate: body", () => {
  it.each([
    ["JSON malformado", "{no es json"],
    ["body vacío", ""],
    ["un array", "[1, 2]"],
    ["null", "null"],
    ["un string", '"post"'],
  ])("400 con %s", async (_name, body) => {
    const res = await POST(makeRequest(body, SECRET));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Body inválido" });
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});

describe("POST /api/revalidate: tags", () => {
  async function revalidate(payload: unknown) {
    const res = await POST(makeRequest(json(payload), SECRET));
    return { res, body: await res.json() };
  }

  it("post -> solo 'posts'", async () => {
    const { res, body } = await revalidate({ event: "entry.update", model: "post" });

    expect(res.status).toBe(200);
    expect(body).toMatchObject({ revalidated: true, tags: ["posts"] });
    expect(revalidateTag).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledWith("posts", { expire: 0 });
  });

  it("category -> 'categories' y 'posts'", async () => {
    const { body } = await revalidate({ model: "category" });

    expect(body.tags).toEqual(["categories", "posts"]);
    expect(revalidateTag).toHaveBeenCalledWith("categories", { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledWith("posts", { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledTimes(2);
  });

  it("about -> solo 'about'", async () => {
    const { body } = await revalidate({ model: "about" });

    expect(body.tags).toEqual(["about"]);
    expect(revalidateTag).toHaveBeenCalledTimes(1);
    expect(revalidateTag).toHaveBeenCalledWith("about", { expire: 0 });
  });

  it.each([{ model: "otra-cosa" }, { model: 5 }, {}])(
    "modelo desconocido %j -> invalida todo",
    async (payload) => {
      const { body } = await revalidate(payload);

      expect(body.tags).toEqual(["posts", "categories", "about"]);
      expect(revalidateTag).toHaveBeenCalledTimes(3);
    }
  );
});
