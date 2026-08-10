import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpdateChurchMinistryForm } from "@/features/church-ministries/components/update-church-ministry-form"

type EditChurchMinistryViewProps = {
  ministry: {
    id: string
    name: string
    slug: string
    summary: string | null
    description: string | null
    imageUrl: string | null
    isActive: boolean
  }
}

function EditChurchMinistryView({ ministry }: EditChurchMinistryViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href="/admin/pelayanan"
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">Pelayanan</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Edit Pelayanan
          </h1>

          <Badge variant={ministry.isActive ? "secondary" : "outline"}>
            {ministry.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">{ministry.name}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview Gambar</CardTitle>
        </CardHeader>

        <CardContent>
          <GoogleDriveImage
            url={ministry.imageUrl}
            alt={ministry.name}
            className="max-w-2xl"
            eager
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pelayanan</CardTitle>
        </CardHeader>

        <CardContent>
          <UpdateChurchMinistryForm ministry={ministry} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Sistem</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Slug</p>

            <p className="mt-1 font-medium break-all">/{ministry.slug}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Status</p>

            <p className="mt-1 font-medium">{ministry.isActive ? "Aktif" : "Nonaktif"}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Gambar</p>

            {ministry.imageUrl ? (
              <Link
                href={ministry.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
              >
                Buka gambar
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

export { EditChurchMinistryView }
