import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface StrapiWebhookPayload {
  event?: string;
  model?: string;
  uid?: string;
  entry?: {
    id?: number;
    documentId?: string;
  };
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: "Secret inválido o faltante" },
      { status: 401 }
    );
  }

  let payload: StrapiWebhookPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const { event, entry } = payload;
  const documentId = entry?.documentId;

  revalidatePath("/");
  if (documentId) {
    revalidatePath(`/posts/${documentId}`);
  }

  console.log(
    `[revalidate] evento="${event ?? "desconocido"}" documentId="${
      documentId ?? "-"
    }" -> revalidado "/"${documentId ? ` y "/posts/${documentId}"` : ""}`
  );

  return NextResponse.json({
    revalidated: true,
    event: event ?? null,
    documentId: documentId ?? null,
    now: Date.now(),
  });
}
