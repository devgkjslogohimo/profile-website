import { prisma } from "@/lib/db/prisma"

const noStoreHeaders = {
  "Cache-Control": "no-store",
}

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`

    return Response.json(
      {
        status: "ok",
        database: "ok",
      },
      {
        status: 200,
        headers: noStoreHeaders,
      }
    )
  } catch (error) {
    console.error("HEALTH DATABASE CHECK FAILED", error)

    return Response.json(
      {
        status: "unavailable",
        database: "unavailable",
      },
      {
        status: 503,
        headers: noStoreHeaders,
      }
    )
  }
}
