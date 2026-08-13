import { ExternalLink, Users } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchCouncilMemberCreateForm } from "@/features/church-councils/components/church-council-member-create-form"
import { DeleteChurchCouncilMemberButton } from "@/features/church-councils/components/delete-church-council-member-button"
import { ReorderChurchCouncilMemberButtons } from "@/features/church-councils/components/reorder-church-council-member-buttons"
import { ToggleChurchCouncilMemberStatus } from "@/features/church-councils/components/toggle-church-council-member-status"
import { isCurrentChurchCouncilMemberPeriod } from "@/features/church-councils/lib/church-council-member-period"

type ChurchCouncilMemberListItem = {
  id: string
  fullName: string
  position: string
  periodStart: Date
  periodEnd: Date | null
  photoUrl: string | null
  sortOrder: number
  isActive: boolean
  churchLocationId: string | null
  churchLocation: {
    id: string
    name: string
    type: "CHURCH" | "PEPANTHAN"
    sortOrder: number
    isActive: boolean
  } | null
}

type ChurchCouncilMemberManagerProps = {
  members: ChurchCouncilMemberListItem[]
  locations: {
    id: string
    name: string
    type: "CHURCH" | "PEPANTHAN"
    sortOrder: number
  }[]
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

function ChurchCouncilMemberManager({ members, locations }: ChurchCouncilMemberManagerProps) {
  const currentCount = members.filter((member) =>
    isCurrentChurchCouncilMemberPeriod(member.periodStart, member.periodEnd)
  ).length

  const activeCount = members.filter((member) => member.isActive).length

  const inactiveCount = members.length - activeCount

  return (
    <main className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Data Gereja</p>

        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight md:text-3xl">
          Majelis
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Kelola anggota Majelis GKJ Slogohimo beserta jabatan dan periode pelayanan masing-masing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Anggota
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="size-5 text-muted-foreground" />

              <p className="text-2xl font-semibold">{members.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sedang Melayani
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">{currentCount}</p>

            <p className="mt-1 text-xs text-muted-foreground">Berdasarkan periode pelayanan.</p>
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
              + Tambah Anggota Majelis
            </summary>

            <div className="mt-6 border-t pt-6">
              <ChurchCouncilMemberCreateForm locations={locations} />
            </div>
          </details>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="font-serif text-xl font-semibold">Daftar Majelis</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Urutan anggota dapat disesuaikan menggunakan tombol naik dan turun.
          </p>
        </div>

        {members.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm font-medium">Belum ada anggota Majelis</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Tambahkan anggota Majelis menggunakan formulir di atas.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {members.map((member, index) => {
              const isCurrent = isCurrentChurchCouncilMemberPeriod(
                member.periodStart,
                member.periodEnd
              )

              const membersAtSameLocation = members.filter(
                (candidate) => candidate.churchLocationId === member.churchLocationId
              )

              const locationIndex = membersAtSameLocation.findIndex(
                (candidate) => candidate.id === member.id
              )

              return (
                <Card key={member.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <CardTitle className="wrap-break-word">{member.fullName}</CardTitle>

                        <p className="mt-1 text-sm font-medium text-muted-foreground">
                          {member.position}
                        </p>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {member.churchLocation ? (
                          <>
                            Lokasi pelayanan:{" "}
                            <span className="font-medium text-foreground">
                              {member.churchLocation.name}
                            </span>
                          </>
                        ) : (
                          <span className="font-medium text-destructive">
                            Lokasi pelayanan belum ditetapkan
                          </span>
                        )}
                      </p>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        {isCurrent ? <Badge variant="secondary">Saat ini</Badge> : null}

                        <Badge variant={member.isActive ? "secondary" : "outline"}>
                          {member.isActive ? "Aktif" : "Nonaktif"}
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
                        {formatPeriod(member.periodStart, member.periodEnd)}
                      </p>
                    </div>

                    {member.photoUrl ? (
                      <div className="flex items-center gap-2 rounded-xl border p-3">
                        <GoogleDriveImage
                          url={member.photoUrl}
                          alt={member.fullName}
                          eager={index === 0}
                        />

                        <Link
                          href={member.photoUrl}
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
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Belum ada foto.</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 border-t pt-4">
                      <ReorderChurchCouncilMemberButtons
                        id={member.id}
                        name={member.fullName}
                        canMoveUp={locationIndex > 0}
                        canMoveDown={
                          locationIndex >= 0 && locationIndex < membersAtSameLocation.length - 1
                        }
                      />

                      <ToggleChurchCouncilMemberStatus
                        id={member.id}
                        name={member.fullName}
                        isActive={member.isActive}
                      />

                      <Link
                        href={`/admin/majelis/${member.id}/edit`}
                        className={buttonVariants({
                          variant: "outline",
                          size: "sm",
                        })}
                      >
                        Edit
                      </Link>

                      {!member.isActive ? (
                        <DeleteChurchCouncilMemberButton id={member.id} name={member.fullName} />
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

export { ChurchCouncilMemberManager }
