"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createNews } from "@/features/news/actions/create-news"
import { NewsFormFields } from "@/features/news/components/news-form-fields"
import { initialNewsActionState } from "@/features/news/lib/news-action-state"
import { type NewsFormInput, newsFormSchema } from "@/features/news/schemas/news-schema"
import { emptyRichTextContent } from "@/lib/rich-text"

function createDefaultValues(): NewsFormInput {
  return {
    title: "",
    excerpt: "",
    content: structuredClone(emptyRichTextContent),
    coverImageUrl: "",
  }
}

function createFormData(values: NewsFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)
  formData.set("excerpt", values.excerpt)

  formData.set("content", JSON.stringify(values.content))

  formData.set("coverImageUrl", values.coverImageUrl)

  return formData
}

function NewsCreateForm() {
  const form = useForm<NewsFormInput>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: createDefaultValues(),
  })

  const [state, dispatchAction, pending] = useActionState(createNews, initialNewsActionState)

  const { clearErrors, handleSubmit, reset, setError } = form

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })

      reset(createDefaultValues())

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

      setError(field as keyof NewsFormInput, {
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
      <NewsFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Berita"}
      </Button>
    </form>
  )
}

export { NewsCreateForm }
