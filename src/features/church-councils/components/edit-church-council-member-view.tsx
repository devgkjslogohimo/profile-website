import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchCouncilMemberEditForm } from "@/features/church-councils/components/church-council-member-edit-form"

type EditChurchCouncilMemberViewProps = {
  member: {
    id: string
    fullName: string
    position: string
    periodStart: string
    periodEnd: string | null
    photoUrl: string | null
    sortOrder: number
    isActive: boolean
    isCurrent: boolean
    churchLocationId: string | null
    churchLocation: {
      id: string
      name: string
      type: "CHURCH" | "PEPANTHAN"
      isActive: boolean
    } | null
  }
  locations: {
    id: string
    name: string
    type: "CHURCH" | "PEPANTHAN"
    isActive?: boolean
  }[]
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00.000Z`))
}

function EditChurchCouncilMemberView({ member, locations }: EditChurchCouncilMemberViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/majelis"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">Majelis</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Edit Anggota Majelis
          </h1>

          {member.isCurrent ? <Badge variant="secondary">Saat ini</Badge> : null}

          <Badge variant={member.isActive ? "secondary" : "outline"}>
            {member.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {member.fullName} · {member.position}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview Foto</CardTitle>
        </CardHeader>

        <CardContent>
          {member.photoUrl ? (
            <GoogleDriveImage
              url={member.photoUrl}
              alt={member.fullName}
              className="max-w-2xl"
              eager
            />
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada foto anggota Majelis.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Anggota</CardTitle>
        </CardHeader>

        <CardContent>
          <ChurchCouncilMemberEditForm
            member={{
              id: member.id,
              churchLocationId: member.churchLocationId,
              fullName: member.fullName,
              position: member.position,
              periodStart: member.periodStart,
              periodEnd: member.periodEnd,
              photoUrl: member.photoUrl,
            }}
            locations={locations}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Lokasi Pelayanan</p>

            <p className="mt-1 font-medium">{member.churchLocation?.name ?? "Belum ditetapkan"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Jabatan</p>

            <p className="mt-1 font-medium">{member.position}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>

            <p className="mt-1 font-medium">{member.isActive ? "Aktif" : "Nonaktif"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Periode Pelayanan</p>

            <p className="mt-1 font-medium">
              {formatDate(member.periodStart)}
              {" — "}
              {member.periodEnd ? formatDate(member.periodEnd) : "Sekarang"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Foto</p>

            {member.photoUrl ? (
              <Link
                href={member.photoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
              >
                Buka foto
                <ExternalLink className="size-3.5" />
              </Link>
            ) : (
              <p className="mt-1 font-medium">Belum tersedia</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export { EditChurchCouncilMemberView }
