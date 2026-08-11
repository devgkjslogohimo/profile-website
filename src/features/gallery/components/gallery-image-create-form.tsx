"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createGalleryImage } from "@/features/gallery/actions/create-gallery-image"
import { GalleryImageFormFields } from "@/features/gallery/components/gallery-image-form-fields"
import { initialGalleryImageActionState } from "@/features/gallery/lib/gallery-image-action-state"
import {
  type GalleryImageFormInput,
  galleryImageFormSchema,
} from "@/features/gallery/schemas/gallery-image-schema"

type GalleryImageCreateFormProps = {
  albumId: string
}

const defaultValues: GalleryImageFormInput = {
  imageUrl: "",
  caption: "",
  altText: "",
}

function createFormData(values: GalleryImageFormInput) {
  const formData = new FormData()

  formData.set("imageUrl", values.imageUrl)
  formData.set("caption", values.caption)
  formData.set("altText", values.altText)

  return formData
}

function GalleryImageCreateForm({ albumId }: GalleryImageCreateFormProps) {
  const form = useForm<GalleryImageFormInput>({
    resolver: zodResolver(galleryImageFormSchema),
    defaultValues,
  })

  const createAction = createGalleryImage.bind(null, albumId)

  const [state, dispatchAction, pending] = useActionState(
    createAction,
    initialGalleryImageActionState
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

      setError(field as keyof GalleryImageFormInput, {
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
      <GalleryImageFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Foto"}
      </Button>
    </form>
  )
}

export { GalleryImageCreateForm }
