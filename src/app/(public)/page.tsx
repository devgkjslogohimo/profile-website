import { HomeAgendaSection } from "@/features/public-site/components/home-agenda-section"
import { HomeContactCta } from "@/features/public-site/components/home-contact-cta"
import { HomeGallerySection } from "@/features/public-site/components/home-gallery-section"
import { HomeHero } from "@/features/public-site/components/home-hero"
import { HomeNewsSection } from "@/features/public-site/components/home-news-section"
import { HomeQuickLinks } from "@/features/public-site/components/home-quick-links"
import { HomeWorshipSection } from "@/features/public-site/components/home-worship-section"
import { getHomepageData } from "@/features/public-site/queries/get-homepage-data"
import { getPublicSiteSettings } from "@/features/public-site/queries/get-public-site-settings"

async function PublicHomePage() {
  const [settings, homepageData] = await Promise.all([getPublicSiteSettings(), getHomepageData()])

  return (
    <main>
      <HomeHero settings={settings} />

      <HomeQuickLinks />

      <HomeWorshipSection schedule={homepageData.worshipSchedule} />

      <HomeNewsSection news={homepageData.news} />

      <HomeAgendaSection agendas={homepageData.agendas} />

      <HomeGallerySection albums={homepageData.galleryAlbums} />

      <HomeContactCta settings={settings} />
    </main>
  )
}

export default PublicHomePage
