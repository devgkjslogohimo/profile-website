"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { createChurchStatisticMetric } from "@/features/church-statistics/actions/create-church-statistic-metric"
import { ChurchStatisticMetricFormFields } from "@/features/church-statistics/components/church-statistic-metric-form-fields"
import { initialChurchStatisticMetricActionState } from "@/features/church-statistics/lib/church-statistic-action-state"
import {
  type ChurchStatisticMetricFormInput,
  churchStatisticMetricFormSchema,
} from "@/features/church-statistics/schemas/church-statistic-metric-schema"

type ChurchStatisticMetricCreateFormProps = {
  snapshotId: string
}

const defaultValues: ChurchStatisticMetricFormInput = {
  category: "",
  label: "",
  value: "",
  unit: "",
}

function createFormData(values: ChurchStatisticMetricFormInput) {
  const formData = new FormData()

  formData.set("category", values.category)
  formData.set("label", values.label)
  formData.set("value", values.value)
  formData.set("unit", values.unit)

  return formData
}

function ChurchStatisticMetricCreateForm({ snapshotId }: ChurchStatisticMetricCreateFormProps) {
  const form = useForm<ChurchStatisticMetricFormInput>({
    resolver: zodResolver(churchStatisticMetricFormSchema),
    defaultValues,
  })

  const createAction = createChurchStatisticMetric.bind(null, snapshotId)

  const [state, dispatchAction, pending] = useActionState(
    createAction,
    initialChurchStatisticMetricActionState
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

      setError(field as keyof ChurchStatisticMetricFormInput, {
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
      <ChurchStatisticMetricFormFields form={form} pending={pending} />

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Data Statistik"}
      </Button>
    </form>
  )
}

export { ChurchStatisticMetricCreateForm }
