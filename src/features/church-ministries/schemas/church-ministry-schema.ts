import { z } from "zod"

import { isGoogleDriveUrl } from "@/lib/google-drive"

const optionalGoogleDriveUrlSchema = z
  .string()
  .trim()
  .max(1000, "Link gambar maksimal 1000 karakter.")
  .refine(
    (value) => !value || isGoogleDriveUrl(value),
    "Masukkan link file Google Drive yang valid."
  )

const churchMinistryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama pelayanan minimal 2 karakter.")
    .max(100, "Nama pelayanan maksimal 100 karakter."),

  summary: z.string().trim().max(300, "Ringkasan maksimal 300 karakter."),

  description: z.string().trim().max(5000, "Deskripsi maksimal 5000 karakter."),

  imageUrl: optionalGoogleDriveUrlSchema,
})

type ChurchMinistryFormInput = z.infer<typeof churchMinistryFormSchema>

export { churchMinistryFormSchema }
export type { ChurchMinistryFormInput }
