import { z } from "zod"

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function isValidDate(value: string) {
  if (!DATE_PATTERN.test(value)) {
    return false
  }

  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

const churchStatisticSnapshotFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Judul statistik minimal 2 karakter.")
    .max(160, "Judul statistik maksimal 160 karakter."),

  asOfDate: z
    .string()
    .trim()
    .min(1, "Tanggal statistik wajib diisi.")
    .refine(isValidDate, "Tanggal statistik tidak valid."),

  notes: z.string().trim().max(2000, "Catatan maksimal 2000 karakter."),
})

type ChurchStatisticSnapshotFormInput = z.infer<typeof churchStatisticSnapshotFormSchema>

export { churchStatisticSnapshotFormSchema }
export type { ChurchStatisticSnapshotFormInput }
