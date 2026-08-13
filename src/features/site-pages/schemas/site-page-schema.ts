import { z } from "zod"

import { isRichTextContent, isRichTextEmpty, type RichTextContent } from "@/lib/rich-text"

const richTextContentSchema = z
  .custom<RichTextContent>(isRichTextContent, "Format isi halaman tidak valid.")
  .refine((value) => !isRichTextEmpty(value), "Isi halaman wajib diisi.")

const sitePageFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Judul halaman minimal 2 karakter.")
      .max(160, "Judul halaman maksimal 160 karakter."),

    content: richTextContentSchema,

    showInNavigation: z.boolean(),

    navigationLabel: z.string().trim().max(80, "Label navigasi maksimal 80 karakter."),

    navigationOrder: z
      .number()
      .int("Urutan navigasi harus berupa angka bulat.")
      .min(0, "Urutan navigasi minimal 0.")
      .max(9999, "Urutan navigasi maksimal 9999."),
  })
  .superRefine((value, context) => {
    if (value.showInNavigation && !value.navigationLabel) {
      context.addIssue({
        code: "custom",
        path: ["navigationLabel"],
        message: "Label navigasi wajib diisi jika halaman ditampilkan di menu.",
      })
    }
  })

type SitePageFormInput = z.infer<typeof sitePageFormSchema>

export { sitePageFormSchema }
export type { SitePageFormInput }
