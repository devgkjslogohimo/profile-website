import { z } from "zod"

import { isGoogleDriveUrl } from "@/lib/google-drive"

import { isGoogleDriveFolderUrl } from "../lib/gallery-google-drive-url"

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

const optionalDateSchema = z
  .string()
  .trim()
  .refine((value) => !value || isValidDate(value), "Tanggal kegiatan tidak valid.")

const optionalGoogleDriveImageUrlSchema = z
  .string()
  .trim()
  .max(1000, "Link cover maksimal 1000 karakter.")
  .refine(
    (value) => !value || isGoogleDriveUrl(value),
    "Masukkan link file gambar Google Drive yang valid."
  )

const optionalGoogleDriveFolderUrlSchema = z
  .string()
  .trim()
  .max(1000, "Link Google Drive maksimal 1000 karakter.")
  .refine(
    (value) => !value || isGoogleDriveFolderUrl(value),
    "Masukkan link folder Google Drive yang valid."
  )

const galleryAlbumFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Judul album minimal 2 karakter.")
    .max(160, "Judul album maksimal 160 karakter."),

  description: z.string().trim().max(2000, "Deskripsi maksimal 2000 karakter."),

  eventDate: optionalDateSchema,

  coverImageUrl: optionalGoogleDriveImageUrlSchema,

  googleDriveUrl: optionalGoogleDriveFolderUrlSchema,
})

type GalleryAlbumFormInput = z.infer<typeof galleryAlbumFormSchema>

export { galleryAlbumFormSchema }
export type { GalleryAlbumFormInput }
