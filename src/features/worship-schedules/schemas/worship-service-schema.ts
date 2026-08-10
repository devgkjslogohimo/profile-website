import { z } from "zod"

const worshipServiceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama ibadah minimal 2 karakter.")
    .max(100, "Nama ibadah maksimal 100 karakter."),

  churchLocationId: z.string().trim().min(1, "Pilih lokasi ibadah."),

  startTime: z
    .string()
    .trim()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Pilih jam mulai ibadah yang valid."),
})

type WorshipServiceFormInput = z.infer<typeof worshipServiceFormSchema>

export { worshipServiceFormSchema }
export type { WorshipServiceFormInput }
