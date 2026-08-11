import { z } from "zod"

import { isGoogleFormUrl } from "@/features/church-forms/lib/google-form-url"

const churchFormFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Nama formulir minimal 2 karakter.")
    .max(160, "Nama formulir maksimal 160 karakter."),

  description: z.string().trim().max(1000, "Deskripsi maksimal 1000 karakter."),

  googleFormUrl: z
    .string()
    .trim()
    .min(1, "Link Google Form wajib diisi.")
    .max(1000, "Link Google Form maksimal 1000 karakter.")
    .refine(isGoogleFormUrl, "Masukkan link Google Form yang valid."),
})

type ChurchFormFormInput = z.infer<typeof churchFormFormSchema>

export { churchFormFormSchema }
export type { ChurchFormFormInput }
