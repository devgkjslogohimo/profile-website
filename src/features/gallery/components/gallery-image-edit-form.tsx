"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateGalleryImage } from "@/features/gallery/actions/update-gallery-image"
import { GalleryImageFormFields } from "@/features/gallery/components/gallery-image-form-fields"
import { initialGalleryImageActionState } from "@/features/gallery/lib/gallery-image-action-state"
import {
  type GalleryImageFormInput,
  galleryImageFormSchema,
} from "@/features/gallery/schemas/gallery-image-schema"

type GalleryImageEditFormProps = {
  image: {
    id: string
    albumId: string
    imageUrl: string
    caption: string | null
    altText: string | null
  }
}

function createFormData(values: GalleryImageFormInput) {
  const formData = new FormData()

  formData.set("imageUrl", values.imageUrl)
  formData.set("caption", values.caption)
  formData.set("altText", values.altText)

  return formData
}

function GalleryImageEditForm({ image }: GalleryImageEditFormProps) {
  const form = useForm<GalleryImageFormInput>({
    resolver: zodResolver(galleryImageFormSchema),
    defaultValues: {
      imageUrl: image.imageUrl,
      caption: image.caption ?? "",
      altText: image.altText ?? "",
    },
  })

  const updateAction = updateGalleryImage.bind(null, image.id)

  const [state, dispatchAction, pending] = useActionState(
    updateAction,
    initialGalleryImageActionState
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

      setError(field as keyof GalleryImageFormInput, {
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
      <GalleryImageFormFields form={form} pending={pending} editMode />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href={`/admin/galeri/${image.albumId}`}
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

export { GalleryImageEditForm }
