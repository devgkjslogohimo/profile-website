"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updatePawartos } from "@/features/pawartos/actions/update-pawartos"
import { PawartosFormFields } from "@/features/pawartos/components/pawartos-form-fields"
import { initialPawartosActionState } from "@/features/pawartos/lib/pawartos-action-state"
import {
  type PawartosFormInput,
  pawartosFormSchema,
} from "@/features/pawartos/schemas/pawartos-schema"

type PawartosEditFormProps = {
  pawartos: {
    id: string
    title: string
    publicationDate: string
    description: string | null
    googleDriveUrl: string
  }
}

function createFormData(values: PawartosFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)
  formData.set("publicationDate", values.publicationDate)
  formData.set("description", values.description)
  formData.set("googleDriveUrl", values.googleDriveUrl)

  return formData
}

function PawartosEditForm({ pawartos }: PawartosEditFormProps) {
  const form = useForm<PawartosFormInput>({
    resolver: zodResolver(pawartosFormSchema),
    defaultValues: {
      title: pawartos.title,
      publicationDate: pawartos.publicationDate,
      description: pawartos.description ?? "",
      googleDriveUrl: pawartos.googleDriveUrl,
    },
  })

  const updateAction = updatePawartos.bind(null, pawartos.id)

  const [state, dispatchAction, pending] = useActionState(updateAction, initialPawartosActionState)

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

      setError(field as keyof PawartosFormInput, {
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
      <PawartosFormFields form={form} pending={pending} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/pawartos"
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

export { PawartosEditForm }
