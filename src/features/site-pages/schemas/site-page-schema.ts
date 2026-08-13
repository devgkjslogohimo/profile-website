import { z } from "zod"

import { isRichTextContent, isRichTextEmpty, type RichTextContent } from "@/lib/rich-text"

const richTextContentSchema = z
  .custom<RichTextContent>(isRichTextContent, "Format isi halaman tidak valid.")
  .refine((value) => !isRichTextEmpty(value), "Isi halaman wajib diisi.")

const sitePageFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Judul halaman minimal 2 karakter.")
    .max(160, "Judul halaman maksimal 160 karakter."),

  content: richTextContentSchema,
})

type SitePageFormInput = z.infer<typeof sitePageFormSchema>

export { sitePageFormSchema }
export type { SitePageFormInput }
