import { prisma } from "@/lib/db/prisma"

function createChurchMinistrySlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function getUniqueChurchMinistrySlug(name: string, excludeId?: string) {
  const baseSlug = createChurchMinistrySlug(name) || "pelayanan"

  let slug = baseSlug
  let suffix = 2

  while (true) {
    const existing = await prisma.churchMinistry.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    })

    if (!existing || existing.id === excludeId) {
      return slug
    }

    slug = `${baseSlug}-${suffix}`
    suffix += 1
  }
}

export { createChurchMinistrySlug, getUniqueChurchMinistrySlug }
