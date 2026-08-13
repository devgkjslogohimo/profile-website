import { z } from "zod"

import { isGoogleDriveUrl } from "@/lib/google-drive"

const churchLocationCoverFormSchema = z.object({
  imageUrl: z
    .string()
    .trim()
    .max(1000, "Link foto maksimal 1000 karakter.")
    .refine(
      (value) => value === "" || isGoogleDriveUrl(value),
      "Masukkan link file gambar Google Drive yang valid."
    ),
})

const churchLocationImageFormSchema = z.object({
  imageUrl: z
    .string()
    .trim()
    .min(1, "Link foto wajib diisi.")
    .max(1000, "Link foto maksimal 1000 karakter.")
    .refine(isGoogleDriveUrl, "Masukkan link file gambar Google Drive yang valid."),

  caption: z.string().trim().max(300, "Caption maksimal 300 karakter."),
})

export { churchLocationCoverFormSchema, churchLocationImageFormSchema }
