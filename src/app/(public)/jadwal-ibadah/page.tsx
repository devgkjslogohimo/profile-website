import Link from "next/link"
import { FiArrowRight, FiCalendar, FiClock, FiExternalLink, FiMapPin } from "react-icons/fi"

import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { buttonVariants } from "@/components/ui/button"
import { getWibTodayDate } from "@/features/public-site/lib/public-date"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublishedWorshipSchedules } from "@/features/public-site/queries/get-public-content"
import {
  getWorshipLanguageLabel,
  resolveWorshipLanguage,
} from "@/features/worship-schedules/lib/worship-language"

type PublicWorshipSchedulePageProps = {
  searchParams: Promise<{
    bulan?: string | string[]
  }>
}

type MonthOption = {
  value: string
  label: string
}

async function generateMetadata() {
  return createPublicPageMetadata({
    title: "Jadwal Ibadah",
    description: "Jadwal ibadah GKJ Slogohimo dan pepanthan.",
    pathname: "/jadwal-ibadah",
  })
}

const weekdayFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  timeZone: "UTC",
})

const dayFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  timeZone: "UTC",
})

const monthYearFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

const fullDateFormatter = new Intl.DateTimeFormat("id-ID", {
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

function formatMonthParam(date: Date) {
  return [date.getUTCFullYear(), String(date.getUTCMonth() + 1).padStart(2, "0")].join("-")
}

function formatDateParam(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-")
}

function createMonthOptions(today: Date): MonthOption[] {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + index, 1))

    return {
      value: formatMonthParam(date),
      label: monthYearFormatter.format(date),
    }
  })
}

