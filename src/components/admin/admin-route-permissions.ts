import type { Permission } from "@/lib/auth/permissions"

const adminRoutePermissions: Record<string, Permission> = {
  pawartos: "content.create",
  berita: "content.create",
  agenda: "content.create",
  pengumuman: "content.create",
  halaman: "content.create",

  "jadwal-ibadah": "church.manage",
  "peran-petugas-ibadah": "church.manage",
  "jadwal-pa": "church.manage",
  lokasi: "church.manage",
  pelayanan: "church.manage",
  pendeta: "church.manage",
  majelis: "church.manage",
  statistik: "church.manage",

  galeri: "content.create",
  pengajuan: "submissions.manage",

  pengguna: "users.manage",
  pengaturan: "settings.manage",
}

export { adminRoutePermissions }
