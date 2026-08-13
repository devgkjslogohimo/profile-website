import Link from "next/link"
import { FiClock, FiMapPin } from "react-icons/fi"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { SectionHeader } from "@/components/shared/section-header"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

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

  /*
   * WorshipSchedule.date adalah
   * PostgreSQL DATE.
   */
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
    <Section>
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Beribadah Bersama"
            title="Jadwal Ibadah Terdekat"
            description={
              schedule
                ? dateFormatter.format(schedule.date)
                : "Jadwal ibadah berikutnya akan diperbarui melalui website."
            }
          />

          <Link
            href="/jadwal-ibadah"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Semua Jadwal
          </Link>
        </div>

        {schedule && schedule.services.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {schedule.services.map((service) => (
              <Card
                key={service.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-background transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none"
              >
                <CardContent className="flex h-full flex-col p-6">
                  <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    {service.churchLocation.type === "PEPANTHAN" ? "Pepanthan" : "Gereja"}
                  </p>

                  <h3 className="mt-3 font-heading text-xl font-medium">{service.name}</h3>

                  <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <FiClock className="size-4 shrink-0 text-primary" />
                      {timeFormatter.format(service.startsAt).replace(".", ":")} WIB
                    </p>

                    <p className="mt-auto inline-flex pt-5 text-sm font-medium text-primary hover:underline">
                      <FiMapPin className="mt-0.5 size-4 shrink-0 text-primary" />

                      <span>{service.churchLocation.name}</span>
                    </p>
                  </div>

                  {service.churchLocation.googleMapsUrl ? (
                    <a
                      href={service.churchLocation.googleMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex text-sm font-medium text-primary hover:underline"
                    >
                      Buka Google Maps
                    </a>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
            Belum ada jadwal ibadah Published yang akan datang.
          </div>
        )}
      </Container>
    </Section>
  )
}

export { HomeWorshipSection }
