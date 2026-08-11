"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toggleGalleryImage } from "@/features/gallery/actions/toggle-gallery-image"

type ToggleGalleryImageStatusProps = {
  id: string
  label: string
  isActive: boolean
}

function ToggleGalleryImageStatus({ id, label, isActive }: ToggleGalleryImageStatusProps) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleGalleryImage(id)

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
      aria-label={isActive ? `Nonaktifkan ${label}` : `Aktifkan ${label}`}
    >
      {pending ? "Memproses..." : isActive ? "Nonaktifkan" : "Aktifkan"}
    </Button>
  )
}

export { ToggleGalleryImageStatus }
