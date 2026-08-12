import { z } from "zod"

const resetUserPasswordSchema = z
  .object({
    password: z
      .string()
      .min(12, "Password minimal 12 karakter.")
      .max(128, "Password maksimal 128 karakter."),

    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak sama.",
    path: ["confirmPassword"],
  })

type ResetUserPasswordInput = z.infer<typeof resetUserPasswordSchema>

export { resetUserPasswordSchema }
export type { ResetUserPasswordInput }
