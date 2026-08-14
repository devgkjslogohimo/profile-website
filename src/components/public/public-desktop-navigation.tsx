"use client"

import { ArrowUpRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  getPublicNavigationItemsBySection,
  isPublicNavigationGroupActive,
  isPublicNavigationItemActive,
  type PublicNavigationItem,
} from "@/components/public/public-navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type PublicDesktopNavigationProps = {
  navigationItems: PublicNavigationItem[]
}

type DesktopNavigationLinkProps = {
  item: PublicNavigationItem
  pathname: string
}

function getNavigationDescription(item: PublicNavigationItem) {
  switch (item.href) {
    case "/lokasi":
      return "Gereja induk dan pepanthan"

    case "/pelayan":
      return "Pendeta dan majelis gereja"

    case "/pawartos":
      return "Warta jemaat dan informasi mingguan"

    case "/pengumuman":
      return "Informasi penting untuk jemaat"

    case "/berita":
      return "Kabar dan cerita terbaru"

    case "/agenda":
      return "Kegiatan dan acara mendatang"

    default:
      if (item.title.toLowerCase().includes("sejarah")) {
        return "Perjalanan dan sejarah GKJ Slogohimo"
      }

      return "Mengenal lebih dekat GKJ Slogohimo"
  }
}

function DesktopNavigationLink({ item, pathname }: DesktopNavigationLinkProps) {
  const active = isPublicNavigationItemActive(pathname, item.href)

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={[
        "relative shrink-0 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
        "after:absolute after:right-3 after:bottom-1 after:left-3 after:h-px after:origin-center after:scale-x-0 after:bg-primary after:transition-transform",
        active ? "text-primary after:scale-x-100" : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {item.title}
    </Link>
  )
}

type DesktopNavigationDropdownProps = {
  label: string
  eyebrow: string
  description: string
  items: PublicNavigationItem[]
  pathname: string
}

function DesktopNavigationDropdown({
  label,
  eyebrow,
  description,
  items,
  pathname,
}: DesktopNavigationDropdownProps) {
  if (items.length === 0) {
    return null
  }

  const active = isPublicNavigationGroupActive(pathname, items)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={[
              "group relative inline-flex shrink-0 items-center gap-1.5 px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
              "after:absolute after:right-3 after:bottom-1 after:left-3 after:h-px after:origin-center after:scale-x-0 after:bg-primary after:transition-transform",
              "data-popup-open:text-primary data-popup-open:after:scale-x-100",
              active
                ? "text-primary after:scale-x-100"
                : "text-muted-foreground hover:text-foreground",
            ].join(" ")}
          />
        }
      >
        {label}

        <ChevronDown
          aria-hidden="true"
          className="size-3.5 transition-transform duration-200 group-data-[popup-open]:rotate-180"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={12}
        className="w-[30rem] rounded-2xl border border-border/60 bg-background/95 p-2 shadow-xl ring-0 backdrop-blur-xl"
      >
        <div className="px-3 pt-3 pb-4">
          <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-primary uppercase">
            {eyebrow}
          </p>

          <p className="mt-1.5 max-w-sm text-sm leading-5 text-muted-foreground">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-1">
          {items.map((item) => {
            const itemActive = isPublicNavigationItemActive(pathname, item.href)

            return (
              <DropdownMenuItem
                key={item.href}
                render={<Link href={item.href} aria-current={itemActive ? "page" : undefined} />}
                className={[
                  "group/item min-h-24 cursor-pointer items-start rounded-xl border border-transparent p-4",
                  "transition-colors focus:bg-primary/5 focus:text-foreground",
                  itemActive ? "bg-primary/5 text-primary" : "hover:bg-muted/60",
                ].join(" ")}
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-heading text-base leading-tight font-semibold text-foreground">
                      {item.title}
                    </p>

                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                      {getNavigationDescription(item)}
                    </p>
                  </div>

                  <ArrowUpRight
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground/60 transition-all duration-200 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:text-primary"
                  />
                </div>
              </DropdownMenuItem>
            )
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PublicDesktopNavigation({ navigationItems }: PublicDesktopNavigationProps) {
  const pathname = usePathname()

  const homeItems = getPublicNavigationItemsBySection(navigationItems, "home")
  const profileItems = getPublicNavigationItemsBySection(navigationItems, "profile")
  const worshipItems = getPublicNavigationItemsBySection(navigationItems, "worship")
  const informationItems = getPublicNavigationItemsBySection(navigationItems, "information")
  const mediaItems = getPublicNavigationItemsBySection(navigationItems, "media")

  const homeItem = homeItems[0]
  const worshipItem = worshipItems[0]
  const mediaItem = mediaItems[0]

  return (
    <nav aria-label="Navigasi utama" className="hidden shrink-0 items-center gap-1 xl:flex">
      {homeItem ? <DesktopNavigationLink item={homeItem} pathname={pathname} /> : null}

      <DesktopNavigationDropdown
        label="Profil"
        eyebrow="Profil Gereja"
        description="Kenali perjalanan, lokasi, dan para pelayan GKJ Slogohimo."
        items={profileItems}
        pathname={pathname}
      />

      {worshipItem ? <DesktopNavigationLink item={worshipItem} pathname={pathname} /> : null}

      <DesktopNavigationDropdown
        label="Informasi"
        eyebrow="Informasi Jemaat"
        description="Temukan warta, pengumuman, berita, dan agenda terbaru."
        items={informationItems}
        pathname={pathname}
      />

      {mediaItem ? <DesktopNavigationLink item={mediaItem} pathname={pathname} /> : null}
    </nav>
  )
}

export { PublicDesktopNavigation }
