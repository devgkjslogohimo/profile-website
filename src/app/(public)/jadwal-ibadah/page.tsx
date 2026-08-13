import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi"

import { PublicEmptyState } from "@/components/public/public-empty-state"
import { PublicPageHeader } from "@/components/public/public-page-header"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { Card, CardContent } from "@/components/ui/card"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublishedWorshipSchedules } from "@/features/public-site/queries/get-public-content"

async function generateMetadata() {
  return createPublicPageMetadata({
    title: "Jadwal Ibadah",
    description: "Jadwal ibadah GKJ Slogohimo dan pepanthan.",
    pathname: "/jadwal-ibadah",
  })
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

async function PublicWorshipSchedulePage() {
  const schedules = await getPublishedWorshipSchedules()

  return (
    <main>
      <Section>
        <Container>
          <PublicPageHeader
            eyebrow="Beribadah Bersama"
            title="Jadwal Ibadah"
            description="Informasi waktu dan lokasi ibadah GKJ Slogohimo yang akan datang."
          />

          {schedules.length === 0 ? (
            <PublicEmptyState
              icon={FiCalendar}
              title="Belum ada jadwal ibadah"
              description="Informasi jadwal ibadah berikutnya akan diperbarui melalui website."
            />
          ) : (
            <div className="mt-10 space-y-10">
              {schedules.map((schedule) => (
                <section key={schedule.id}>
                  <h2 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
                    {dateFormatter.format(schedule.date)}
                  </h2>

                  <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {schedule.services.map((service) => (
                      <Card key={service.id}>
                        <CardContent className="p-6">
                          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                            {service.churchLocation.type === "PEPANTHAN" ? "Pepanthan" : "Gereja"}
                          </p>

                          <h3 className="mt-3 font-heading text-xl font-medium">{service.name}</h3>

                          <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                              <FiClock className="size-4 shrink-0 text-primary" />
                              {timeFormatter.format(service.startsAt).replace(".", ":")} WIB
                            </p>

                            <p className="flex items-start gap-2">
                              <FiMapPin className="mt-0.5 size-4 shrink-0 text-primary" />

                              {service.churchLocation.name}
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
                </section>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicWorshipSchedulePage
