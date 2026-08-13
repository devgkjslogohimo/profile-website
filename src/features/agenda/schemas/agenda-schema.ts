import { z } from "zod"

import { createAgendaDateTime, isValidAgendaDateTime } from "@/features/agenda/lib/agenda-date-time"
import { isGoogleDriveUrl } from "@/lib/google-drive"
import { isRichTextContent, isRichTextEmpty, type RichTextContent } from "@/lib/rich-text"

function isGoogleMapsUrl(value: string): boolean {
  if (value === "") {
    return true
  }

  try {
    const url = new URL(value)

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return false
    }

    const hostname = url.hostname.toLowerCase()
    const pathname = url.pathname.toLowerCase()

    if (hostname === "maps.app.goo.gl") {
      return true
    }

    if (hostname === "goo.gl" && pathname.startsWith("/maps")) {
      return true
    }

    const isGoogleDomain =
      hostname === "google.com" ||
      hostname.endsWith(".google.com") ||
      /^(.+\.)?google\.[a-z.]+$/.test(hostname)

    return isGoogleDomain && (hostname.startsWith("maps.") || pathname.startsWith("/maps"))
  } catch {
    return false
  }
}

const richTextContentSchema = z
  .custom<RichTextContent>(isRichTextContent, "Format isi agenda tidak valid.")
  .refine((value) => !isRichTextEmpty(value), "Isi agenda wajib diisi.")

const optionalCoverImageSchema = z
  .string()
  .trim()
  .max(1000, "Link cover maksimal 1000 karakter.")
  .refine(
    (value) => !value || isGoogleDriveUrl(value),
    "Masukkan link file gambar Google Drive yang valid."
  )

const agendaFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Judul agenda minimal 2 karakter.")
      .max(160, "Judul agenda maksimal 160 karakter."),

    excerpt: z
      .string()
      .trim()
      .min(10, "Ringkasan agenda minimal 10 karakter.")
      .max(500, "Ringkasan agenda maksimal 500 karakter."),

    content: richTextContentSchema,

    startsAt: z
      .string()
      .trim()
      .min(1, "Tanggal dan waktu mulai wajib diisi.")
      .refine(isValidAgendaDateTime, "Tanggal dan waktu mulai tidak valid."),

    endsAt: z
      .string()
      .trim()
      .refine(
        (value) => !value || isValidAgendaDateTime(value),
        "Tanggal dan waktu selesai tidak valid."
      ),

    location: z.string().trim().max(300, "Lokasi maksimal 300 karakter."),

    googleMapsUrl: z
      .string()
      .trim()
      .max(2048, "Link Google Maps terlalu panjang.")
      .refine(isGoogleMapsUrl, "Masukkan link Google Maps yang valid."),

    coverImageUrl: optionalCoverImageSchema,
  })
  .superRefine((value, context) => {
    if (!value.endsAt) {
      return
    }

    if (!isValidAgendaDateTime(value.startsAt) || !isValidAgendaDateTime(value.endsAt)) {
      return
    }

    const startsAt = createAgendaDateTime(value.startsAt)
    const endsAt = createAgendaDateTime(value.endsAt)

    if (endsAt.getTime() < startsAt.getTime()) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "Waktu selesai tidak boleh lebih awal dari waktu mulai.",
      })
    }
  })

type AgendaFormInput = z.infer<typeof agendaFormSchema>

export { agendaFormSchema }
export type { AgendaFormInput }
