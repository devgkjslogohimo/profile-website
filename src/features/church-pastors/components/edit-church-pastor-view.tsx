import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurchPastorEditForm } from "@/features/church-pastors/components/church-pastor-edit-form"

type EditChurchPastorViewProps = {
  pastor: {
    id: string
    fullName: string
    slug: string
    periodStart: string
    periodEnd: string | null
    summary: string | null
    biography: string | null
    photoUrl: string | null
    isActive: boolean
  }
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

function EditChurchPastorView({ pastor }: EditChurchPastorViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/pendeta"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">Pendeta</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Edit Pendeta
          </h1>

          <Badge variant={pastor.isActive ? "secondary" : "outline"}>
            {pastor.isActive ? "Aktif" : "Nonaktif"}
          </Badge>

          {!pastor.periodEnd ? <Badge variant="secondary">Saat ini</Badge> : null}
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{pastor.fullName}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview Foto</CardTitle>
        </CardHeader>

        <CardContent>
          {pastor.photoUrl ? (
            <GoogleDriveImage
              url={pastor.photoUrl}
              alt={pastor.fullName}
              className="max-w-2xl"
              eager
            />
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada foto pendeta.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pendeta</CardTitle>
        </CardHeader>

        <CardContent>
          <ChurchPastorEditForm pastor={pastor} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Slug</p>

            <p className="mt-1 font-medium break-all">/{pastor.slug}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>

            <p className="mt-1 font-medium">{pastor.isActive ? "Aktif" : "Nonaktif"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Periode Pelayanan</p>

            <p className="mt-1 font-medium">
              {formatDate(pastor.periodStart)}
              {" — "}
              {pastor.periodEnd ? formatDate(pastor.periodEnd) : "Sekarang"}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Foto</p>

            {pastor.photoUrl ? (
              <Link
                href={pastor.photoUrl}
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

export { EditChurchPastorView }
