import { notFound } from "next/navigation"

import { PublicBackLink } from "@/components/public/public-back-link"
import { Container } from "@/components/shared/container"
import { Section } from "@/components/shared/section"
import { ProfilePortraitImage } from "@/features/public-site/components/profile-portrait-image"
import { createPublicPageMetadata } from "@/features/public-site/lib/public-metadata"
import { getPublicChurchPastorBySlug } from "@/features/public-site/queries/get-public-church-servants"

type PublicPastorProfilePageProps = {
  params: Promise<{
    slug: string
  }>
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

async function generateMetadata({ params }: PublicPastorProfilePageProps) {
  const { slug } = await params

  const pastor = await getPublicChurchPastorBySlug(slug)

  if (!pastor) {
    return {
      title: "Pendeta Tidak Ditemukan",
    }
  }

  return createPublicPageMetadata({
    title: pastor.fullName,
    description: pastor.summary ?? `Profil ${pastor.fullName}, Pendeta GKJ Slogohimo.`,
    pathname: `/pelayan/pendeta/${pastor.slug}`,
  })
}

async function PublicPastorProfilePage({ params }: PublicPastorProfilePageProps) {
  const { slug } = await params

  const pastor = await getPublicChurchPastorBySlug(slug)

  if (!pastor) {
    notFound()
  }

  return (
    <main>
      <Section>
        <Container>
          <PublicBackLink href="/pelayan" label="Kembali ke Pelayan Gereja" />

          <article className="mx-auto mt-8 max-w-6xl">
            <div className="grid gap-9 md:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] md:gap-10 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:gap-16">
              <div className="w-full max-w-95">
                <ProfilePortraitImage
                  url={pastor.photoUrl}
                  alt={`Foto ${pastor.fullName}`}
                  eager
                  sizes="(max-width: 767px) 100vw, 380px"
                />
              </div>

              <div className="min-w-0 md:pt-2">
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  Pendeta GKJ Slogohimo
                </p>

                <h1 className="mt-4 font-heading text-4xl leading-tight font-medium tracking-tight md:text-5xl">
                  {pastor.fullName}
                </h1>

                <p className="mt-4 text-sm text-muted-foreground">
                  {dateFormatter.format(pastor.periodStart)}
                  {" — "}
                  {pastor.periodEnd ? dateFormatter.format(pastor.periodEnd) : "Sekarang"}
                </p>

                {pastor.summary ? (
                  <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                    {pastor.summary}
                  </p>
                ) : null}

                {pastor.biography ? (
                  <section className="mt-10 border-t pt-8">
                    <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                      Tentang
                    </p>

                    <div className="mt-5 text-sm leading-8 whitespace-pre-line text-muted-foreground md:text-base">
                      {pastor.biography}
                    </div>
                  </section>
                ) : null}
              </div>
            </div>
          </article>
        </Container>
      </Section>
    </main>
  )
}

export { generateMetadata }
export default PublicPastorProfilePage
