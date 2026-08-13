"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateNews } from "@/features/news/actions/update-news"
import { NewsFormFields } from "@/features/news/components/news-form-fields"
import { initialNewsActionState } from "@/features/news/lib/news-action-state"
import { type NewsFormInput, newsFormSchema } from "@/features/news/schemas/news-schema"
import type { RichTextContent } from "@/lib/rich-text"

type NewsEditFormProps = {
  news: {
    id: string
    title: string
    excerpt: string
    content: RichTextContent
    coverImageUrl: string | null
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

function NewsEditForm({ news }: NewsEditFormProps) {
  const form = useForm<NewsFormInput>({
    resolver: zodResolver(newsFormSchema),

    defaultValues: {
      title: news.title,
      excerpt: news.excerpt,
      content: structuredClone(news.content),
      coverImageUrl: news.coverImageUrl ?? "",
    },
  })

  const updateAction = updateNews.bind(null, news.id)

  const [state, dispatchAction, pending] = useActionState(updateAction, initialNewsActionState)

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

      setError(field as keyof NewsFormInput, {
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
      <NewsFormFields form={form} pending={pending} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/berita"
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

export { NewsEditForm }
