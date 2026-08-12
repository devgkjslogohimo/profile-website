import { z } from "zod"

import { userRoleValues } from "@/features/users/lib/user-role"

const userCreateFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama pengguna minimal 2 karakter.")
      .max(120, "Nama pengguna maksimal 120 karakter."),

    email: z
      .string()
      .trim()
      .min(1, "Email wajib diisi.")
      .email("Masukkan alamat email yang valid.")
      .max(254, "Email maksimal 254 karakter."),

    role: z.enum(userRoleValues, {
      message: "Pilih peran pengguna.",
    }),

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

const userUpdateFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama pengguna minimal 2 karakter.")
    .max(120, "Nama pengguna maksimal 120 karakter."),

  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi.")
    .email("Masukkan alamat email yang valid.")
    .max(254, "Email maksimal 254 karakter."),

  role: z.enum(userRoleValues, {
    message: "Pilih peran pengguna.",
  }),
})

type UserCreateFormInput = z.infer<typeof userCreateFormSchema>
type UserUpdateFormInput = z.infer<typeof userUpdateFormSchema>

export { userCreateFormSchema, userUpdateFormSchema }
export type { UserCreateFormInput, UserUpdateFormInput }
