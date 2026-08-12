import { z } from "zod"

function isValidEmail(value: string) {
  if (!value) {
    return true
  }

  return z.string().email().safeParse(value).success
}

function isValidPhoneNumber(value: string) {
  if (!value) {
    return true
  }

  return /^[0-9+().\-\s]+$/.test(value)
}

function isValidHttpsUrl(value: string) {
  if (!value) {
    return true
  }

  try {
    const url = new URL(value)

    return url.protocol === "https:"
  } catch {
    return false
  }
}

const websiteSettingFormSchema = z.object({
  siteName: z
    .string()
    .trim()
    .min(2, "Nama website minimal 2 karakter.")
    .max(120, "Nama website maksimal 120 karakter."),

  tagline: z.string().trim().max(180, "Tagline maksimal 180 karakter."),

  description: z.string().trim().max(1000, "Deskripsi maksimal 1000 karakter."),

  email: z
    .string()
    .trim()
    .max(254, "Email maksimal 254 karakter.")
    .refine(isValidEmail, "Masukkan alamat email yang valid."),

  phone: z
    .string()
    .trim()
    .max(50, "Nomor telepon maksimal 50 karakter.")
    .refine(isValidPhoneNumber, "Nomor telepon hanya boleh berisi angka dan karakter telepon."),

  whatsapp: z
    .string()
    .trim()
    .max(50, "Nomor WhatsApp maksimal 50 karakter.")
    .refine(isValidPhoneNumber, "Nomor WhatsApp hanya boleh berisi angka dan karakter telepon."),

  facebookUrl: z
    .string()
    .trim()
    .max(1000, "Link Facebook maksimal 1000 karakter.")
    .refine(isValidHttpsUrl, "Masukkan link Facebook HTTPS yang valid."),

  instagramUrl: z
    .string()
    .trim()
    .max(1000, "Link Instagram maksimal 1000 karakter.")
    .refine(isValidHttpsUrl, "Masukkan link Instagram HTTPS yang valid."),

  youtubeUrl: z
    .string()
    .trim()
    .max(1000, "Link YouTube maksimal 1000 karakter.")
    .refine(isValidHttpsUrl, "Masukkan link YouTube HTTPS yang valid."),
})

type WebsiteSettingFormInput = z.infer<typeof websiteSettingFormSchema>

export { websiteSettingFormSchema }

export type { WebsiteSettingFormInput }
