import Image from "next/image"
import Link from "next/link"
import {
  FiArrowRight,
  FiChevronDown,
  FiClock,
  FiExternalLink,
  FiMapPin,
  FiUsers,
} from "react-icons/fi"

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

      assignments: {
        id: string
        personName: string
        sortOrder: number

        worshipServiceRole: {
          id: string
          name: string
        }
      }[]

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

function HomeWorshipSection({ schedule }: HomeWorshipSectionProps) {
  return (
    <Section className="overflow-hidden bg-primary text-primary-foreground">
      <Container>
        <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground hover:underline"
          >
            Semua Jadwal
            <FiArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        {schedule && schedule.services.length > 0 ? (
          <div className="border-t border-primary-foreground/20">
            {schedule.services.map((service, index) => {
              const coverUrl = service.churchLocation.coverImageUrl
                ? getGoogleDriveMediaUrl(service.churchLocation.coverImageUrl)
                : null

              const language = resolveWorshipLanguage(schedule.date, service.languageOverride)

              const imageOnRight = index % 2 === 1

              return (
                <article
                  key={service.id}
                  className={
                    imageOnRight
                      ? "grid border-b border-primary-foreground/20 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)]"
                      : "grid border-b border-primary-foreground/20 lg:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)]"
                  }
                >
                  <div
                    className={
                      imageOnRight
                        ? "relative h-52 self-start sm:h-60 lg:order-2 lg:h-72"
                        : "relative h-52 self-start sm:h-60 lg:h-72"
                    }
                  >
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={
                          service.churchLocation.coverAltText ??
                          `Foto utama ${service.churchLocation.name}`
                        }
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        loading="lazy"
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
                              {service.churchLocation.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {coverUrl ? (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/5"
                      />
                    ) : null}
                  </div>

                  <div
                    className={
                      imageOnRight
                        ? "flex items-start py-8 lg:order-1 lg:py-10 lg:pr-14"
                        : "flex items-start py-8 lg:py-10 lg:pl-14"
                    }
                  >
                    <div className="w-full">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                        <p className="text-xs font-semibold tracking-[0.16em] text-primary-foreground/60 uppercase">
                          {service.churchLocation.type === "PEPANTHAN" ? "Pepanthan" : "Gereja"}
                        </p>

                        <span
                          aria-hidden="true"
                          className="hidden h-px w-8 bg-primary-foreground/30 sm:block"
                        />

                        <p className="flex items-center gap-2 text-sm text-primary-foreground/70">
                          <FiClock aria-hidden="true" className="size-4" />

                          <span>
                            {timeFormatter.format(service.startsAt).replace(".", ":")} WIB
                          </span>
                        </p>

                        <span
                          aria-hidden="true"
                          className="hidden h-px w-8 bg-primary-foreground/30 sm:block"
                        />

                        <p className="text-xs font-semibold tracking-[0.12em] text-primary-foreground/70 uppercase">
                          {getWorshipLanguageLabel(language)}
                        </p>
                      </div>

                      <h3 className="mt-5 font-heading text-3xl leading-tight font-medium tracking-tight md:text-4xl">
                        {service.name}
                      </h3>

                      <p className="mt-5 flex items-start gap-3 text-sm leading-7 text-primary-foreground/70 md:text-base">
                        <FiMapPin aria-hidden="true" className="mt-1 size-4 shrink-0" />

                        {service.churchLocation.name}
                      </p>

                      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                        <Link
                          href={`/lokasi/${service.churchLocation.slug}`}
                          className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground"
                        >
                          Lihat Lokasi
                          <FiArrowRight
                            aria-hidden="true"
                            className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                          />
                        </Link>

                        {service.churchLocation.googleMapsUrl ? (
                          <a
                            href={service.churchLocation.googleMapsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/65 hover:text-primary-foreground hover:underline"
                          >
                            Google Maps
                            <FiExternalLink aria-hidden="true" className="size-3.5" />
                          </a>
                        ) : null}
                      </div>

                      {service.assignments.length > 0 ? (
                        <details className="group mt-8 border-t border-primary-foreground/20 pt-5">
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-primary-foreground outline-none select-none [&::-webkit-details-marker]:hidden">
                            <span className="flex items-center gap-2">
                              <FiUsers
                                aria-hidden="true"
                                className="size-4 text-primary-foreground/65"
                              />
                              Detail Ibadah
                            </span>

                            <FiChevronDown
                              aria-hidden="true"
                              className="size-4 text-primary-foreground/60 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                            />
                          </summary>

                          <div className="mt-5 border-t border-primary-foreground/15 pt-5">
                            <p className="text-xs font-semibold tracking-[0.14em] text-primary-foreground/50 uppercase">
                              Petugas Ibadah
                            </p>

                            <dl className="mt-4 divide-y divide-primary-foreground/10">
                              {service.assignments.map((assignment) => (
                                <div
                                  key={assignment.id}
                                  className="grid grid-cols-[minmax(100px,0.45fr)_minmax(0,1fr)] gap-4 py-3 first:pt-0"
                                >
                                  <dt className="text-sm text-primary-foreground/55">
                                    {assignment.worshipServiceRole.name}
                                  </dt>

                                  <dd className="text-sm leading-6 font-medium text-primary-foreground">
                                    {assignment.personName}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        </details>
                      ) : null}
                    </div>
                  </div>
                </article>
              )
            })}
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
