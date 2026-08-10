import { z } from "zod"

const bibleStudyScheduleFormSchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(2, "Nama kelompok minimal 2 karakter.")
    .max(100, "Nama kelompok maksimal 100 karakter."),

  dayOfWeek: z.enum(
    ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
    {
      error: "Pilih hari pelaksanaan PA.",
    }
  ),

  startTime: z
    .string()
    .trim()
    .regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/, "Pilih jam mulai yang valid."),

  location: z.string().trim().max(200, "Lokasi maksimal 200 karakter."),

  leaderName: z.string().trim().max(100, "Nama pemimpin maksimal 100 karakter."),

  notes: z.string().trim().max(1000, "Catatan maksimal 1000 karakter."),
})

type BibleStudyScheduleFormInput = z.infer<typeof bibleStudyScheduleFormSchema>

export { bibleStudyScheduleFormSchema }
export type { BibleStudyScheduleFormInput }
