type PublicNavigationSection = "home" | "profile" | "worship" | "information" | "media"

type PublicNavigationItem = {
  title: string
  href: string
  section: PublicNavigationSection
}

type CmsNavigationItem = {
  navigationLabel: string
  slug: string
}

const primaryPublicNavigationItems: PublicNavigationItem[] = [
  {
    title: "Beranda",
    href: "/",
    section: "home",
  },
]

const contentPublicNavigationItems: PublicNavigationItem[] = [
  {
    title: "Ibadah",
    href: "/jadwal-ibadah",
    section: "worship",
  },
  {
    title: "Lokasi",
    href: "/lokasi",
    section: "profile",
  },
  {
    title: "Pelayan Gereja",
    href: "/pelayan",
    section: "profile",
  },
  {
    title: "Pawartos",
    href: "/pawartos",
    section: "information",
  },
  {
    title: "Pengumuman",
    href: "/pengumuman",
    section: "information",
  },
  {
    title: "Berita",
    href: "/berita",
    section: "information",
  },
  {
    title: "Agenda",
    href: "/agenda",
    section: "information",
  },
  {
    title: "Galeri",
    href: "/galeri",
    section: "media",
  },
]

function isPublicNavigationItemActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function isPublicNavigationGroupActive(pathname: string, items: PublicNavigationItem[]) {
  return items.some((item) => isPublicNavigationItemActive(pathname, item.href))
}

function getPublicNavigationItemsBySection(
  navigationItems: PublicNavigationItem[],
  section: PublicNavigationSection
) {
  return navigationItems.filter((item) => item.section === section)
}

function createPublicNavigationItems(cmsPages: CmsNavigationItem[]): PublicNavigationItem[] {
  const cmsItems: PublicNavigationItem[] = cmsPages.map((page) => ({
    title: page.navigationLabel,
    href: `/${page.slug}`,
    section: "profile",
  }))

  return [...primaryPublicNavigationItems, ...cmsItems, ...contentPublicNavigationItems]
}

export {
  createPublicNavigationItems,
  getPublicNavigationItemsBySection,
  isPublicNavigationGroupActive,
  isPublicNavigationItemActive,
}

export type { CmsNavigationItem, PublicNavigationItem, PublicNavigationSection }
