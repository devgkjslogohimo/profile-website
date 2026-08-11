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

const requiredDateSchema = z
  .string()
  .trim()
  .min(1, "Periode mulai wajib diisi.")
  .refine(isValidDate, "Periode mulai tidak valid.")

const optionalDateSchema = z
  .string()
  .trim()
  .refine((value) => !value || isValidDate(value), "Periode selesai tidak valid.")

const optionalGoogleDriveUrlSchema = z
  .string()
  .trim()
  .max(1000, "Link foto maksimal 1000 karakter.")
  .refine(
    (value) => !value || isGoogleDriveUrl(value),
    "Masukkan link file Google Drive yang valid."
  )

const churchPastorFormSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Nama pendeta minimal 2 karakter.")
      .max(160, "Nama pendeta maksimal 160 karakter."),

    periodStart: requiredDateSchema,

    periodEnd: optionalDateSchema,

    summary: z.string().trim().max(300, "Ringkasan maksimal 300 karakter."),

    biography: z.string().trim().max(5000, "Biografi maksimal 5000 karakter."),

    photoUrl: optionalGoogleDriveUrlSchema,
  })
  .superRefine((data, context) => {
    if (!data.periodEnd) {
      return
    }

    if (data.periodEnd < data.periodStart) {
      context.addIssue({
        code: "custom",
        path: ["periodEnd"],
        message: "Periode selesai tidak boleh lebih awal dari periode mulai.",
      })
    }
  })

type ChurchPastorFormInput = z.infer<typeof churchPastorFormSchema>

export { churchPastorFormSchema }
export type { ChurchPastorFormInput }
