"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createSitePage } from "@/features/site-pages/actions/create-site-page"
import { SitePageFormFields } from "@/features/site-pages/components/site-page-form-fields"
import { initialSitePageActionState } from "@/features/site-pages/lib/site-page-action-state"
import {
  type SitePageFormInput,
  sitePageFormSchema,
} from "@/features/site-pages/schemas/site-page-schema"
import { emptyRichTextContent } from "@/lib/rich-text"

function createDefaultValues(): SitePageFormInput {
  return {
    title: "",
    content: structuredClone(emptyRichTextContent),

    showInNavigation: false,
    navigationLabel: "",
    navigationOrder: 0,
  }
}

function createFormData(values: SitePageFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)

  formData.set("content", JSON.stringify(values.content))

  formData.set("showInNavigation", String(values.showInNavigation))

  formData.set("navigationLabel", values.navigationLabel)

  formData.set("navigationOrder", String(values.navigationOrder))

  return formData
}

function SitePageCreateForm() {
  const form = useForm<SitePageFormInput>({
    resolver: zodResolver(sitePageFormSchema),
    defaultValues: createDefaultValues(),
  })

  const [state, dispatchAction, pending] = useActionState(
    createSitePage,
    initialSitePageActionState
  )

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

      setError(field as keyof SitePageFormInput, {
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
      <SitePageFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Halaman"}
      </Button>
    </form>
  )
}

export { SitePageCreateForm }
