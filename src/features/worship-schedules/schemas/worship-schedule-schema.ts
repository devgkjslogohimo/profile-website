import { z } from "zod"

function isValidDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match) {
    return false
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  const date = new Date(Date.UTC(year, month - 1, day))

  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

const worshipScheduleFormSchema = z.object({
  date: z.string().trim().refine(isValidDate, "Pilih tanggal jadwal ibadah yang valid."),
})

type WorshipScheduleFormInput = z.infer<typeof worshipScheduleFormSchema>

export { worshipScheduleFormSchema }
export type { WorshipScheduleFormInput }
