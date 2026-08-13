"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createAgenda } from "@/features/agenda/actions/create-agenda"
import { AgendaFormFields } from "@/features/agenda/components/agenda-form-fields"
import { initialAgendaActionState } from "@/features/agenda/lib/agenda-action-state"
import { type AgendaFormInput, agendaFormSchema } from "@/features/agenda/schemas/agenda-schema"
import { emptyRichTextContent } from "@/lib/rich-text"

function createDefaultValues(): AgendaFormInput {
  return {
    title: "",
    excerpt: "",
    content: structuredClone(emptyRichTextContent),

    startsAt: "",
    endsAt: "",

    location: "",
    googleMapsUrl: "",

    coverImageUrl: "",
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

function AgendaCreateForm() {
  const form = useForm<AgendaFormInput>({
    resolver: zodResolver(agendaFormSchema),
    defaultValues: createDefaultValues(),
  })

  const [state, dispatchAction, pending] = useActionState(createAgenda, initialAgendaActionState)

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

      setError(field as keyof AgendaFormInput, {
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
      <AgendaFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Agenda"}
      </Button>
    </form>
  )
}

export { AgendaCreateForm }
