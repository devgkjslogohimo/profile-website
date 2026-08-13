"use client"

import Link from "next/link"
import { useState } from "react"
import { FiArrowLeft, FiArrowRight, FiBell, FiX } from "react-icons/fi"

import { Container } from "@/components/shared/container"

type PublicAnnouncement = {
  id: string
  title: string
  slug: string
}

type PublicAnnouncementBarProps = {
  announcements: PublicAnnouncement[]
}

function PublicAnnouncementBar({ announcements }: PublicAnnouncementBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  if (announcements.length === 0 || dismissed) {
    return null
  }

  const safeIndex = currentIndex % announcements.length
  const announcement = announcements[safeIndex]
  const hasMultiple = announcements.length > 1

  function showPrevious() {
    setCurrentIndex((current) => {
      return (current - 1 + announcements.length) % announcements.length
    })
  }

  function showNext() {
    setCurrentIndex((current) => {
      return (current + 1) % announcements.length
    })
  }

  return (
    <aside
      aria-label="Pengumuman"
      className="border-b border-primary-foreground/15 bg-primary text-primary-foreground"
    >
      <Container className="flex min-h-11 items-center gap-3 py-2.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex shrink-0 items-center gap-2">
            <FiBell aria-hidden="true" className="size-4" />

            <span className="text-xs font-semibold tracking-[0.14em] uppercase">Pengumuman</span>
          </div>

          <Link
            href={`/pengumuman/${announcement.slug}`}
            className="group flex min-w-0 items-center gap-2 text-sm font-medium"
          >
            <span className="line-clamp-2 sm:truncate">{announcement.title}</span>

            <FiArrowRight
              aria-hidden="true"
              className="hidden size-4 shrink-0 transition-transform group-hover:translate-x-1 motion-reduce:transform-none sm:block"
            />
          </Link>
        </div>

        {hasMultiple ? (
          <div className="flex shrink-0 items-center gap-1" aria-label="Navigasi pengumuman">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Pengumuman sebelumnya"
              className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"
            >
              <FiArrowLeft aria-hidden="true" className="size-4" />
            </button>

            <span
              className="min-w-10 text-center text-xs font-medium tabular-nums"
              aria-live="polite"
            >
              {safeIndex + 1} / {announcements.length}
            </span>

            <button
              type="button"
              onClick={showNext}
              aria-label="Pengumuman berikutnya"
              className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"
            >
              <FiArrowRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        ) : null}

        <Link
          href={`/pengumuman/${announcement.slug}`}
          className="hidden shrink-0 text-xs font-semibold underline-offset-4 hover:underline lg:inline"
        >
          Selengkapnya
        </Link>

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Tutup pengumuman"
          className="flex size-8 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/10 focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:outline-none"
        >
          <FiX aria-hidden="true" className="size-4" />
        </button>
      </Container>
    </aside>
  )
}

export { PublicAnnouncementBar }
