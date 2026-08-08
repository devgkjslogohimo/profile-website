import { z } from "zod"

const loginSchema = z.object({
  email: z.string().trim().email("Masukkan alamat email yang valid."),
  password: z.string().min(1, "Password wajib diisi."),
})

export { loginSchema }
