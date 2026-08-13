import { z } from "zod"

import { isGoogleDriveUrl } from "@/lib/google-drive"
import { isRichTextContent, isRichTextEmpty, type RichTextContent } from "@/lib/rich-text"

const richTextContentSchema = z
  .custom<RichTextContent>(isRichTextContent, "Format isi berita tidak valid.")
  .refine((value) => !isRichTextEmpty(value), "Isi berita wajib diisi.")

const optionalCoverImageSchema = z
  .string()
  .trim()
  .max(1000, "Link cover maksimal 1000 karakter.")
  .refine(
    (value) => !value || isGoogleDriveUrl(value),
    "Masukkan link file gambar Google Drive yang valid."
  )

const newsFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Judul berita minimal 2 karakter.")
    .max(160, "Judul berita maksimal 160 karakter."),

  excerpt: z
    .string()
    .trim()
    .min(10, "Ringkasan berita minimal 10 karakter.")
    .max(500, "Ringkasan berita maksimal 500 karakter."),

  content: richTextContentSchema,

  coverImageUrl: optionalCoverImageSchema,
})

type NewsFormInput = z.infer<typeof newsFormSchema>

export { newsFormSchema }
export type { NewsFormInput }
