"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { FiArrowRight } from "react-icons/fi"

import { GoogleDriveImage } from "@/components/media/google-drive-image"

type GalleryBrowserImage = {
  id: string
  imageUrl: string
  altText: string | null
  caption: string | null
}

type GalleryBrowserAlbum = {
  id: string
  title: string
  slug: string
  description: string | null
  eventDate: string | null
  coverImageUrl: string | null
  images: GalleryBrowserImage[]
}

type GalleryBrowserProps = {
  albums: GalleryBrowserAlbum[]
  initialYear: number | null
}

const INITIAL_ARCHIVE_LIMIT = 8
const ARCHIVE_LOAD_STEP = 8

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function getAlbumYear(eventDate: string | null) {
  if (!eventDate) {
    return null
  }

  const date = new Date(eventDate)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.getUTCFullYear()
}

function formatAlbumDate(eventDate: string | null) {
  if (!eventDate) {
    return null
  }

  const date = new Date(eventDate)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return dateFormatter.format(date)
}

function getAlbumImage(album: GalleryBrowserAlbum) {
  const firstImage = album.images[0]

  return {
    url: album.coverImageUrl ?? firstImage?.imageUrl ?? null,

    alt: firstImage?.altText ?? firstImage?.caption ?? album.title,
  }
}

