"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createPawartos } from "@/features/pawartos/actions/create-pawartos"
import { PawartosFormFields } from "@/features/pawartos/components/pawartos-form-fields"
import { initialPawartosActionState } from "@/features/pawartos/lib/pawartos-action-state"
import {
  type PawartosFormInput,
  pawartosFormSchema,
} from "@/features/pawartos/schemas/pawartos-schema"

const defaultValues: PawartosFormInput = {
  title: "",
  publicationDate: "",
  description: "",
  googleDriveUrl: "",
}

function createFormData(values: PawartosFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)
  formData.set("publicationDate", values.publicationDate)
  formData.set("description", values.description)
  formData.set("googleDriveUrl", values.googleDriveUrl)

  return formData
}

function PawartosCreateForm() {
  const form = useForm<PawartosFormInput>({
    resolver: zodResolver(pawartosFormSchema),
    defaultValues,
  })

  const [state, dispatchAction, pending] = useActionState(
    createPawartos,
    initialPawartosActionState
  )

  const { clearErrors, handleSubmit, reset, setError } = form

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })

      reset(defaultValues)

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
  }, [reset, setError, state])

  const onSubmit = handleSubmit((values) => {
    clearErrors()

    startTransition(() => {
      dispatchAction(createFormData(values))
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <PawartosFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Pawartos"}
      </Button>
    </form>
  )
}

export { PawartosCreateForm }
