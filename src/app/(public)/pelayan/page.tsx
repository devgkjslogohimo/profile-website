import Link from "next/link"
import { FiArrowRight, FiUsers } from "react-icons/fi"

import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { ProfilePortraitImage } from "@/features/public-site/components/profile-portrait-image"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublicChurchServants } from "@/features/public-site/queries/get-public-church-servants"

const metadata = createPublicPageMetadata({
  title: "Pelayan Gereja",
  description: "Profil Pendeta dan Majelis yang melayani di GKJ Slogohimo.",
  pathname: "/pelayan",
})

const periodFormatter = new Intl.DateTimeFormat("id-ID", {
  year: "numeric",
  timeZone: "UTC",
})

function formatPeriod(start: Date, end: Date | null) {
  return `${periodFormatter.format(start)} — ${end ? periodFormatter.format(end) : "Sekarang"}`
}

async function PublicChurchServantsPage() {
  const { pastor, councilGroups } = await getPublicChurchServants()

  const councilMemberCount = councilGroups.reduce((total, group) => total + group.members.length, 0)

  return (
    <main>
      <Section>
        <Container>
          <header className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Pelayan Gereja
            </p>

            <h1 className="mt-4 font-heading text-4xl leading-tight font-medium tracking-tight md:text-5xl">
              Pendeta & Majelis
            </h1>

            <p className="mt-5 text-sm leading-7 text-muted-foreground md:text-base">
              Mengenal Pendeta dan Majelis yang melayani jemaat GKJ Slogohimo.
            </p>
          </header>

          {pastor ? (
            <section className="mt-14 border-t pt-10">
              <div className="grid gap-8 md:grid-cols-[minmax(220px,300px)_minmax(0,1fr)] md:items-center md:gap-10 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)] lg:gap-14">
                <div className="w-full max-w-sm">
                  <ProfilePortraitImage
                    url={pastor.photoUrl}
                    alt={`Foto ${pastor.fullName}`}
                    eager
                    sizes="(max-width: 1024px) 100vw, 380px"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                    Pendeta GKJ Slogohimo
                  </p>

                  <h2 className="mt-4 font-heading text-3xl leading-tight font-medium tracking-tight lg:text-4xl">
                    {pastor.fullName}
                  </h2>

                  <p className="mt-3 text-sm text-muted-foreground">
                    Periode Pelayanan {formatPeriod(pastor.periodStart, pastor.periodEnd)}
                  </p>

                  {pastor.summary ? (
                    <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
                      {pastor.summary}
                    </p>
                  ) : null}

                  <Link
                    href={`/pelayan/pendeta/${pastor.slug}`}
                    className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    Lihat Profil Pendeta
                    <FiArrowRight
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    />
                  </Link>
                </div>
              </div>
            </section>
          ) : null}

          <section className="mt-16 border-t pt-10 md:mt-20 md:pt-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  Majelis
                </p>

                <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight md:text-4xl">
                  Majelis GKJ Slogohimo
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Majelis yang sedang menjalankan pelayanan pada periode saat ini, dikelompokkan
                  berdasarkan lokasi pelayanan.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
                <FiUsers aria-hidden="true" className="size-4" />
                {councilMemberCount} anggota
              </div>
            </div>

            {councilGroups.length > 0 ? (
              <div className="mt-12 space-y-16 md:space-y-20">
                {councilGroups.map((group) => {
                  const locationType = group.location.type === "PEPANTHAN" ? "Pepanthan" : "Gereja"

                  return (
                    <section key={group.location.id} className="border-t pt-7 md:pt-8">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                            {locationType}
                          </p>

                          <h3 className="mt-2 font-heading text-2xl leading-tight font-medium tracking-tight md:text-3xl">
                            {group.location.name}
                          </h3>

                          <p className="mt-2 text-sm text-muted-foreground">
                            {group.members.length} anggota Majelis
                          </p>
                        </div>

                        <Link
                          href={`/lokasi/${group.location.slug}`}
                          className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-primary"
                        >
                          Lihat Lokasi
                          <FiArrowRight
                            aria-hidden="true"
                            className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                          />
                        </Link>
                      </div>

                      <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-7">
                        {group.members.map((member) => (
                          <article key={member.id} className="min-w-0">
                            <ProfilePortraitImage
                              url={member.photoUrl}
                              alt={`Foto ${member.fullName}`}
                            />

                            <div className="mt-4">
                              <p className="text-[11px] leading-5 font-semibold tracking-[0.12em] text-primary uppercase sm:text-xs">
                                {member.position}
                              </p>

                              <h4 className="mt-1.5 font-heading text-lg leading-snug font-medium sm:text-xl">
                                {member.fullName}
                              </h4>

                              <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                                {formatPeriod(member.periodStart, member.periodEnd)}
                              </p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  )
                })}
              </div>
            ) : (
              <div className="mt-10 border-t py-10">
                <p className="text-sm text-muted-foreground">
                  Data Majelis yang sedang melayani belum tersedia.
                </p>
              </div>
            )}
          </section>
        </Container>
      </Section>
    </main>
  )
}

export { metadata }
export default PublicChurchServantsPage
