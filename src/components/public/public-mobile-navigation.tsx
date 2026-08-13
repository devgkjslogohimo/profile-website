"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import {
  isPublicNavigationItemActive,
  type PublicNavigationItem,
} from "@/components/public/public-navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type PublicMobileNavigationProps = {
  siteName: string
  navigationItems: PublicNavigationItem[]
}

function PublicMobileNavigation({ siteName, navigationItems }: PublicMobileNavigationProps) {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="xl:hidden"
            aria-label="Buka menu navigasi"
          />
        }
      >
        <Menu aria-hidden="true" className="size-5" />
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>{siteName}</SheetTitle>

          <SheetDescription>Navigasi website GKJ Slogohimo.</SheetDescription>
        </SheetHeader>

        <nav aria-label="Navigasi mobile" className="flex flex-col gap-1 overflow-y-auto px-4 pb-6">
          {navigationItems.map((item) => {
            const active = isPublicNavigationItemActive(pathname, item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={[
                  "rounded-lg px-3 py-3 text-base font-medium transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
                  active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                ].join(" ")}
              >
                {item.title}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export { PublicMobileNavigation }
