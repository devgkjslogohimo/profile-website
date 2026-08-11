import { z } from "zod"

import { isGoogleDriveUrl } from "@/lib/google-drive"

const galleryImageFormSchema = z.object({
  imageUrl: z
    .string()
    .trim()
    .min(1, "Link foto wajib diisi.")
    .max(1000, "Link foto maksimal 1000 karakter.")
    .refine(isGoogleDriveUrl, "Masukkan link file gambar Google Drive yang valid."),

  caption: z.string().trim().max(500, "Caption maksimal 500 karakter."),

  altText: z.string().trim().max(300, "Alt text maksimal 300 karakter."),
})

type GalleryImageFormInput = z.infer<typeof galleryImageFormSchema>

export { galleryImageFormSchema }
export type { GalleryImageFormInput }
