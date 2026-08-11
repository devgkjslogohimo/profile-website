import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GalleryImageEditForm } from "@/features/gallery/components/gallery-image-edit-form"

type EditGalleryImageViewProps = {
  album: {
    id: string
    title: string
  }
  image: {
    id: string
    albumId: string
    imageUrl: string
    caption: string | null
    altText: string | null
    isActive: boolean
  }
}

function EditGalleryImageView({ album, image }: EditGalleryImageViewProps) {
  return (
    <main className="space-y-6">
      <div>
        <Link
          href={`/admin/galeri/${album.id}`}
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
          })}
        >
          <ArrowLeft />
          Kembali
        </Link>

        <p className="mt-4 text-sm text-muted-foreground">{album.title}</p>

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-2xl font-semibold tracking-tight md:text-3xl">
            Edit Foto
          </h1>

          <Badge variant={image.isActive ? "secondary" : "outline"}>
            {image.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {image.caption || "Foto tanpa caption"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preview Foto</CardTitle>
        </CardHeader>

        <CardContent>
          <GoogleDriveImage
            url={image.imageUrl}
            alt={image.altText || image.caption || album.title}
            className="max-w-2xl"
            eager
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Foto</CardTitle>
        </CardHeader>

        <CardContent>
          <GalleryImageEditForm
            image={{
              id: image.id,
              albumId: image.albumId,
              imageUrl: image.imageUrl,
              caption: image.caption,
              altText: image.altText,
            }}
          />
        </CardContent>
      </Card>
    </main>
  )
}

export { EditGalleryImageView }
