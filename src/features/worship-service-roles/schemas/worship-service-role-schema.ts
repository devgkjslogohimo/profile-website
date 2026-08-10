import { z } from "zod"

const worshipServiceRoleFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama peran minimal 2 karakter.")
    .max(100, "Nama peran maksimal 100 karakter."),
})

type WorshipServiceRoleFormInput = z.infer<typeof worshipServiceRoleFormSchema>

export { worshipServiceRoleFormSchema }
export type { WorshipServiceRoleFormInput }
