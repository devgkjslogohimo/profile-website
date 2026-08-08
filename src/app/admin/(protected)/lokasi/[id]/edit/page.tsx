import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

import { UpdateLocationForm } from "../../_components/update-location-form"

export default async function EditChurchLocationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requirePermission("church.manage")

  const { id } = await params

  const location = await prisma.churchLocation.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      googleMapsUrl: true,
      type: true,
      sortOrder: true,
      isActive: true,
    },
  })

  if (!location) {
    notFound()
  }

  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/lokasi"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">Data Gereja</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Edit Lokasi
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">{location.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Lokasi</CardTitle>
        </CardHeader>

        <CardContent>
          <UpdateLocationForm
            location={{
              id: location.id,
              name: location.name,
              type: location.type,
              googleMapsUrl: location.googleMapsUrl,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Urutan</p>
            <p className="mt-1 font-medium">{location.sortOrder}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>
            <p className="mt-1 font-medium">{location.isActive ? "Aktif" : "Nonaktif"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Slug saat ini</p>
            <p className="mt-1 font-medium break-all">{location.slug}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
