"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateChurchCouncilMember } from "@/features/church-councils/actions/update-church-council-member"
import { ChurchCouncilMemberFormFields } from "@/features/church-councils/components/church-council-member-form-fields"
import { initialChurchCouncilMemberActionState } from "@/features/church-councils/lib/church-council-action-state"
import {
  type ChurchCouncilMemberFormInput,
  churchCouncilMemberFormSchema,
} from "@/features/church-councils/schemas/church-council-member-schema"

type ChurchCouncilMemberEditFormProps = {
  member: {
    id: string
    fullName: string
    position: string
    periodStart: string
    periodEnd: string | null
    photoUrl: string | null
    churchLocationId: string | null
  }
  locations: {
    id: string
    name: string
    type: "CHURCH" | "PEPANTHAN"
    isActive?: boolean
  }[]
}

function createFormData(values: ChurchCouncilMemberFormInput) {
  const formData = new FormData()

  formData.set("fullName", values.fullName)
  formData.set("churchLocationId", values.churchLocationId)
  formData.set("position", values.position)
  formData.set("periodStart", values.periodStart)
  formData.set("periodEnd", values.periodEnd)
  formData.set("photoUrl", values.photoUrl)

  return formData
}

function ChurchCouncilMemberEditForm({ member, locations }: ChurchCouncilMemberEditFormProps) {
  const form = useForm<ChurchCouncilMemberFormInput>({
    resolver: zodResolver(churchCouncilMemberFormSchema),
    defaultValues: {
      fullName: member.fullName,
      position: member.position,
      periodStart: member.periodStart,
      periodEnd: member.periodEnd ?? "",
      photoUrl: member.photoUrl ?? "",
      churchLocationId: member.churchLocationId ?? "",
    },
  })

  const updateAction = updateChurchCouncilMember.bind(null, member.id)

  const [state, dispatchAction, pending] = useActionState(
    updateAction,
    initialChurchCouncilMemberActionState
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

      setError(field as keyof ChurchCouncilMemberFormInput, {
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
      <ChurchCouncilMemberFormFields form={form} pending={pending} editMode locations={locations} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href="/admin/majelis"
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

export { ChurchCouncilMemberEditForm }
