"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toggleGalleryAlbum } from "@/features/gallery/actions/toggle-gallery-album"

type ToggleGalleryAlbumStatusProps = {
  id: string
  title: string
  isActive: boolean
}

function ToggleGalleryAlbumStatus({ id, title, isActive }: ToggleGalleryAlbumStatusProps) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleGalleryAlbum(id)

      if (!result.success) {
        toast.add({
          title: "Gagal",
          description: result.message,
          type: "error",
        })

        return
      }

      toast.add({
        title: "Berhasil",
        description: result.message,
        type: "success",
      })
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={handleToggle}
      aria-label={isActive ? `Nonaktifkan ${title}` : `Aktifkan ${title}`}
    >
      {pending ? "Memproses..." : isActive ? "Nonaktifkan" : "Aktifkan"}
    </Button>
  )
}

export { ToggleGalleryAlbumStatus }
