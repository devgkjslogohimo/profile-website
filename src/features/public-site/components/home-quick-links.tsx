import Link from "next/link"
import type { IconType } from "react-icons"
import { FiArrowRight, FiBell, FiCalendar, FiFileText, FiImage } from "react-icons/fi"

import { Container } from "@/components/shared/container"

type QuickLink = {
  title: string
  description: string
  href: string
  icon: IconType
}

const quickLinks: QuickLink[] = [
  {
    title: "Jadwal Ibadah",
    description: "Waktu dan lokasi ibadah.",
    href: "/jadwal-ibadah",
    icon: FiCalendar,
  },
  {
    title: "Pawartos",
    description: "Warta jemaat terbaru.",
    href: "/pawartos",
    icon: FiFileText,
  },
  {
    title: "Pengumuman",
    description: "Informasi resmi gereja.",
    href: "/pengumuman",
    icon: FiBell,
  },
  {
    title: "Galeri",
    description: "Dokumentasi kegiatan.",
    href: "/galeri",
    icon: FiImage,
  },
]

function HomeQuickLinks() {
  return (
    <section className="bg-background py-8 md:py-10 lg:py-12">
      <Container>
        <nav
          aria-label="Akses cepat"
          className="grid gap-x-8 border-y sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0"
        >
          {quickLinks.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-6 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <Icon
                  aria-hidden="true"
                  className="size-5 text-primary transition-transform duration-200 group-hover:-translate-y-0.5 motion-reduce:transform-none"
                />

                <div>
                  <p className="font-heading text-base font-medium transition-colors group-hover:text-primary">
                    {item.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
                </div>

                <FiArrowRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-primary motion-reduce:transform-none"
                />
              </Link>
            )
          })}
        </nav>
      </Container>
    </section>
  )
}

export { HomeQuickLinks }
