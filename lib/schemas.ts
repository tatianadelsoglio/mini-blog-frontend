import { z } from "zod";

// Strapi devuelve null para campos vacíos; se normalizan a null / "" para que
// el resto de la app no tenga que distinguir undefined de null.
const nullableString = z
  .string()
  .nullish()
  .transform((value) => value ?? null);

const imageFormatSchema = z.object({
  url: z.string(),
  width: z.number(),
  height: z.number(),
});

export const imageSchema = z.object({
  url: z.string(),
  width: z.number().nullish(),
  height: z.number().nullish(),
  alternativeText: nullableString,
  formats: z
    .object({
      thumbnail: imageFormatSchema.optional(),
      small: imageFormatSchema.optional(),
      medium: imageFormatSchema.optional(),
      large: imageFormatSchema.optional(),
    })
    .nullish()
    .transform((value) => value ?? null),
});

export const categorySchema = z.object({
  id: z.number(),
  documentId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: nullableString,
});

export const postSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: nullableString,
  content: z
    .string()
    .nullish()
    .transform((value) => value ?? ""),
  publishedAt: nullableString,
  coverImage: imageSchema.nullish().transform((value) => value ?? null),
  category: categorySchema.nullish().transform((value) => value ?? null),
});

export const aboutSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  title: z.string(),
  content: z
    .string()
    .nullish()
    .transform((value) => value ?? ""),
  photo: imageSchema.nullish().transform((value) => value ?? null),
  githubUrl: nullableString,
  linkedinUrl: nullableString,
});

const paginationSchema = z.object({
  page: z.number(),
  pageCount: z.number(),
  total: z.number(),
});

export const listResponseSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    data: z.array(item),
    meta: z.object({ pagination: paginationSchema }),
  });

export const singleResponseSchema = <T extends z.ZodType>(item: T) =>
  z.object({ data: item.nullable() });

export type StrapiImage = z.infer<typeof imageSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Post = z.infer<typeof postSchema>;
export type About = z.infer<typeof aboutSchema>;
