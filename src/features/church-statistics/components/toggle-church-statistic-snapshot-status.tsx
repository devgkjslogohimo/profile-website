"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toggleChurchStatisticSnapshot } from "@/features/church-statistics/actions/toggle-church-statistic-snapshot"

type ToggleChurchStatisticSnapshotStatusProps = {
  id: string
  title: string
  isActive: boolean
}

function ToggleChurchStatisticSnapshotStatus({
  id,
  title,
  isActive,
}: ToggleChurchStatisticSnapshotStatusProps) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleChurchStatisticSnapshot(id)

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
      aria-label={isActive ? `Nonaktifkan ${title}` : `Aktifkan ${title}`}
    >
      {pending ? "Memproses..." : isActive ? "Nonaktifkan" : "Aktifkan"}
    </Button>
  )
}

export { ToggleChurchStatisticSnapshotStatus }
