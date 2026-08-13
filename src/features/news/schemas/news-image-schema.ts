import { z } from "zod"

import { isGoogleDriveUrl } from "@/lib/google-drive"

const newsImageFormSchema = z.object({
  googleDriveUrl: z
    .string()
    .trim()
    .min(1, "Link foto Google Drive wajib diisi.")
    .max(1000, "Link Google Drive maksimal 1000 karakter.")
    .refine(isGoogleDriveUrl, "Masukkan link file Google Drive yang valid."),

  altText: z.string().trim().max(200, "Alt text maksimal 200 karakter."),

  caption: z.string().trim().max(500, "Caption maksimal 500 karakter."),
})

type NewsImageFormInput = z.infer<typeof newsImageFormSchema>

export { newsImageFormSchema }
export type { NewsImageFormInput }
