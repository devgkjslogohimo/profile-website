"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createChurchForm } from "@/features/church-forms/actions/create-church-form"
import { ChurchFormFormFields } from "@/features/church-forms/components/church-form-form-fields"
import { initialChurchFormActionState } from "@/features/church-forms/lib/church-form-action-state"
import {
  type ChurchFormFormInput,
  churchFormFormSchema,
} from "@/features/church-forms/schemas/church-form-schema"

const defaultValues: ChurchFormFormInput = {
  title: "",
  description: "",
  googleFormUrl: "",
}

function createFormData(values: ChurchFormFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)
  formData.set("description", values.description)
  formData.set("googleFormUrl", values.googleFormUrl)

  return formData
}

function ChurchFormCreateForm() {
  const form = useForm<ChurchFormFormInput>({
    resolver: zodResolver(churchFormFormSchema),
    defaultValues,
  })

  const [state, dispatchAction, pending] = useActionState(
    createChurchForm,
    initialChurchFormActionState
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

      setError(field as keyof ChurchFormFormInput, {
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
      <ChurchFormFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Formulir"}
      </Button>
    </form>
  )
}

export { ChurchFormCreateForm }
