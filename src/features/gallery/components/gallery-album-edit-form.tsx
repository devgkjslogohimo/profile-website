"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateGalleryAlbum } from "@/features/gallery/actions/update-gallery-album"
import { GalleryAlbumFormFields } from "@/features/gallery/components/gallery-album-form-fields"
import { initialGalleryAlbumActionState } from "@/features/gallery/lib/gallery-album-action-state"
import {
  type GalleryAlbumFormInput,
  galleryAlbumFormSchema,
} from "@/features/gallery/schemas/gallery-album-schema"

type GalleryAlbumEditFormProps = {
  album: {
    id: string
    title: string
    description: string | null
    eventDate: string | null
    coverImageUrl: string | null
    googleDriveUrl: string | null
  }
}

function createFormData(values: GalleryAlbumFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)
  formData.set("description", values.description)
  formData.set("eventDate", values.eventDate)
  formData.set("coverImageUrl", values.coverImageUrl)
  formData.set("googleDriveUrl", values.googleDriveUrl)

  return formData
}

function GalleryAlbumEditForm({ album }: GalleryAlbumEditFormProps) {
  const form = useForm<GalleryAlbumFormInput>({
    resolver: zodResolver(galleryAlbumFormSchema),
    defaultValues: {
      title: album.title,
      description: album.description ?? "",
      eventDate: album.eventDate ?? "",
      coverImageUrl: album.coverImageUrl ?? "",
      googleDriveUrl: album.googleDriveUrl ?? "",
    },
  })

  const updateAction = updateGalleryAlbum.bind(null, album.id)

  const [state, dispatchAction, pending] = useActionState(
    updateAction,
    initialGalleryAlbumActionState
  )

  const { clearErrors, handleSubmit, setError } = form

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })

      return
    }

    if (state.status !== "error") {
      return
    }

    const serverFieldErrors = Object.entries(state.fieldErrors)

    if (serverFieldErrors.length === 0) {
      toast.add({
        title: "Gagal",
        description: state.message,
        type: "error",
      })

      return
    }

    for (const [field, messages] of serverFieldErrors) {
      const message = messages?.[0]

      if (!message) {
        continue
      }

      setError(field as keyof GalleryAlbumFormInput, {
        type: "server",
        message,
      })
    }
  }, [setError, state])

  const onSubmit = handleSubmit((values) => {
    clearErrors()

    startTransition(() => {
      dispatchAction(createFormData(values))
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <GalleryAlbumFormFields form={form} pending={pending} editMode />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/galeri"
          className={buttonVariants({
            variant: "outline",
          })}
        >
          Batal
        </Link>
      </div>
    </form>
  )
}

export { GalleryAlbumEditForm }
