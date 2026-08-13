import { z } from "zod"

import { isRichTextContent, isRichTextEmpty, type RichTextContent } from "@/lib/rich-text"

const richTextContentSchema = z
  .custom<RichTextContent>(isRichTextContent, "Format isi pengumuman tidak valid.")
  .refine((value) => !isRichTextEmpty(value), "Isi pengumuman wajib diisi.")

const announcementFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Judul pengumuman minimal 2 karakter.")
    .max(160, "Judul pengumuman maksimal 160 karakter."),

  content: richTextContentSchema,
})

type AnnouncementFormInput = z.infer<typeof announcementFormSchema>

export { announcementFormSchema }
export type { AnnouncementFormInput }
