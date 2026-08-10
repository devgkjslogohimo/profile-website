"use client"

import { useActionState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toggleBibleStudySchedule } from "@/features/bible-study-schedules/actions/toggle-bible-study-schedule"
import { initialToggleBibleStudyScheduleActionState } from "@/features/bible-study-schedules/lib/toggle-action-state"

type ToggleBibleStudyScheduleStatusProps = {
  id: string
  groupName: string
  isActive: boolean
}

function ToggleBibleStudyScheduleStatus({
  id,
  groupName,
  isActive,
}: ToggleBibleStudyScheduleStatusProps) {
  const toggleAction = toggleBibleStudySchedule.bind(null, id)

  const [state, formAction, pending] = useActionState(
    toggleAction,
    initialToggleBibleStudyScheduleActionState
  )

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })
    }

    if (state.status === "error") {
      toast.add({
        title: "Gagal",
        description: state.message,
        type: "error",
      })
    }
  }, [state])

  return (
    <form action={formAction}>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        disabled={pending}
        aria-label={isActive ? `Nonaktifkan ${groupName}` : `Aktifkan ${groupName}`}
      >
        {pending ? "Memproses..." : isActive ? "Nonaktifkan" : "Aktifkan"}
      </Button>
    </form>
  )
}

export { ToggleBibleStudyScheduleStatus }
