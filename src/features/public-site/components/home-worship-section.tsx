import Image from "next/image"
import Link from "next/link"
import { FiArrowRight, FiClock, FiExternalLink, FiMapPin } from "react-icons/fi"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import {
  getWorshipLanguageLabel,
  resolveWorshipLanguage,
} from "@/features/worship-schedules/lib/worship-language"
import { WorshipLanguage } from "@/generated/prisma/enums"
import { getGoogleDriveMediaUrl } from "@/lib/google-drive"

type HomeWorshipSectionProps = {
  schedule: {
    id: string
    date: Date

    services: {
      id: string
      name: string
      startsAt: Date
      languageOverride: WorshipLanguage | null
      sortOrder: number

      churchLocation: {
        id: string
        name: string
        slug: string
        type: "CHURCH" | "PEPANTHAN"
        googleMapsUrl: string | null
        coverImageUrl: string | null
        coverAltText: string | null
      }
    }[]
  } | null
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
})

function formatDateParam(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-")
}

function HomeWorshipSection({ schedule }: HomeWorshipSectionProps) {
  const featuredService =
    schedule?.services.find((service) => service.churchLocation.type === "CHURCH") ??
    schedule?.services[0] ??
    null

  const otherServices =
    schedule && featuredService
      ? schedule.services.filter((service) => service.id !== featuredService.id)
      : []

  const scheduleDetailUrl = schedule
    ? `/jadwal-ibadah/${formatDateParam(schedule.date)}`
    : "/jadwal-ibadah"

  const featuredCoverUrl = featuredService?.churchLocation.coverImageUrl
    ? getGoogleDriveMediaUrl(featuredService.churchLocation.coverImageUrl)
    : null

  return (
    <Section className="overflow-hidden bg-primary text-primary-foreground">
      <Container>
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary-foreground/65 uppercase">
              Beribadah Bersama
            </p>

            <h2 className="mt-4 max-w-2xl font-heading text-4xl leading-tight font-medium tracking-tight md:text-5xl">
              Jadwal Ibadah Terdekat
            </h2>

            <p className="mt-5 text-sm leading-7 text-primary-foreground/70 md:text-base">
              {schedule
                ? dateFormatter.format(schedule.date)
                : "Jadwal ibadah berikutnya akan diperbarui melalui website."}
            </p>
          </div>

          <Link
            href="/jadwal-ibadah"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground"
          >
            Semua Jadwal
            <FiArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>

        {schedule && featuredService ? (
          <div>
            <article className="overflow-hidden border-y border-primary-foreground/20 lg:grid lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)]">
              <div className="relative h-56 sm:h-72 lg:h-full lg:min-h-80">
                {featuredCoverUrl ? (
                  <Image
                    src={featuredCoverUrl}
                    alt={
                      featuredService.churchLocation.coverAltText ??
                      `Foto utama ${featuredService.churchLocation.name}`
                    }
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary-foreground/8">
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-linear-to-br from-primary-foreground/15 via-transparent to-transparent"
                    />

                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="text-center">
                        <FiMapPin
                          aria-hidden="true"
                          className="mx-auto size-8 text-primary-foreground/40"
                        />

                        <p className="mt-4 font-heading text-2xl font-medium text-primary-foreground/65">
                          {featuredService.churchLocation.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {featuredCoverUrl ? (
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/5"
                  />
                ) : null}
              </div>

              <div className="flex items-center px-0 py-8 lg:px-12 lg:py-10">
                <div className="w-full">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <p className="text-xs font-semibold tracking-[0.16em] text-primary-foreground/70 uppercase">
                      {featuredService.churchLocation.type === "PEPANTHAN" ? "Pepanthan" : "Gereja"}
                    </p>

                    <span
                      aria-hidden="true"
                      className="hidden h-px w-8 bg-primary-foreground/30 sm:block"
                    />

                    <p className="flex items-center gap-2 text-sm text-primary-foreground/70">
                      <FiClock aria-hidden="true" className="size-4" />

                      <span>
                        {timeFormatter.format(featuredService.startsAt).replace(".", ":")} WIB
                      </span>
                    </p>

                    <span
                      aria-hidden="true"
                      className="hidden h-px w-8 bg-primary-foreground/30 sm:block"
                    />

                    <p className="text-xs font-semibold tracking-[0.12em] text-primary-foreground/70 uppercase">
                      {getWorshipLanguageLabel(
                        resolveWorshipLanguage(schedule.date, featuredService.languageOverride)
                      )}
                    </p>
                  </div>

                  <h3 className="mt-5 font-heading text-3xl leading-tight font-medium tracking-tight md:text-4xl">
                    {featuredService.name}
                  </h3>

                  <p className="mt-5 flex items-start gap-3 text-sm leading-7 text-primary-foreground/70 md:text-base">
                    <FiMapPin aria-hidden="true" className="mt-1 size-4 shrink-0" />

                    {featuredService.churchLocation.name}
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <Link
                      href={`/lokasi/${featuredService.churchLocation.slug}`}
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground"
                    >
                      Lihat Lokasi
                      <FiArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </Link>

                    {featuredService.churchLocation.googleMapsUrl ? (
                      <a
                        href={featuredService.churchLocation.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/65 hover:text-primary-foreground hover:underline"
                      >
                        Google Maps
                        <FiExternalLink aria-hidden="true" className="size-3.5" />
                      </a>
                    ) : null}

                    <Link
                      href={`${scheduleDetailUrl}#${featuredService.id}`}
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground"
                    >
                      Detail Ibadah
                      <FiArrowRight
                        aria-hidden="true"
                        className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {otherServices.length > 0 ? (
              <div className="pt-9">
                <div className="mb-5 flex items-center gap-4">
                  <p className="shrink-0 text-xs font-semibold tracking-[0.18em] text-primary-foreground/70 uppercase">
                    Ibadah Lainnya
                  </p>

                  <div aria-hidden="true" className="h-px flex-1 bg-primary-foreground/20" />
                </div>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {otherServices.map((service) => {
                    const language = getWorshipLanguageLabel(
                      resolveWorshipLanguage(schedule.date, service.languageOverride)
                    )

                    return (
                      <article
                        key={service.id}
                        className="flex min-h-60 flex-col border border-primary-foreground/15 bg-primary-foreground/5 p-5 transition-colors hover:bg-primary-foreground/8"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-[0.68rem] font-semibold tracking-[0.16em] text-primary-foreground/70 uppercase">
                            {service.churchLocation.type === "PEPANTHAN" ? "Pepanthan" : "Gereja"}
                          </p>

                          <p className="flex items-center gap-2 text-sm font-medium text-primary-foreground/75">
                            <FiClock aria-hidden="true" className="size-3.5" />
                            {timeFormatter.format(service.startsAt).replace(".", ":")} WIB
                          </p>
                        </div>

                        <h3 className="mt-5 font-heading text-2xl leading-snug font-medium tracking-tight">
                          {service.name}
                        </h3>

                        <p className="mt-2 text-xs font-semibold tracking-widest text-primary-foreground/70 uppercase">
                          {language}
                        </p>

                        <div className="mt-5 flex items-start gap-2.5 text-sm leading-6 text-primary-foreground/70">
                          <FiMapPin aria-hidden="true" className="mt-1 size-3.5 shrink-0" />

                          <span>{service.churchLocation.name}</span>
                        </div>

                        <div className="mt-auto pt-6">
                          <Link
                            href={`${scheduleDetailUrl}#${service.id}`}
                            className="group inline-flex w-full items-center justify-between border-t border-primary-foreground/15 pt-4 text-sm font-semibold text-primary-foreground"
                          >
                            Detail Ibadah
                            <FiArrowRight
                              aria-hidden="true"
                              className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                            />
                          </Link>

                          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                            <Link
                              href={`/lokasi/${service.churchLocation.slug}`}
                              className="group/location inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                            >
                              Lihat Lokasi
                              <FiArrowRight
                                aria-hidden="true"
                                className="size-3.5 transition-transform group-hover/location:translate-x-1 motion-reduce:transition-none"
                              />
                            </Link>

                            {service.churchLocation.googleMapsUrl ? (
                              <a
                                href={service.churchLocation.googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Buka ${service.churchLocation.name} di Google Maps`}
                                className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                              >
                                Maps
                                <FiExternalLink aria-hidden="true" className="size-3" />
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>

                <div className="mt-7 flex justify-end border-t border-primary-foreground/20 pt-6">
                  <Link
                    href={scheduleDetailUrl}
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground"
                  >
                    Detail Semua Ibadah & Petugas
                    <FiArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    />
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="border-t border-primary-foreground/20 py-10 text-sm leading-7 text-primary-foreground/70">
            Belum ada jadwal ibadah Published yang akan datang.
          </div>
        )}
      </Container>
    </Section>
  )
}

export { HomeWorshipSection }