async function PublicWorshipSchedulePage({ searchParams }: PublicWorshipSchedulePageProps) {
  const params = await searchParams

  const rawMonth = typeof params.bulan === "string" ? params.bulan : null

  const today = getWibTodayDate()
  const monthOptions = createMonthOptions(today)

  const selectedMonth =
    rawMonth && monthOptions.some((option) => option.value === rawMonth) ? rawMonth : null

  const schedules = await getPublishedWorshipSchedules(selectedMonth)

  const selectedMonthLabel =
    monthOptions.find((option) => option.value === selectedMonth)?.label ?? null

  return (
    <main>
      <Section spacing="page">
        <Container>
          <PublicPageHeader
            eyebrow="Beribadah Bersama"
            title="Jadwal Ibadah"
            description="Informasi waktu, lokasi, dan petugas ibadah GKJ Slogohimo yang akan datang."
          />

          <div className="mt-10 rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-amber-700 uppercase">
                  Cari Jadwal
                </p>

                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  Default menampilkan 3 tanggal ibadah terdekat. Pilih bulan untuk melihat jadwal
                  lainnya.
                </p>
              </div>

              <form
                action="/jadwal-ibadah"
                method="get"
                className="flex flex-col gap-2 sm:flex-row sm:items-center"
              >
                <label htmlFor="worship-month" className="sr-only">
                  Pilih bulan jadwal ibadah
                </label>

                <select
                  id="worship-month"
                  name="bulan"
                  defaultValue={selectedMonth ?? ""}
                  className="h-10 min-w-56 rounded-lg border border-input bg-background px-3 text-sm text-foreground transition-shadow outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">3 jadwal terdekat</option>

                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                  })}
                >
                  Tampilkan
                </button>

                {selectedMonth ? (
                  <Link
                    href="/jadwal-ibadah"
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Reset
                  </Link>
                ) : null}
              </form>
            </div>
          </div>

          <div className="mt-10">
            <div className="mb-6 flex items-start gap-3">
              <FiCalendar aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-medium text-foreground">
                  {selectedMonthLabel ? `Jadwal ${selectedMonthLabel}` : "3 jadwal terdekat"}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {schedules.length} tanggal jadwal ibadah ditemukan.
                </p>
              </div>
            </div>

            {schedules.length === 0 ? (
              <PublicEmptyState
                icon={FiCalendar}
                title="Belum ada jadwal ibadah"
                description={
                  selectedMonthLabel
                    ? `Belum ada jadwal ibadah Published untuk ${selectedMonthLabel}.`
                    : "Informasi jadwal ibadah berikutnya akan diperbarui melalui website."
                }
              />
            ) : (
              <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-background">
                {schedules.map((schedule, scheduleIndex) => {
                  const scheduleDateParam = formatDateParam(schedule.date)

                  return (
                    <section
                      key={schedule.id}
                      aria-label={fullDateFormatter.format(schedule.date)}
                      className={scheduleIndex === 0 ? "" : "border-t border-border/70"}
                    >
                      <div className="grid lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[15rem_minmax(0,1fr)]">
                        <header className="border-b border-amber-950/20 bg-amber-950/90 px-6 py-6 lg:border-r lg:border-b-0 lg:px-7 lg:py-8">
                          <div className="flex items-end gap-4 lg:block">
                            <div>
                              <p className="text-xs font-semibold tracking-[0.16em] text-amber-200/90 uppercase">
                                {weekdayFormatter.format(schedule.date)}
                              </p>

                              <p
                                aria-hidden="true"
                                className="mt-1 font-heading text-5xl leading-none font-semibold tracking-tight text-white lg:mt-4 lg:text-6xl"
                              >
                                {dayFormatter.format(schedule.date)}
                              </p>
                            </div>

                            <div className="pb-1 lg:mt-3 lg:pb-0">
                              <p className="font-heading text-lg font-medium text-amber-50">
                                {monthYearFormatter.format(schedule.date)}
                              </p>

                              <p className="mt-1 text-sm text-amber-100/60">
                                {schedule.services.length} ibadah
                              </p>
                            </div>
                          </div>

                          <Link
                            href={`/jadwal-ibadah/${scheduleDateParam}`}
                            className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-amber-200 transition-colors hover:text-white"
                          >
                            Detail & Petugas
                            <FiArrowRight
                              aria-hidden="true"
                              className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                            />
                          </Link>
                        </header>

                        <div className="p-4 sm:p-6 lg:p-8">
                          <div className="grid gap-4 xl:grid-cols-2">
                            {schedule.services.map((service) => {
                              const language = getWorshipLanguageLabel(
                                resolveWorshipLanguage(schedule.date, service.languageOverride)
                              )

                              return (
                                <article
                                  key={service.id}
                                  className="group flex h-full flex-col rounded-2xl border border-border/70 bg-background p-5 transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-sm"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                                    <p
                                      className={[
                                        "rounded-full px-3 py-1 text-[0.7rem] font-semibold tracking-[0.14em] uppercase",
                                        service.churchLocation.type === "PEPANTHAN"
                                          ? "bg-amber-100 text-amber-800"
                                          : "bg-primary/10 text-primary",
                                      ].join(" ")}
                                    >
                                      {service.churchLocation.type === "PEPANTHAN"
                                        ? "Pepanthan"
                                        : "Gereja"}
                                    </p>

                                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                      <FiClock
                                        aria-hidden="true"
                                        className="size-4 shrink-0 text-primary"
                                      />

                                      <span>
                                        {timeFormatter.format(service.startsAt).replace(".", ":")}{" "}
                                        WIB
                                      </span>
                                    </p>
                                  </div>

                                  <h2 className="mt-5 font-heading text-xl leading-snug font-medium tracking-tight text-foreground sm:text-2xl">
                                    {service.name}
                                  </h2>

                                  <p className="mt-2 text-sm font-medium text-primary">
                                    {language}
                                  </p>

                                  <div className="mt-5 flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                                    <FiMapPin
                                      aria-hidden="true"
                                      className="mt-1 size-4 shrink-0 text-primary"
                                    />

                                    <p>{service.churchLocation.name}</p>
                                  </div>

                                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
                                    {service.churchLocation.isActive ? (
                                      <Link
                                        href={`/lokasi/${service.churchLocation.slug}`}
                                        className="group/location inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                                      >
                                        Detail Lokasi
                                        <FiArrowRight
                                          aria-hidden="true"
                                          className="size-3.5 transition-transform group-hover/location:translate-x-1 motion-reduce:transition-none"
                                        />
                                      </Link>
                                    ) : null}

                                    {service.churchLocation.googleMapsUrl ? (
                                      <a
                                        href={service.churchLocation.googleMapsUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={`Buka lokasi ${service.churchLocation.name} di Google Maps`}
                                        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                                      >
                                        Google Maps
                                        <FiExternalLink aria-hidden="true" className="size-3.5" />
                                      </a>
                                    ) : null}
                                  </div>
                                </article>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </section>
                  )
                })}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicWorshipSchedulePage
