"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateNewsImage } from "@/features/news/actions/update-news-image"
import { NewsImageFormFields } from "@/features/news/components/news-image-form-fields"
import { initialNewsImageActionState } from "@/features/news/lib/news-image-action-state"
import {
  type NewsImageFormInput,
  newsImageFormSchema,
} from "@/features/news/schemas/news-image-schema"

type NewsImageEditFormProps = {
  image: {
    id: string
    newsId: string
    googleDriveUrl: string
    altText: string | null
    caption: string | null
  }
}

function createFormData(values: NewsImageFormInput) {
  const formData = new FormData()

  formData.set("googleDriveUrl", values.googleDriveUrl)
  formData.set("altText", values.altText)
  formData.set("caption", values.caption)

  return formData
}

function NewsImageEditForm({ image }: NewsImageEditFormProps) {
  const form = useForm<NewsImageFormInput>({
    resolver: zodResolver(newsImageFormSchema),

    defaultValues: {
      googleDriveUrl: image.googleDriveUrl,
      altText: image.altText ?? "",
      caption: image.caption ?? "",
    },
  })

  const updateAction = updateNewsImage.bind(null, image.newsId, image.id)

  const [state, dispatchAction, pending] = useActionState(updateAction, initialNewsImageActionState)

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

      setError(field as keyof NewsImageFormInput, {
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
      <NewsImageFormFields form={form} pending={pending} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href={`/admin/berita/${image.newsId}/edit`}
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

export { NewsImageEditForm }
