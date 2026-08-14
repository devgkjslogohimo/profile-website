"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa"

import {
  getPublicNavigationItemsBySection,
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

  socialLinks: {
    facebookUrl: string | null
    instagramUrl: string | null
    youtubeUrl: string | null
  }
}

function PublicMobileNavigation({
  siteName,
  navigationItems,
  socialLinks,
}: PublicMobileNavigationProps) {
  const pathname = usePathname()

  const [open, setOpen] = useState(false)

  const mainItems = [
    ...getPublicNavigationItemsBySection(navigationItems, "home"),
    ...getPublicNavigationItemsBySection(navigationItems, "worship"),
  ]

  const sections = [
    {
      label: "Utama",
      items: mainItems,
    },
    {
      label: "Profil",
      items: getPublicNavigationItemsBySection(navigationItems, "profile"),
    },
    {
      label: "Informasi",
      items: getPublicNavigationItemsBySection(navigationItems, "information"),
    },
    {
      label: "Media",
      items: getPublicNavigationItemsBySection(navigationItems, "media"),
    },
  ].filter((section) => section.items.length > 0)

  const hasSocialLinks =
    Boolean(socialLinks.facebookUrl) ||
    Boolean(socialLinks.instagramUrl) ||
    Boolean(socialLinks.youtubeUrl)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label="Buka menu navigasi"
          />
        }
      >
        <Menu aria-hidden="true" className="size-5" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="data-[side=right]:w-[92vw] data-[side=right]:sm:max-w-[23.5rem]"
      >
        <SheetHeader className="border-b border-border/60 px-5 pt-5 pr-14 pb-5">
          <div className="flex items-center gap-3.5">
            <div
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary font-heading text-sm font-semibold tracking-wide text-primary-foreground"
            >
              GKJ
            </div>

            <div className="min-w-0">
              <SheetTitle className="truncate text-base font-semibold">{siteName}</SheetTitle>

              <SheetDescription className="mt-0.5 text-xs">Navigasi Gereja</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <nav aria-label="Navigasi mobile" className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 pb-6">
          <div className="space-y-7">
            {sections.map((section) => (
              <section key={section.label} aria-labelledby={`mobile-nav-${section.label}`}>
                <div className="mb-2 flex items-center gap-3 px-3">
                  <p
                    id={`mobile-nav-${section.label}`}
                    className="shrink-0 text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase"
                  >
                    {section.label}
                  </p>

                  <div aria-hidden="true" className="h-px flex-1 bg-border/60" />
                </div>

                <div className="flex flex-col">
                  {section.items.map((item) => {
                    const active = isPublicNavigationItemActive(pathname, item.href)

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={[
                          "group relative flex min-h-12 items-center rounded-lg py-3 pr-3 pl-4",
                          "text-[0.95rem] font-medium transition-colors",
                          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
                          active
                            ? "bg-primary/5 text-primary"
                            : "text-foreground/85 hover:bg-muted/60 hover:text-foreground",
                        ].join(" ")}
                      >
                        {active ? (
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary"
                          />
                        ) : null}

                        <span>{item.title}</span>
                      </Link>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </nav>

        {hasSocialLinks ? (
          <div className="shrink-0 border-t border-border/60 px-5 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Ikuti Kami
                </p>

                <p className="mt-1 text-xs text-muted-foreground">Media sosial GKJ Slogohimo</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {socialLinks.facebookUrl ? (
                  <a
                    href={socialLinks.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook GKJ Slogohimo"
                    onClick={() => setOpen(false)}
                    className="flex size-10 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <FaFacebookF aria-hidden="true" className="size-4" />
                  </a>
                ) : null}

                {socialLinks.instagramUrl ? (
                  <a
                    href={socialLinks.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram GKJ Slogohimo"
                    onClick={() => setOpen(false)}
                    className="flex size-10 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <FaInstagram aria-hidden="true" className="size-4" />
                  </a>
                ) : null}

                {socialLinks.youtubeUrl ? (
                  <a
                    href={socialLinks.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube GKJ Slogohimo"
                    onClick={() => setOpen(false)}
                    className="flex size-10 items-center justify-center rounded-xl border border-border/70 text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <FaYoutube aria-hidden="true" className="size-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export { PublicMobileNavigation }
