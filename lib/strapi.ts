import type { z } from "zod";
import { FALLBACK_REVALIDATE_SECONDS } from "@/lib/cacheTags";

// Render Free duerme el backend tras 15 min y tarda ~1 min en despertar.
const REQUEST_TIMEOUT_MS = 90_000;
const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 3_000;

export class StrapiError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = "StrapiError";
  }
}

function getBaseUrl(): string {
  const url = process.env.STRAPI_URL;
  if (!url) {
    throw new StrapiError(
      "Falta la variable de entorno STRAPI_URL (ver .env.example)."
    );
  }
  return url.replace(/\/$/, "");
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface StrapiFetchOptions {
  tags: string[];
  /** Si es true, un 404 devuelve null en lugar de lanzar error. */
  allowNotFound?: boolean;
}

/**
 * GET a la API de Strapi con caché de datos de Next (force-cache + tags +
 * fallback largo), timeout y reintentos para tolerar el arranque en frío.
 * Devuelve el JSON sin validar; cada servicio lo valida con zod.
 */
export async function strapiFetch(
  path: string,
  { tags, allowNotFound = false }: StrapiFetchOptions
): Promise<unknown | null> {
  const url = `${getBaseUrl()}${path}`;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        cache: "force-cache",
        next: { tags, revalidate: FALLBACK_REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });

      if (res.status === 404 && allowNotFound) return null;
      if (res.ok) return await res.json();

      // 4xx (salvo 408/429) no mejora reintentando.
      const retryable = res.status >= 500 || res.status === 408 || res.status === 429;
      lastError = new StrapiError(
        `Strapi respondió ${res.status} en ${path}`,
        res.status
      );
      if (!retryable) throw lastError;
    } catch (error) {
      if (error instanceof StrapiError && !isRetryable(error)) throw error;
      lastError = error;
    }

    if (attempt < MAX_ATTEMPTS) {
      await wait(RETRY_DELAY_MS * attempt);
    }
  }

  const reason = lastError instanceof Error ? lastError.message : "desconocido";
  throw new StrapiError(
    `No se pudo conectar con Strapi (${path}) tras ${MAX_ATTEMPTS} intentos: ${reason}`,
    lastError instanceof StrapiError ? lastError.status : undefined
  );
}

function isRetryable(error: StrapiError): boolean {
  const { status } = error;
  return status === undefined || status >= 500 || status === 408 || status === 429;
}

/** Valida una respuesta de Strapi con zod y lanza un error legible si no coincide. */
export function parseStrapi<T extends z.ZodType>(
  schema: T,
  json: unknown,
  context: string
): z.infer<T> {
  const result = schema.safeParse(json);
  if (!result.success) {
    const detail = result.error.issues
      .slice(0, 3)
      .map((issue) => `${issue.path.join(".") || "(raíz)"}: ${issue.message}`)
      .join("; ");
    throw new StrapiError(`Respuesta inesperada de Strapi en ${context}: ${detail}`);
  }
  return result.data;
}
