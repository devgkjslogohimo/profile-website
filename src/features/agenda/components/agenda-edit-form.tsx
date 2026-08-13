"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateAgenda } from "@/features/agenda/actions/update-agenda"
import { AgendaFormFields } from "@/features/agenda/components/agenda-form-fields"
import { initialAgendaActionState } from "@/features/agenda/lib/agenda-action-state"
import { type AgendaFormInput, agendaFormSchema } from "@/features/agenda/schemas/agenda-schema"
import type { RichTextContent } from "@/lib/rich-text"

type AgendaEditFormProps = {
  agenda: {
    id: string
    title: string
    excerpt: string
    content: RichTextContent

    startsAt: string
    endsAt: string | null

    location: string | null
    googleMapsUrl: string | null

    coverImageUrl: string | null
  }
}

function createFormData(values: AgendaFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)
  formData.set("excerpt", values.excerpt)

  formData.set("content", JSON.stringify(values.content))

  formData.set("startsAt", values.startsAt)
  formData.set("endsAt", values.endsAt)

  formData.set("location", values.location)
  formData.set("googleMapsUrl", values.googleMapsUrl)

  formData.set("coverImageUrl", values.coverImageUrl)

  return formData
}

function AgendaEditForm({ agenda }: AgendaEditFormProps) {
  const form = useForm<AgendaFormInput>({
    resolver: zodResolver(agendaFormSchema),

    defaultValues: {
      title: agenda.title,
      excerpt: agenda.excerpt,
      content: structuredClone(agenda.content),

      startsAt: agenda.startsAt,
      endsAt: agenda.endsAt ?? "",

      location: agenda.location ?? "",
      googleMapsUrl: agenda.googleMapsUrl ?? "",

      coverImageUrl: agenda.coverImageUrl ?? "",
    },
  })

  const updateAction = updateAgenda.bind(null, agenda.id)

  const [state, dispatchAction, pending] = useActionState(updateAction, initialAgendaActionState)

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

      setError(field as keyof AgendaFormInput, {
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
      <AgendaFormFields form={form} pending={pending} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/agenda"
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

export { AgendaEditForm }
