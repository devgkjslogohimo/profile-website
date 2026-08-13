type PublicNavigationItem = {
  title: string
  href: string
}

type CmsNavigationItem = {
  navigationLabel: string
  slug: string
}

const primaryPublicNavigationItems: PublicNavigationItem[] = [
  {
    title: "Beranda",
    href: "/",
  },
]

const contentPublicNavigationItems: PublicNavigationItem[] = [
  {
    title: "Ibadah",
    href: "/jadwal-ibadah",
  },
  {
    title: "Pawartos",
    href: "/pawartos",
  },
  {
    title: "Pengumuman",
    href: "/pengumuman",
  },
  {
    title: "Berita",
    href: "/berita",
  },
  {
    title: "Agenda",
    href: "/agenda",
  },
  {
    title: "Galeri",
    href: "/galeri",
  },
]

function isPublicNavigationItemActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function createPublicNavigationItems(cmsPages: CmsNavigationItem[]): PublicNavigationItem[] {
  const cmsItems: PublicNavigationItem[] = cmsPages.map((page) => ({
    title: page.navigationLabel,
    href: `/${page.slug}`,
  }))

  return [...primaryPublicNavigationItems, ...cmsItems, ...contentPublicNavigationItems]
}

export { createPublicNavigationItems, isPublicNavigationItemActive }

export type { CmsNavigationItem, PublicNavigationItem }
