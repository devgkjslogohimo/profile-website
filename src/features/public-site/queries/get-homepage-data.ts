import { cache } from "react"

import { getHomepagePublishedAgendas } from "./get-public-agendas"
import { getHomepageActiveGalleryAlbums } from "./get-public-gallery"
import { getHomepagePublishedNews } from "./get-public-news"
import { getHomepagePublishedPawartos } from "./get-public-pawartos"
import { getHomepagePublishedWorshipSchedule } from "./get-public-worship-schedules"

const getHomepageData = cache(async () => {
  const [worshipSchedule, agendas, news, galleryAlbums, pawartos] = await Promise.all([
    getHomepagePublishedWorshipSchedule(),

    getHomepagePublishedAgendas(),

    getHomepagePublishedNews(),

    getHomepageActiveGalleryAlbums(),

    getHomepagePublishedPawartos(),
  ])

  return {
    worshipSchedule,
    agendas,
    news,
    galleryAlbums,
    pawartos,
  }
})

export { getHomepageData }
