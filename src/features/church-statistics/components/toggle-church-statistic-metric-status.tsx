"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toggleChurchStatisticMetric } from "@/features/church-statistics/actions/toggle-church-statistic-metric"

type ToggleChurchStatisticMetricStatusProps = {
  id: string
  label: string
  isActive: boolean
}

function ToggleChurchStatisticMetricStatus({
  id,
  label,
  isActive,
}: ToggleChurchStatisticMetricStatusProps) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleChurchStatisticMetric(id)

      if (!result.success) {
        toast.add({
          title: "Gagal",
          description: result.message,
          type: "error",
        })

        return
      }

      toast.add({
        title: "Berhasil",
        description: result.message,
        type: "success",
      })
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={handleToggle}
      aria-label={isActive ? `Nonaktifkan ${label}` : `Aktifkan ${label}`}
    >
      {pending ? "Memproses..." : isActive ? "Nonaktifkan" : "Aktifkan"}
    </Button>
  )
}

export { ToggleChurchStatisticMetricStatus }
