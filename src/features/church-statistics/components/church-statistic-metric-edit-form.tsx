"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { startTransition, useActionState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { updateChurchStatisticMetric } from "@/features/church-statistics/actions/update-church-statistic-metric"
import { ChurchStatisticMetricFormFields } from "@/features/church-statistics/components/church-statistic-metric-form-fields"
import { initialChurchStatisticMetricActionState } from "@/features/church-statistics/lib/church-statistic-action-state"
import {
  type ChurchStatisticMetricFormInput,
  churchStatisticMetricFormSchema,
} from "@/features/church-statistics/schemas/church-statistic-metric-schema"

type ChurchStatisticMetricEditFormProps = {
  metric: {
    id: string
    snapshotId: string
    category: string
    label: string
    value: number
    unit: string | null
  }
}

function createFormData(values: ChurchStatisticMetricFormInput) {
  const formData = new FormData()

  formData.set("category", values.category)
  formData.set("label", values.label)
  formData.set("value", values.value)
  formData.set("unit", values.unit)

  return formData
}

function ChurchStatisticMetricEditForm({ metric }: ChurchStatisticMetricEditFormProps) {
  const form = useForm<ChurchStatisticMetricFormInput>({
    resolver: zodResolver(churchStatisticMetricFormSchema),
    defaultValues: {
      category: metric.category,
      label: metric.label,
      value: String(metric.value),
      unit: metric.unit ?? "",
    },
  })

  const updateAction = updateChurchStatisticMetric.bind(null, metric.id)

  const [state, dispatchAction, pending] = useActionState(
    updateAction,
    initialChurchStatisticMetricActionState
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

      setError(field as keyof ChurchStatisticMetricFormInput, {
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
      <ChurchStatisticMetricFormFields form={form} pending={pending} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>

        <Link
          href={`/admin/statistik/${metric.snapshotId}`}
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

export { ChurchStatisticMetricEditForm }
