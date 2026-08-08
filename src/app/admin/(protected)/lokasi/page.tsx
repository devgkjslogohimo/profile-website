import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requirePermission } from "@/dal/auth"
import { prisma } from "@/lib/db/prisma"

import { CreateLocationForm } from "./_components/create-location-form"
import { DeleteLocationButton } from "./_components/delete-location-button"
import { ToggleLocationStatus } from "./_components/toggle-location-status"

export default async function ChurchLocationsPage() {
  await requirePermission("church.manage")

  const locations = await prisma.churchLocation.findMany({
    orderBy: {
      sortOrder: "asc",
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

  const activeLocations = locations.filter((location) => location.isActive).length
  const churchCount = locations.filter((location) => location.type === "CHURCH").length
  const pepanthanCount = locations.filter((location) => location.type === "PEPANTHAN").length

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Data Gereja</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Gereja &amp; Pepanthan
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola lokasi GKJ Slogohimo dan seluruh pepanthan yang digunakan sebagai referensi data
          gereja.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Lokasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{locations.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Gereja</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{churchCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pepanthan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{pepanthanCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tambah Lokasi</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tambahkan lokasi gereja atau pepanthan baru.
          </p>
        </CardHeader>
        <CardContent>
          <CreateLocationForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Lokasi</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeLocations} dari {locations.length} lokasi aktif
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {locations.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-sm font-medium">Belum ada lokasi</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Data gereja dan pepanthan belum tersedia.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{location.name}</p>

                      <Badge variant="outline">
                        {location.type === "CHURCH" ? "Gereja" : "Pepanthan"}
                      </Badge>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">{location.slug}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Urutan {location.sortOrder}
                    </span>

                    <Badge variant={location.isActive ? "secondary" : "outline"}>
                      {location.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>

                    {location.googleMapsUrl ? (
                      <Link
                        href={location.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Google Maps
                      </Link>
                    ) : null}

                    <ToggleLocationStatus
                      id={location.id}
                      name={location.name}
                      isActive={location.isActive}
                    />

                    {!location.isActive ? (
                      <DeleteLocationButton id={location.id} name={location.name} />
                    ) : null}

                    <Link
                      href={`/admin/lokasi/${location.id}/edit`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
