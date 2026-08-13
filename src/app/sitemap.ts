import type { MetadataRoute } from "next"

import { getPublicSitemapContent } from "@/features/public-site/queries/get-public-sitemap-content"
import { getAbsoluteSiteUrl } from "@/lib/site-url"

export const dynamic = "force-dynamic"

async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getPublicSitemapContent()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: getAbsoluteSiteUrl("/"),
    },
    {
      url: getAbsoluteSiteUrl("/jadwal-ibadah"),
    },
    {
      url: getAbsoluteSiteUrl("/pawartos"),
    },
    {
      url: getAbsoluteSiteUrl("/pengumuman"),
    },
    {
      url: getAbsoluteSiteUrl("/agenda"),
    },
    {
      url: getAbsoluteSiteUrl("/berita"),
    },
    {
      url: getAbsoluteSiteUrl("/galeri"),
    },
  ]

  const pawartosPages: MetadataRoute.Sitemap = content.pawartos.map((item) => ({
    url: getAbsoluteSiteUrl(`/pawartos/${item.slug}`),
    lastModified: item.updatedAt,
  }))

  const announcementPages: MetadataRoute.Sitemap = content.announcements.map((item) => ({
    url: getAbsoluteSiteUrl(`/pengumuman/${item.slug}`),
    lastModified: item.updatedAt,
  }))

  const agendaPages: MetadataRoute.Sitemap = content.agendas.map((item) => ({
    url: getAbsoluteSiteUrl(`/agenda/${item.slug}`),
    lastModified: item.updatedAt,
  }))

  const newsPages: MetadataRoute.Sitemap = content.news.map((item) => ({
    url: getAbsoluteSiteUrl(`/berita/${item.slug}`),
    lastModified: item.updatedAt,
  }))

  const galleryPages: MetadataRoute.Sitemap = content.galleryAlbums.map((item) => ({
    url: getAbsoluteSiteUrl(`/galeri/${item.slug}`),
    lastModified: item.updatedAt,
  }))

  const sitePages: MetadataRoute.Sitemap = content.sitePages.map((item) => ({
    url: getAbsoluteSiteUrl(`/${item.slug}`),
    lastModified: item.updatedAt,
  }))

  return [
    ...staticPages,
    ...sitePages,
    ...pawartosPages,
    ...announcementPages,
    ...newsPages,
    ...agendaPages,
    ...galleryPages,
  ]
}

export default sitemap
