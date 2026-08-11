"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createChurchCouncilMember } from "@/features/church-councils/actions/create-church-council-member"
import { ChurchCouncilMemberFormFields } from "@/features/church-councils/components/church-council-member-form-fields"
import { initialChurchCouncilMemberActionState } from "@/features/church-councils/lib/church-council-action-state"
import {
  type ChurchCouncilMemberFormInput,
  churchCouncilMemberFormSchema,
} from "@/features/church-councils/schemas/church-council-member-schema"

const defaultValues: ChurchCouncilMemberFormInput = {
  fullName: "",
  position: "",
  periodStart: "",
  periodEnd: "",
  photoUrl: "",
}

function createFormData(values: ChurchCouncilMemberFormInput) {
  const formData = new FormData()

  formData.set("fullName", values.fullName)
  formData.set("position", values.position)
  formData.set("periodStart", values.periodStart)
  formData.set("periodEnd", values.periodEnd)
  formData.set("photoUrl", values.photoUrl)

  return formData
}

function ChurchCouncilMemberCreateForm() {
  const form = useForm<ChurchCouncilMemberFormInput>({
    resolver: zodResolver(churchCouncilMemberFormSchema),
    defaultValues,
  })

  const [state, dispatchAction, pending] = useActionState(
    createChurchCouncilMember,
    initialChurchCouncilMemberActionState
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

      setError(field as keyof ChurchCouncilMemberFormInput, {
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
      <ChurchCouncilMemberFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Anggota Majelis"}
      </Button>
    </form>
  )
}

export { ChurchCouncilMemberCreateForm }
