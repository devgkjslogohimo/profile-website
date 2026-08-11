import type { LucideIcon } from "lucide-react"
import {
  BookOpenText,
  Building2,
  CalendarDays,
  CalendarRange,
  Church,
  ClipboardList,
  FileText,
  GalleryVerticalEnd,
  HandHeart,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Settings,
  UserRound,
  Users,
} from "lucide-react"

import { type AdminRole, hasPermission, type Permission } from "@/lib/auth/permissions"

type AdminNavigationItem = {
  title: string
  href: string
  icon: LucideIcon
  permission: Permission
}

type AdminNavigationGroup = {
  label: string
  items: AdminNavigationItem[]
}

const adminNavigationGroups: AdminNavigationGroup[] = [
  {
    label: "Utama",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        permission: "dashboard.view",
      },
    ],
  },
  {
    label: "Konten",
    items: [
      {
        title: "Pawartos",
        href: "/admin/pawartos",
        icon: BookOpenText,
        permission: "content.create",
      },
      { title: "Berita", href: "/admin/berita", icon: Newspaper, permission: "content.create" },
      { title: "Agenda", href: "/admin/agenda", icon: CalendarDays, permission: "content.create" },
      {
        title: "Pengumuman",
        href: "/admin/pengumuman",
        icon: Megaphone,
        permission: "content.create",
      },
      { title: "Halaman", href: "/admin/halaman", icon: FileText, permission: "content.create" },
    ],
  },
  {
    label: "Gereja",
    items: [
      {
        title: "Jadwal Ibadah",
        href: "/admin/jadwal-ibadah",
        icon: CalendarRange,
        permission: "church.manage",
      },
      {
        title: "Peran Petugas Ibadah",
        href: "/admin/peran-petugas-ibadah",
        icon: ClipboardList,
        permission: "church.manage",
      },
      {
        title: "Jadwal PA",
        href: "/admin/jadwal-pa",
        icon: CalendarDays,
        permission: "church.manage",
      },
      {
        title: "Gereja & Pepanthan",
        href: "/admin/lokasi",
        icon: Church,
        permission: "church.manage",
      },
      {
        title: "Pelayanan",
        href: "/admin/pelayanan",
        icon: HandHeart,
        permission: "church.manage",
      },
      { title: "Pendeta", href: "/admin/pendeta", icon: UserRound, permission: "church.manage" },
      { title: "Majelis", href: "/admin/majelis", icon: Users, permission: "church.manage" },
      {
        title: "Statistik Jemaat",
        href: "/admin/statistik",
        icon: Building2,
        permission: "church.manage",
      },
    ],
  },
  {
    label: "Media",
    items: [
      {
        title: "Galeri",
        href: "/admin/galeri",
        icon: GalleryVerticalEnd,
        permission: "content.create",
      },
    ],
  },
  {
    label: "Layanan",
    items: [
      {
        title: "Formulir",
        href: "/admin/pengajuan",
        icon: ClipboardList,
        permission: "submissions.manage",
      },
    ],
  },
  {
    label: "Sistem",
    items: [
      { title: "Pengguna", href: "/admin/pengguna", icon: Users, permission: "users.manage" },
      {
        title: "Pengaturan",
        href: "/admin/pengaturan",
        icon: Settings,
        permission: "settings.manage",
      },
    ],
  },
]

function getAdminNavigation(role: AdminRole): AdminNavigationGroup[] {
  return adminNavigationGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasPermission(role, item.permission)),
    }))
    .filter((group) => group.items.length > 0)
}

export { getAdminNavigation }
export type { AdminNavigationGroup, AdminNavigationItem }
