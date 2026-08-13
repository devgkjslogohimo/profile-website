"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateAnnouncement } from "@/features/announcements/actions/update-announcement"
import { AnnouncementFormFields } from "@/features/announcements/components/announcement-form-fields"
import { initialAnnouncementActionState } from "@/features/announcements/lib/announcement-action-state"
import {
  type AnnouncementFormInput,
  announcementFormSchema,
} from "@/features/announcements/schemas/announcement-schema"
import type { RichTextContent } from "@/lib/rich-text"

type AnnouncementEditFormProps = {
  announcement: {
    id: string
    title: string
    displayUntil: string | null
    content: RichTextContent
  }
}

function createFormData(values: AnnouncementFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)
  formData.set("displayUntil", values.displayUntil)
  formData.set("content", JSON.stringify(values.content))

  return formData
}

function AnnouncementEditForm({ announcement }: AnnouncementEditFormProps) {
  const form = useForm<AnnouncementFormInput>({
    resolver: zodResolver(announcementFormSchema),

    defaultValues: {
      title: announcement.title,
      displayUntil: announcement.displayUntil ?? "",
      content: structuredClone(announcement.content),
    },
  })

  const updateAction = updateAnnouncement.bind(null, announcement.id)

  const [state, dispatchAction, pending] = useActionState(
    updateAction,
    initialAnnouncementActionState
  )

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

      setError(field as keyof AnnouncementFormInput, {
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
      <AnnouncementFormFields form={form} pending={pending} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/pengumuman"
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

export { AnnouncementEditForm }
