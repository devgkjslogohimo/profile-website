import { z } from "zod"

import { isGoogleDriveUrl } from "@/lib/google-drive"

const heroSlideFormSchema = z
  .object({
    imageUrl: z
      .string()
      .trim()
      .max(1000, "Link foto maksimal 1000 karakter.")
      .refine(
        (value) => value === "" || isGoogleDriveUrl(value),
        "Masukkan link file Google Drive yang valid."
      ),

    altText: z.string().trim().max(180, "Alt text maksimal 180 karakter."),

    isActive: z.boolean(),
  })
  .superRefine((value, context) => {
    if (!value.imageUrl) {
      return
    }

    if (value.altText.length < 2) {
      context.addIssue({
        code: "custom",
        path: ["altText"],
        message: "Alt text wajib diisi jika foto tersedia.",
      })
    }
  })

type HeroSlideFormInput = z.infer<typeof heroSlideFormSchema>

export { heroSlideFormSchema }
export type { HeroSlideFormInput }
