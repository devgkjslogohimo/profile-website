"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createGalleryAlbum } from "@/features/gallery/actions/create-gallery-album"
import { GalleryAlbumFormFields } from "@/features/gallery/components/gallery-album-form-fields"
import { initialGalleryAlbumActionState } from "@/features/gallery/lib/gallery-album-action-state"
import {
  type GalleryAlbumFormInput,
  galleryAlbumFormSchema,
} from "@/features/gallery/schemas/gallery-album-schema"

const defaultValues: GalleryAlbumFormInput = {
  title: "",
  description: "",
  eventDate: "",
  coverImageUrl: "",
  googleDriveUrl: "",
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

function GalleryAlbumCreateForm() {
  const form = useForm<GalleryAlbumFormInput>({
    resolver: zodResolver(galleryAlbumFormSchema),
    defaultValues,
  })

  const [state, dispatchAction, pending] = useActionState(
    createGalleryAlbum,
    initialGalleryAlbumActionState
  )

  const { clearErrors, handleSubmit, reset, setError } = form

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })

      reset(defaultValues)

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
  }, [reset, setError, state])

  const onSubmit = handleSubmit((values) => {
    clearErrors()

    startTransition(() => {
      dispatchAction(createFormData(values))
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <GalleryAlbumFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Album"}
      </Button>
    </form>
  )
}

export { GalleryAlbumCreateForm }
