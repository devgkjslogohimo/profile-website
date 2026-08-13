import { cache } from "react"

import { prisma } from "@/lib/db/prisma"

const getPublicHeroSlides = cache(async () => {
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
})

export { getPublicHeroSlides }
