import Link from "next/link"
import type { IconType } from "react-icons"
import { FiBell, FiCalendar, FiFileText, FiImage } from "react-icons/fi"

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
    description: "Lihat waktu dan lokasi ibadah yang akan datang.",
    href: "/jadwal-ibadah",
    icon: FiCalendar,
  },
  {
    title: "Pawartos",
    description: "Baca Pawartos dan informasi jemaat terbaru.",
    href: "/pawartos",
    icon: FiFileText,
  },
  {
    title: "Pengumuman",
    description: "Informasi resmi terbaru dari GKJ Slogohimo.",
    href: "/pengumuman",
    icon: FiBell,
  },
  {
    title: "Galeri",
    description: "Dokumentasi kegiatan dan pelayanan gereja.",
    href: "/galeri",
    icon: FiImage,
  },
]

function HomeQuickLinks() {
  return (
    <section className="relative z-10 -mt-6">
      <Container>
        <div className="grid overflow-hidden rounded-2xl border bg-background shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group border-b p-6 transition-[background-color,box-shadow] hover:bg-muted/40 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-inset sm:border-r sm:nth-[2n]:border-r-0 lg:border-r lg:border-b-0 lg:last:border-r-0 lg:nth-[2n]:border-r"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon aria-hidden="true" className="size-5" />
                </div>

                <h2 className="mt-4 font-heading text-lg font-medium transition-colors group-hover:text-primary">
                  {item.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

export { HomeQuickLinks }