function GalleryBrowser({ albums, initialYear }: GalleryBrowserProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear)

  const [archiveLimit, setArchiveLimit] = useState(INITIAL_ARCHIVE_LIMIT)

  const availableYears = useMemo(() => {
    return Array.from(
      new Set(
        albums
          .map((album) => getAlbumYear(album.eventDate))
          .filter((year): year is number => year !== null)
      )
    ).sort((a, b) => b - a)
  }, [albums])

  const filteredAlbums = useMemo(() => {
    if (selectedYear === null) {
      return albums
    }

    return albums.filter((album) => getAlbumYear(album.eventDate) === selectedYear)
  }, [albums, selectedYear])

  const featuredAlbum = filteredAlbums[0] ?? null

  const selectedAlbums = filteredAlbums.slice(1, 4)

  const archiveAlbums = filteredAlbums.slice(4)

  const visibleArchiveAlbums = archiveAlbums.slice(0, archiveLimit)

  const hasMoreArchiveAlbums = visibleArchiveAlbums.length < archiveAlbums.length

  function changeYear(year: number | null) {
    if (year === selectedYear) {
      return
    }

    /*
     * Penting:
     * State diubah langsung di client.
     *
     * Tidak ada:
     * - router.push()
     * - router.replace()
     * - useTransition()
     * - useOptimistic()
     * - loading/fade container
     *
     * Jadi halaman Server Component tidak
     * dinavigasi ulang saat tab diganti.
     */
    setSelectedYear(year)
    setArchiveLimit(INITIAL_ARCHIVE_LIMIT)

    /*
     * URL tetap kita sinkronkan agar filter
     * dapat terlihat/copy, tetapi menggunakan
     * native History API sehingga tidak
     * menyebabkan navigasi halaman.
     */
    const url = new URL(window.location.href)

    if (year === null) {
      url.searchParams.delete("year")
    } else {
      url.searchParams.set("year", String(year))
    }

    /*
     * Hapus parameter lama dari implementasi
     * sebelumnya apabila masih ada.
     */
    url.searchParams.delete("show")

    const search = url.searchParams.toString()

    const nextUrl = search ? `${url.pathname}?${search}` : url.pathname

    window.history.replaceState(null, "", nextUrl)
  }

  function showMoreArchive() {
    setArchiveLimit((current) => current + ARCHIVE_LOAD_STEP)
  }

  return (
    <div className="mt-8">
      {/* ======================================
          FILTER TAHUN
      ====================================== */}

      {availableYears.length > 0 ? (
        <nav
          aria-label="Filter galeri berdasarkan tahun"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            onClick={() => changeYear(null)}
            aria-pressed={selectedYear === null}
            className={[
              "inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-sm font-medium",
              "transition-colors duration-300 ease-out",
              selectedYear === null
                ? "bg-primary text-primary-foreground"
                : "border border-border/80 bg-background text-muted-foreground hover:border-primary/30 hover:bg-muted/50 hover:text-foreground",
            ].join(" ")}
          >
            Semua
          </button>

          {availableYears.map((year) => {
            const active = selectedYear === year

            return (
              <button
                key={year}
                type="button"
                onClick={() => changeYear(year)}
                aria-pressed={active}
                className={[
                  "inline-flex h-10 cursor-pointer items-center rounded-full px-4 text-sm font-medium",
                  "transition-colors duration-300 ease-out",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "border border-border/80 bg-background text-muted-foreground hover:border-primary/30 hover:bg-muted/50 hover:text-foreground",
                ].join(" ")}
              >
                {year}
              </button>
            )
          })}
        </nav>
      ) : null}

      {/* ======================================
          CONTENT
          
          Sengaja TIDAK diberi:
          opacity transition
          transform
          translate
          blur
          animation wrapper
          
          supaya pergantian tahun tidak blink.
      ====================================== */}

      <div id="gallery-content">
        {/* ====================================
            FEATURED
        ==================================== */}

        {featuredAlbum ? (
          <section className="mt-10" aria-labelledby="featured-gallery-title">
            <div className="mb-4">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                {selectedYear ? `Sorotan ${selectedYear}` : "Sorotan Galeri"}
              </p>

              <h2
                id="featured-gallery-title"
                className="mt-1 font-heading text-2xl font-semibold tracking-tight"
              >
                Dokumentasi pilihan
              </h2>
            </div>

            {(() => {
              const image = getAlbumImage(featuredAlbum)

              const eventDate = formatAlbumDate(featuredAlbum.eventDate)

              return (
                <Link
                  href={`/galeri/${featuredAlbum.slug}`}
                  className="group relative block min-h-[24rem] overflow-hidden rounded-[2rem] bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:min-h-[30rem] lg:min-h-[34rem]"
                >
                  <GoogleDriveImage
                    url={image.url}
                    alt={image.alt}
                    className="absolute inset-0 h-full w-full rounded-none border-0 [&_img]:aspect-auto [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out group-hover:[&_img]:scale-[1.018] motion-reduce:[&_img]:transform-none motion-reduce:[&_img]:transition-none"
                    eager
                    fetchPriority="high"
                    sourceWidth={1600}
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/5"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
                    {eventDate ? <p className="text-sm text-white/75">{eventDate}</p> : null}

                    <h3 className="mt-2 max-w-3xl font-heading text-3xl leading-tight font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                      {featuredAlbum.title}
                    </h3>

                    {featuredAlbum.description ? (
                      <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
                        {featuredAlbum.description}
                      </p>
                    ) : null}

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                      Lihat album
                      <FiArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </span>
                  </div>
                </Link>
              )
            })()}
          </section>
        ) : null}

        {/* ====================================
            3 DOKUMENTASI PILIHAN
        ==================================== */}

        {selectedAlbums.length > 0 ? (
          <section className="mt-14" aria-labelledby="selected-gallery-title">
            <div className="mb-5">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Dokumentasi lainnya
              </p>

              <h2
                id="selected-gallery-title"
                className="mt-1 font-heading text-2xl font-semibold tracking-tight"
              >
                Pilihan lainnya
              </h2>
            </div>

            <div className="grid gap-4 lg:auto-rows-[12rem] lg:grid-cols-12">
              {selectedAlbums.map((album, index) => {
                const image = getAlbumImage(album)

                const eventDate = formatAlbumDate(album.eventDate)

                /*
                 * 3 album:
                 *
                 * kiri  : 1 album tinggi
                 * kanan : 2 album bertumpuk
                 */
                const layoutClass = index === 0 ? "lg:col-span-5 lg:row-span-2" : "lg:col-span-7"

                return (
                  <Link
                    key={album.id}
                    href={`/galeri/${album.slug}`}
                    className={`group relative min-h-[19rem] overflow-hidden rounded-2xl bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:min-h-[22rem] lg:min-h-0 ${layoutClass}`}
                  >
                    <GoogleDriveImage
                      url={image.url}
                      alt={image.alt}
                      className="absolute inset-0 h-full w-full rounded-none border-0 [&_img]:aspect-auto [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out group-hover:[&_img]:scale-[1.025] motion-reduce:[&_img]:transform-none motion-reduce:[&_img]:transition-none"
                      eager
                      sourceWidth={1200}
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
                    />

                    <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
                      {eventDate ? <p className="text-xs text-white/70">{eventDate}</p> : null}

                      <h3 className="mt-1.5 max-w-xl font-heading text-xl leading-snug font-semibold tracking-tight sm:text-2xl">
                        {album.title}
                      </h3>

                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 opacity-100 motion-reduce:transition-none sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100">
                        Buka album
                        <FiArrowRight
                          aria-hidden="true"
                          className="size-3.5 transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
                        />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ) : null}

        {/* ====================================
            ARSIP
        ==================================== */}

        {archiveAlbums.length > 0 ? (
          <section
            id="arsip-galeri"
            className="mt-16 scroll-mt-28"
            aria-labelledby="gallery-archive-title"
          >
            <div className="flex flex-col gap-2 border-b border-border/70 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                  Arsip Galeri
                </p>

                <h2
                  id="gallery-archive-title"
                  className="mt-1 font-heading text-2xl font-semibold tracking-tight"
                >
                  {selectedYear ? `Dokumentasi tahun ${selectedYear}` : "Dokumentasi terdahulu"}
                </h2>
              </div>

              <p className="text-sm text-muted-foreground">
                {visibleArchiveAlbums.length} dari {archiveAlbums.length} album
              </p>
            </div>

            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {visibleArchiveAlbums.map((album) => {
                const image = getAlbumImage(album)

                const eventDate = formatAlbumDate(album.eventDate)

                return (
                  <Link
                    key={album.id}
                    href={`/galeri/${album.slug}`}
                    className="group grid min-h-28 grid-cols-[7rem_minmax(0,1fr)] overflow-hidden rounded-2xl border border-border/70 bg-background transition-[border-color,background-color] duration-300 ease-out hover:border-primary/30 hover:bg-muted/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none sm:grid-cols-[9rem_minmax(0,1fr)]"
                  >
                    <GoogleDriveImage
                      url={image.url}
                      alt={image.alt}
                      className="h-full min-h-28 w-full rounded-none border-0 [&_img]:aspect-auto [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out group-hover:[&_img]:scale-[1.025] motion-reduce:[&_img]:transform-none motion-reduce:[&_img]:transition-none"
                      sourceWidth={750}
                    />

                    <div className="flex min-w-0 flex-col justify-center px-4 py-4 sm:px-5">
                      <p className="text-xs text-muted-foreground">{eventDate ?? "Dokumentasi"}</p>

                      <h3 className="mt-1.5 line-clamp-2 font-heading text-base leading-snug font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary sm:text-lg">
                        {album.title}
                      </h3>

                      <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                        Lihat album
                        <FiArrowRight
                          aria-hidden="true"
                          className="size-3.5 transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
                        />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>

            {hasMoreArchiveAlbums ? (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={showMoreArchive}
                  className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-border/80 bg-background px-6 text-sm font-semibold transition-colors duration-300 ease-out hover:border-primary/30 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Tampilkan lebih banyak
                  <FiArrowRight aria-hidden="true" className="size-4 rotate-90" />
                </button>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  )
}

export { GalleryBrowser, type GalleryBrowserAlbum }
