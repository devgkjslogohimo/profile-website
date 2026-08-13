"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createNewsImage } from "@/features/news/actions/create-news-image"
import { NewsImageFormFields } from "@/features/news/components/news-image-form-fields"
import { initialNewsImageActionState } from "@/features/news/lib/news-image-action-state"
import {
  type NewsImageFormInput,
  newsImageFormSchema,
} from "@/features/news/schemas/news-image-schema"

type NewsImageCreateFormProps = {
  newsId: string
}

const defaultValues: NewsImageFormInput = {
  googleDriveUrl: "",
  altText: "",
  caption: "",
}

function createFormData(values: NewsImageFormInput) {
  const formData = new FormData()

  formData.set("googleDriveUrl", values.googleDriveUrl)
  formData.set("altText", values.altText)
  formData.set("caption", values.caption)

  return formData
}

function NewsImageCreateForm({ newsId }: NewsImageCreateFormProps) {
  const form = useForm<NewsImageFormInput>({
    resolver: zodResolver(newsImageFormSchema),
    defaultValues,
  })

  const createAction = createNewsImage.bind(null, newsId)

  const [state, dispatchAction, pending] = useActionState(createAction, initialNewsImageActionState)

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

      setError(field as keyof NewsImageFormInput, {
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
      <NewsImageFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menambahkan..." : "Tambah Foto"}
      </Button>
    </form>
  )
}

export { NewsImageCreateForm }
