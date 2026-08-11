"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { reorderChurchStatisticMetric } from "@/features/church-statistics/actions/reorder-church-statistic-metric"

type ReorderChurchStatisticMetricButtonsProps = {
  id: string
  label: string
  canMoveUp: boolean
  canMoveDown: boolean
}

function ReorderChurchStatisticMetricButtons({
  id,
  label,
  canMoveUp,
  canMoveDown,
}: ReorderChurchStatisticMetricButtonsProps) {
  const [pending, startTransition] = useTransition()

  function handleReorder(direction: "up" | "down") {
    startTransition(async () => {
      const result = await reorderChurchStatisticMetric(id, direction)

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
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={pending || !canMoveUp}
        onClick={() => handleReorder("up")}
        aria-label={`Naikkan urutan ${label}`}
        title="Naikkan urutan"
      >
        <ArrowUp />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={pending || !canMoveDown}
        onClick={() => handleReorder("down")}
        aria-label={`Turunkan urutan ${label}`}
        title="Turunkan urutan"
      >
        <ArrowDown />
      </Button>
    </div>
  )
}

export { ReorderChurchStatisticMetricButtons }
