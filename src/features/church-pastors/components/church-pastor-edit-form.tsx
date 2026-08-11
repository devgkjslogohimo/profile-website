"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateChurchPastor } from "@/features/church-pastors/actions/update-church-pastor"
import { ChurchPastorFormFields } from "@/features/church-pastors/components/church-pastor-form-fields"
import { initialChurchPastorActionState } from "@/features/church-pastors/lib/church-pastor-action-state"
import {
  type ChurchPastorFormInput,
  churchPastorFormSchema,
} from "@/features/church-pastors/schemas/church-pastor-schema"

type ChurchPastorEditFormProps = {
  pastor: {
    id: string
    fullName: string
    slug: string
    periodStart: string
    periodEnd: string | null
    summary: string | null
    biography: string | null
    photoUrl: string | null
  }
}

function createFormData(values: ChurchPastorFormInput) {
  const formData = new FormData()

  formData.set("fullName", values.fullName)
  formData.set("periodStart", values.periodStart)
  formData.set("periodEnd", values.periodEnd)
  formData.set("summary", values.summary)
  formData.set("biography", values.biography)
  formData.set("photoUrl", values.photoUrl)

  return formData
}

function ChurchPastorEditForm({ pastor }: ChurchPastorEditFormProps) {
  const form = useForm<ChurchPastorFormInput>({
    resolver: zodResolver(churchPastorFormSchema),
    defaultValues: {
      fullName: pastor.fullName,
      periodStart: pastor.periodStart,
      periodEnd: pastor.periodEnd ?? "",
      summary: pastor.summary ?? "",
      biography: pastor.biography ?? "",
      photoUrl: pastor.photoUrl ?? "",
    },
  })

  const updateAction = updateChurchPastor.bind(null, pastor.id)

  const [state, dispatchAction, pending] = useActionState(
    updateAction,
    initialChurchPastorActionState
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

      setError(field as keyof ChurchPastorFormInput, {
        type: "server",
        message,
      })
    }
  }, [setError, state])

  const onSubmit = handleSubmit((values) => {
    clearErrors()

    const formData = createFormData(values)

    startTransition(() => {
      dispatchAction(formData)
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <ChurchPastorFormFields form={form} pending={pending} editMode />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/pendeta"
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

export { ChurchPastorEditForm }
