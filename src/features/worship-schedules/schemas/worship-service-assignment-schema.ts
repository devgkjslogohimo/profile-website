import { z } from "zod"

const worshipServiceAssignmentFormSchema = z.object({
  worshipServiceRoleId: z.string().trim().min(1, "Pilih peran petugas."),
  personName: z
    .string()
    .trim()
    .min(2, "Nama petugas minimal 2 karakter.")
    .max(100, "Nama petugas maksimal 100 karakter."),
})

type WorshipServiceAssignmentFormInput = z.infer<typeof worshipServiceAssignmentFormSchema>

export { worshipServiceAssignmentFormSchema }
export type { WorshipServiceAssignmentFormInput }
