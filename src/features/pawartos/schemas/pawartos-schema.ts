import { z } from "zod"

import { isGoogleDriveUrl } from "@/lib/google-drive"

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function isValidDate(value: string) {
  if (!DATE_PATTERN.test(value)) {
    return false
  }

  const [year, month, day] = value.split("-").map(Number)

  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

const pawartosFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Judul Pawartos minimal 2 karakter.")
    .max(160, "Judul Pawartos maksimal 160 karakter."),

  publicationDate: z
    .string()
    .trim()
    .min(1, "Tanggal Pawartos wajib diisi.")
    .refine(isValidDate, "Tanggal Pawartos tidak valid."),

  description: z.string().trim().max(1000, "Deskripsi maksimal 1000 karakter."),

  googleDriveUrl: z
    .string()
    .trim()
    .min(1, "Link PDF Google Drive wajib diisi.")
    .max(1000, "Link Google Drive maksimal 1000 karakter.")
    .refine(isGoogleDriveUrl, "Masukkan link file Google Drive yang valid."),
})

type PawartosFormInput = z.infer<typeof pawartosFormSchema>

export { pawartosFormSchema }
export type { PawartosFormInput }
