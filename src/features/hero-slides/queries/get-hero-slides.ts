import { prisma } from "@/lib/db/prisma"

async function getHeroSlides() {
  return prisma.heroSlide.findMany({
    select: {
      id: true,
      slot: true,
      imageUrl: true,
      altText: true,
      isActive: true,
    },

    orderBy: {
      slot: "asc",
    },
  })
}

export { getHeroSlides }
