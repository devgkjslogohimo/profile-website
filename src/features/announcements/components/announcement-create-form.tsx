"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createAnnouncement } from "@/features/announcements/actions/create-announcement"
import { AnnouncementFormFields } from "@/features/announcements/components/announcement-form-fields"
import { initialAnnouncementActionState } from "@/features/announcements/lib/announcement-action-state"
import {
  type AnnouncementFormInput,
  announcementFormSchema,
} from "@/features/announcements/schemas/announcement-schema"
import { emptyRichTextContent } from "@/lib/rich-text"

function createDefaultValues(): AnnouncementFormInput {
  return {
    title: "",
    displayUntil: "",
    content: structuredClone(emptyRichTextContent),
  }
}

function createFormData(values: AnnouncementFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)
  formData.set("displayUntil", values.displayUntil)
  formData.set("content", JSON.stringify(values.content))

  return formData
}

function AnnouncementCreateForm() {
  const form = useForm<AnnouncementFormInput>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: createDefaultValues(),
  })

  const [state, dispatchAction, pending] = useActionState(
    createAnnouncement,
    initialAnnouncementActionState
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

      setError(field as keyof AnnouncementFormInput, {
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
      <AnnouncementFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Pengumuman"}
      </Button>
    </form>
  )
}

export { AnnouncementCreateForm }
