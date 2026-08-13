import Link from "next/link"
import { FiArrowRight, FiClock, FiMapPin } from "react-icons/fi"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"

type HomeWorshipSectionProps = {
  schedule: {
    id: string
    date: Date

    services: {
      id: string
      name: string
      startsAt: Date
      sortOrder: number

      churchLocation: {
        id: string
        name: string
        slug: string
        type: "CHURCH" | "PEPANTHAN"
        googleMapsUrl: string | null
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
    <Section className="bg-primary text-primary-foreground">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)] lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary-foreground/65 uppercase">
              Beribadah Bersama
            </p>

            <h2 className="mt-4 max-w-md font-heading text-4xl leading-tight font-medium tracking-tight md:text-5xl">
              Jadwal Ibadah Terdekat
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground/70 md:text-base">
              {schedule
                ? dateFormatter.format(schedule.date)
                : "Jadwal ibadah berikutnya akan diperbarui melalui website."}
            </p>

            <Link
              href="/jadwal-ibadah"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground hover:underline"
            >
              Semua Jadwal
              <FiArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          {schedule && schedule.services.length > 0 ? (
            <div className="border-t border-primary-foreground/20">
              {schedule.services.map((service) => (
                <div
                  key={service.id}
                  className="grid gap-5 border-b border-primary-foreground/20 py-7 sm:grid-cols-[8rem_1fr] md:grid-cols-[9rem_1fr_auto] md:items-start"
                >
                  <div>
                    <p className="flex items-center gap-2 text-primary-foreground/65">
                      <FiClock aria-hidden="true" className="size-4" />

                      <span className="font-heading text-2xl font-medium text-primary-foreground">
                        {timeFormatter.format(service.startsAt).replace(".", ":")}
                      </span>
                    </p>

                    <p className="mt-1 text-xs text-primary-foreground/55">WIB</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold tracking-[0.15em] text-primary-foreground/60 uppercase">
                      {service.churchLocation.type === "PEPANTHAN" ? "Pepanthan" : "Gereja"}
                    </p>

                    <h3 className="mt-2 font-heading text-2xl leading-snug font-medium">
                      {service.name}
                    </h3>

                    <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-primary-foreground/70">
                      <FiMapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                      {service.churchLocation.name}
                    </p>
                  </div>

                  {service.churchLocation.googleMapsUrl ? (
                    <a
                      href={service.churchLocation.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground hover:underline md:pt-7"
                    >
                      Google Maps
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="border-t border-primary-foreground/20 py-8 text-sm leading-7 text-primary-foreground/70">
              Belum ada jadwal ibadah Published yang akan datang.
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}

export { HomeWorshipSection }
