import { z } from "zod"

import { isValidAnnouncementDateTime } from "@/features/announcements/lib/announcement-date-time"
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

  displayUntil: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || isValidAnnouncementDateTime(value),
      "Batas waktu tampil tidak valid."
    ),

  content: richTextContentSchema,
})

type AnnouncementFormInput = z.infer<typeof announcementFormSchema>

export { announcementFormSchema }
export type { AnnouncementFormInput }
