import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  ABOUT_TAG,
  ALL_TAGS,
  CATEGORIES_TAG,
  POSTS_TAG,
} from "@/lib/cacheTags";

interface StrapiWebhookPayload {
  event?: string;
  model?: string;
}

function isValidSecret(received: string | null): boolean {
  const expected = process.env.REVALIDATE_SECRET;
  if (!received || !expected) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function getTagsToRevalidate(payload: StrapiWebhookPayload): string[] {
  switch (payload.model) {
    case "post":
      // Todas las páginas de posts leen la lista cacheada (tag "posts"), así que
      // cubre alta, edición, cambio de slug y baja.
      return [POSTS_TAG];
    case "category":
      // Los posts incluyen el nombre de su categoría.
      return [CATEGORIES_TAG, POSTS_TAG];
    case "about":
      return [ABOUT_TAG];
    default:
      // Evento desconocido: más seguro invalidar todo que dejar contenido viejo.
      return [...ALL_TAGS];
  }
}

export async function POST(request: NextRequest) {
  if (!isValidSecret(request.headers.get("x-revalidate-secret"))) {
    return NextResponse.json(
      { error: "Secret inválido o faltante" },
      { status: 401 }
    );
  }

  let payload: StrapiWebhookPayload;
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new Error("El body debe ser un objeto JSON");
    }
    payload = body;
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const tags = getTagsToRevalidate(payload);

  // { expire: 0 }: desde un webhook no hay updateTag; así la próxima visita
  // no sirve contenido viejo y regenera la página con los datos nuevos.
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  console.log(
    `[revalidate] evento="${payload.event ?? "desconocido"}" modelo="${
      payload.model ?? "-"
    }" -> tags: ${tags.join(", ")}`
  );

  return NextResponse.json({
    revalidated: true,
    tags,
    now: Date.now(),
  });
}
