import { ExternalLink } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateChurchMinistryForm } from "@/features/church-ministries/components/create-church-ministry-form"
import { DeleteChurchMinistryButton } from "@/features/church-ministries/components/delete-church-ministry-button"
import { ToggleChurchMinistryStatus } from "@/features/church-ministries/components/toggle-church-ministry-status"

import { ReorderChurchMinistryButtons } from "./reorder-church-ministry-buttons"

type ChurchMinistryListItem = {
  id: string
  name: string
  slug: string
  summary: string | null
  description: string | null
  imageUrl: string | null
  sortOrder: number
  isActive: boolean
}

type ChurchMinistryManagerProps = {
  ministries: ChurchMinistryListItem[]
}

function ChurchMinistryManager({ ministries }: ChurchMinistryManagerProps) {
  const activeCount = ministries.filter((ministry) => ministry.isActive).length

  const inactiveCount = ministries.length - activeCount

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Data Gereja</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Pelayanan
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola bidang, komisi, dan pelayanan yang tersedia di GKJ Slogohimo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Pelayanan
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{ministries.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aktif</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{activeCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nonaktif</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{inactiveCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <details>
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              + Tambah Pelayanan
            </summary>

            <div className="mt-6 border-t pt-6">
              <CreateChurchMinistryForm />
            </div>
          </details>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">Daftar Pelayanan</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {activeCount} dari {ministries.length} pelayanan aktif
          </p>
        </div>

        {ministries.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm font-medium">Belum ada pelayanan</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan pelayanan menggunakan formulir di atas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {ministries.map((ministry, index) => (
              <Card key={ministry.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="wrap-break-word">{ministry.name}</CardTitle>

                      <p className="mt-1 text-xs text-muted-foreground">/{ministry.slug}</p>
                    </div>

                    <Badge variant={ministry.isActive ? "secondary" : "outline"}>
                      {ministry.isActive ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {ministry.summary ? (
                    <p className="text-sm text-muted-foreground">{ministry.summary}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Belum ada ringkasan.</p>
                  )}

                  {ministry.imageUrl ? (
                    <div className="flex items-center gap-2 rounded-xl border p-3">
                      <GoogleDriveImage
                        url={ministry.imageUrl}
                        alt={ministry.name}
                        eager={index === 0}
                      />

                      <Link
                        href={ministry.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({
                          variant: "ghost",
                          size: "sm",
                        })}
                      >
                        <ExternalLink />
                        Buka
                      </Link>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                    <ReorderChurchMinistryButtons
                      id={ministry.id}
                      name={ministry.name}
                      canMoveUp={index > 0}
                      canMoveDown={index < ministries.length - 1}
                    />

                    <ToggleChurchMinistryStatus
                      id={ministry.id}
                      name={ministry.name}
                      isActive={ministry.isActive}
                    />

                    <Link
                      href={`/admin/pelayanan/${ministry.id}/edit`}
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      Edit
                    </Link>

                    {!ministry.isActive ? (
                      <DeleteChurchMinistryButton id={ministry.id} name={ministry.name} />
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export { ChurchMinistryManager }
