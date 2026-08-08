import { z } from "zod"

function isGoogleMapsUrl(value: string): boolean {
  if (value === "") {
    return true
  }

  try {
    const url = new URL(value)

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return false
    }

    const hostname = url.hostname.toLowerCase()
    const pathname = url.pathname.toLowerCase()

    if (hostname === "maps.app.goo.gl") {
      return true
    }

    if (hostname === "goo.gl" && pathname.startsWith("/maps")) {
      return true
    }

    const isGoogleDomain =
      hostname === "google.com" ||
      hostname.endsWith(".google.com") ||
      /^(.+\.)?google\.[a-z.]+$/.test(hostname)

    return isGoogleDomain && (hostname.startsWith("maps.") || pathname.startsWith("/maps"))
  } catch {
    return false
  }
}

const churchLocationFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama lokasi minimal 2 karakter.")
    .max(100, "Nama lokasi maksimal 100 karakter."),
  type: z.enum(["CHURCH", "PEPANTHAN"], {
    error: "Pilih jenis lokasi.",
  }),
  googleMapsUrl: z
    .string()
    .trim()
    .max(2048, "Link Google Maps terlalu panjang.")
    .refine(isGoogleMapsUrl, "Masukkan link Google Maps yang valid."),
})

const churchLocationSlugSchema = z
  .string()
  .min(2, "Nama lokasi harus menghasilkan slug minimal 2 karakter.")
  .max(100, "Slug maksimal 100 karakter.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Nama lokasi tidak dapat menghasilkan slug yang valid.")

type ChurchLocationFormInput = z.infer<typeof churchLocationFormSchema>

export { churchLocationFormSchema, churchLocationSlugSchema }
export type { ChurchLocationFormInput }
