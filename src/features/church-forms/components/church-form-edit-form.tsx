"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateChurchForm } from "@/features/church-forms/actions/update-church-form"
import { ChurchFormFormFields } from "@/features/church-forms/components/church-form-form-fields"
import { initialChurchFormActionState } from "@/features/church-forms/lib/church-form-action-state"
import {
  type ChurchFormFormInput,
  churchFormFormSchema,
} from "@/features/church-forms/schemas/church-form-schema"

type ChurchFormEditFormProps = {
  churchForm: {
    id: string
    title: string
    description: string | null
    googleFormUrl: string
  }
}

function createFormData(values: ChurchFormFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)
  formData.set("description", values.description)
  formData.set("googleFormUrl", values.googleFormUrl)

  return formData
}

function ChurchFormEditForm({ churchForm }: ChurchFormEditFormProps) {
  const form = useForm<ChurchFormFormInput>({
    resolver: zodResolver(churchFormFormSchema),
    defaultValues: {
      title: churchForm.title,
      description: churchForm.description ?? "",
      googleFormUrl: churchForm.googleFormUrl,
    },
  })

  const updateAction = updateChurchForm.bind(null, churchForm.id)

  const [state, dispatchAction, pending] = useActionState(
    updateAction,
    initialChurchFormActionState
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

      setError(field as keyof ChurchFormFormInput, {
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
      <ChurchFormFormFields form={form} pending={pending} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/pengajuan"
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

export { ChurchFormEditForm }
