import { z } from "zod"

const churchStatisticMetricFormSchema = z.object({
  category: z
    .string()
    .trim()
    .min(2, "Kategori minimal 2 karakter.")
    .max(100, "Kategori maksimal 100 karakter."),

  label: z
    .string()
    .trim()
    .min(2, "Nama statistik minimal 2 karakter.")
    .max(160, "Nama statistik maksimal 160 karakter."),

  value: z
    .string()
    .trim()
    .min(1, "Nilai statistik wajib diisi.")
    .refine((value) => /^\d+$/.test(value), "Nilai statistik harus berupa bilangan bulat.")
    .refine((value) => Number(value) <= 2_147_483_647, "Nilai statistik terlalu besar."),

  unit: z.string().trim().max(50, "Satuan maksimal 50 karakter."),
})

type ChurchStatisticMetricFormInput = z.infer<typeof churchStatisticMetricFormSchema>

export { churchStatisticMetricFormSchema }
export type { ChurchStatisticMetricFormInput }
