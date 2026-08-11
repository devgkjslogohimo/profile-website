"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateChurchStatisticSnapshot } from "@/features/church-statistics/actions/update-church-statistic-snapshot"
import { ChurchStatisticSnapshotFormFields } from "@/features/church-statistics/components/church-statistic-snapshot-form-fields"
import { initialChurchStatisticSnapshotActionState } from "@/features/church-statistics/lib/church-statistic-action-state"
import {
  type ChurchStatisticSnapshotFormInput,
  churchStatisticSnapshotFormSchema,
} from "@/features/church-statistics/schemas/church-statistic-snapshot-schema"

type ChurchStatisticSnapshotEditFormProps = {
  snapshot: {
    id: string
    title: string
    asOfDate: string
    notes: string | null
  }
}

function createFormData(values: ChurchStatisticSnapshotFormInput) {
  const formData = new FormData()

  formData.set("title", values.title)
  formData.set("asOfDate", values.asOfDate)
  formData.set("notes", values.notes)

  return formData
}

function ChurchStatisticSnapshotEditForm({ snapshot }: ChurchStatisticSnapshotEditFormProps) {
  const form = useForm<ChurchStatisticSnapshotFormInput>({
    resolver: zodResolver(churchStatisticSnapshotFormSchema),
    defaultValues: {
      title: snapshot.title,
      asOfDate: snapshot.asOfDate,
      notes: snapshot.notes ?? "",
    },
  })

  const updateAction = updateChurchStatisticSnapshot.bind(null, snapshot.id)

  const [state, dispatchAction, pending] = useActionState(
    updateAction,
    initialChurchStatisticSnapshotActionState
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

      setError(field as keyof ChurchStatisticSnapshotFormInput, {
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
      <ChurchStatisticSnapshotFormFields form={form} pending={pending} editMode />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href={`/admin/statistik/${snapshot.id}`}
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

export { ChurchStatisticSnapshotEditForm }
