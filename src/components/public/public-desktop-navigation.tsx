"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  isPublicNavigationItemActive,
  type PublicNavigationItem,
} from "@/components/public/public-navigation"

type PublicDesktopNavigationProps = {
  navigationItems: PublicNavigationItem[]
}

function PublicDesktopNavigation({ navigationItems }: PublicDesktopNavigationProps) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navigasi utama"
      className="hidden max-w-[68vw] min-w-0 items-center gap-1 overflow-x-auto xl:flex"
    >
      {navigationItems.map((item) => {
        const active = isPublicNavigationItemActive(pathname, item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={[
              "shrink-0 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

export { PublicDesktopNavigation }
