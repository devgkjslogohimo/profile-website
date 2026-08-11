"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createChurchPastor } from "@/features/church-pastors/actions/create-church-pastor"
import { ChurchPastorFormFields } from "@/features/church-pastors/components/church-pastor-form-fields"
import { initialChurchPastorActionState } from "@/features/church-pastors/lib/church-pastor-action-state"
import {
  type ChurchPastorFormInput,
  churchPastorFormSchema,
} from "@/features/church-pastors/schemas/church-pastor-schema"

const defaultValues: ChurchPastorFormInput = {
  fullName: "",
  periodStart: "",
  periodEnd: "",
  summary: "",
  biography: "",
  photoUrl: "",
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

function ChurchPastorCreateForm() {
  const form = useForm<ChurchPastorFormInput>({
    resolver: zodResolver(churchPastorFormSchema),
    defaultValues,
  })

  const [state, dispatchAction, pending] = useActionState(
    createChurchPastor,
    initialChurchPastorActionState
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

      setError(field as keyof ChurchPastorFormInput, {
        type: "server",
        message,
      })
    }
  }, [reset, setError, state])

  const onSubmit = handleSubmit((values) => {
    clearErrors()

    const formData = createFormData(values)

    startTransition(() => {
      dispatchAction(formData)
    })
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <ChurchPastorFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Pendeta"}
      </Button>
    </form>
  )
}

export { ChurchPastorCreateForm }
