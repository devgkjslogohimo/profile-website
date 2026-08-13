"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateSitePage } from "@/features/site-pages/actions/update-site-page"
import { SitePageFormFields } from "@/features/site-pages/components/site-page-form-fields"
import { initialSitePageActionState } from "@/features/site-pages/lib/site-page-action-state"
import {
  type SitePageFormInput,
  sitePageFormSchema,
} from "@/features/site-pages/schemas/site-page-schema"
import type { RichTextContent } from "@/lib/rich-text"

type SitePageEditFormProps = {
  sitePage: {
    id: string
    title: string
    content: RichTextContent
  }
}

function createFormData(values: SitePageFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)

  formData.set("content", JSON.stringify(values.content))

  return formData
}

function SitePageEditForm({ sitePage }: SitePageEditFormProps) {
  const form = useForm<SitePageFormInput>({
    resolver: zodResolver(sitePageFormSchema),

    defaultValues: {
      title: sitePage.title,

      content: structuredClone(sitePage.content),
    },
  })

  const updateAction = updateSitePage.bind(null, sitePage.id)

  const [state, dispatchAction, pending] = useActionState(updateAction, initialSitePageActionState)

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

      setError(field as keyof SitePageFormInput, {
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
      <SitePageFormFields form={form} pending={pending} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/halaman"
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

export { SitePageEditForm }
