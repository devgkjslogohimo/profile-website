"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createChurchStatisticSnapshot } from "@/features/church-statistics/actions/create-church-statistic-snapshot"
import { ChurchStatisticSnapshotFormFields } from "@/features/church-statistics/components/church-statistic-snapshot-form-fields"
import { initialChurchStatisticSnapshotActionState } from "@/features/church-statistics/lib/church-statistic-action-state"
import {
  type ChurchStatisticSnapshotFormInput,
  churchStatisticSnapshotFormSchema,
} from "@/features/church-statistics/schemas/church-statistic-snapshot-schema"

const defaultValues: ChurchStatisticSnapshotFormInput = {
  title: "",
  asOfDate: "",
  notes: "",
}

function createFormData(values: ChurchStatisticSnapshotFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)
  formData.set("asOfDate", values.asOfDate)
  formData.set("notes", values.notes)

  return formData
}

function ChurchStatisticSnapshotCreateForm() {
  const form = useForm<ChurchStatisticSnapshotFormInput>({
    resolver: zodResolver(churchStatisticSnapshotFormSchema),
    defaultValues,
  })

  const [state, dispatchAction, pending] = useActionState(
    createChurchStatisticSnapshot,
    initialChurchStatisticSnapshotActionState
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

      setError(field as keyof ChurchStatisticSnapshotFormInput, {
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
      <ChurchStatisticSnapshotFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Snapshot Statistik"}
      </Button>
    </form>
  )
}

export { ChurchStatisticSnapshotCreateForm }
