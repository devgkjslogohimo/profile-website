import { ExternalLink } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchPastorCreateForm } from "@/features/church-pastors/components/church-pastor-create-form"

import { DeleteChurchPastorButton } from "./delete-church-pastor-button"
import { ToggleChurchPastorStatus } from "./toggle-church-pastor-status"

type ChurchPastorListItem = {
  id: string
  fullName: string
  slug: string
  periodStart: Date
  periodEnd: Date | null
  summary: string | null
  biography: string | null
  photoUrl: string | null
  isActive: boolean
}

type ChurchPastorListProps = {
  pastors: ChurchPastorListItem[]
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function formatDate(date: Date) {
  return dateFormatter.format(date)
}

function formatPeriod(periodStart: Date, periodEnd: Date | null) {
  return `${formatDate(periodStart)} — ${periodEnd ? formatDate(periodEnd) : "Sekarang"}`
}

function ChurchPastorList({ pastors }: ChurchPastorListProps) {
  const activeCount = pastors.filter((pastor) => pastor.isActive).length

  const inactiveCount = pastors.length - activeCount

  const currentPastor = pastors.find((pastor) => pastor.periodEnd === null)

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Data Gereja</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Pendeta
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola data pendeta dan riwayat periode pelayanan Pendeta GKJ Slogohimo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Riwayat Pendeta
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{pastors.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendeta Saat Ini
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-base font-semibold">{currentPastor?.fullName ?? "Belum ada"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status Konten
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm font-medium">{activeCount} aktif</p>

            <p className="mt-1 text-xs text-muted-foreground">{inactiveCount} nonaktif</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <details>
            <summary className="cursor-pointer list-none font-medium [&::-webkit-details-marker]:hidden">
              + Tambah Pendeta
            </summary>

            <div className="mt-6 border-t pt-6">
              <ChurchPastorCreateForm />
            </div>
          </details>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">Riwayat Pendeta</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Data diurutkan berdasarkan periode pelayanan terbaru.
          </p>
        </div>

        {pastors.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm font-medium">Belum ada data pendeta</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan pendeta menggunakan formulir di atas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pastors.map((pastor, index) => {
              const isCurrent = pastor.periodEnd === null

              return (
                <Card key={pastor.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <CardTitle className="wrap-break-word">{pastor.fullName}</CardTitle>

                        <p className="mt-1 text-xs text-muted-foreground">/{pastor.slug}</p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        {isCurrent ? <Badge variant="secondary">Saat ini</Badge> : null}

                        <Badge variant={pastor.isActive ? "secondary" : "outline"}>
                          {pastor.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Periode Pelayanan
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {formatPeriod(pastor.periodStart, pastor.periodEnd)}
                      </p>
                    </div>

                    {pastor.summary ? (
                      <p className="text-sm text-muted-foreground">{pastor.summary}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Belum ada ringkasan.</p>
                    )}

                    {pastor.photoUrl ? (
                      <div className="flex items-center gap-2 rounded-xl border p-3">
                        <GoogleDriveImage
                          url={pastor.photoUrl}
                          alt={pastor.fullName}
                          eager={index === 0}
                        />

                        <Link
                          href={pastor.photoUrl}
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
                      <ToggleChurchPastorStatus
                        id={pastor.id}
                        name={pastor.fullName}
                        isActive={pastor.isActive}
                      />

                      <Link
                        href={`/admin/pendeta/${pastor.id}/edit`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Edit
                      </Link>

                      {!pastor.isActive ? (
                        <DeleteChurchPastorButton id={pastor.id} name={pastor.fullName} />
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

export { ChurchPastorList }
