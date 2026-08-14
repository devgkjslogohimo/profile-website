import { unstable_cache } from "next/cache"
import { cache } from "react"

import { PUBLIC_CACHE_TAGS } from "@/features/public-site/lib/public-cache-tags"
import { prisma } from "@/lib/db/prisma"

const PUBLIC_HERO_SLIDES_REVALIDATE_SECONDS = 300

const getCachedPublicHeroSlides = unstable_cache(
  async () => {
    return prisma.heroSlide.findMany({
      where: {
        isActive: true,
      },

      select: {
        id: true,
        imageUrl: true,
        altText: true,
      },

      orderBy: {
        slot: "asc",
      },

      take: 3,
    })
  },
  ["public-hero-slides-v1"],
  {
    revalidate: PUBLIC_HERO_SLIDES_REVALIDATE_SECONDS,
    tags: [PUBLIC_CACHE_TAGS.heroSlides],
  }
)

const getPublicHeroSlides = cache(async () => {
  return getCachedPublicHeroSlides()
})

export { getPublicHeroSlides }
