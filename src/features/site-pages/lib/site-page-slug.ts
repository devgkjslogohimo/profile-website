const reservedSitePageSlugs = new Set([
  "admin",
  "api",
  "_next",
  "design-system",

  "pawartos",
  "berita",
  "agenda",
  "pengumuman",
  "halaman",
  "galeri",
  "pengajuan",

  "jadwal-ibadah",
  "jadwal-pa",
  "lokasi",
  "pelayanan",
  "pendeta",
  "majelis",
  "statistik",

  "pengguna",
  "pengaturan",
])

function createSitePageSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function isReservedSitePageSlug(slug: string) {
  return reservedSitePageSlugs.has(slug)
}

export { createSitePageSlug, isReservedSitePageSlug }
