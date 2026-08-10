"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  reorderBibleStudySchedule,
  type ReorderDirection,
} from "@/features/bible-study-schedules/actions/reorder-bible-study-schedule"

type ReorderBibleStudyScheduleButtonsProps = {
  id: string
  groupName: string
  canMoveUp: boolean
  canMoveDown: boolean
}

function ReorderBibleStudyScheduleButtons({
  id,
  groupName,
  canMoveUp,
  canMoveDown,
}: ReorderBibleStudyScheduleButtonsProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleMove(direction: ReorderDirection) {
    startTransition(async () => {
      const result = await reorderBibleStudySchedule(id, direction)

      if (result.status === "error") {
        toast.add({
          title: "Gagal",
          description: result.message,
          type: "error",
        })

        return
      }

      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={!canMoveUp || pending}
        aria-label={`Naikkan ${groupName}`}
        onClick={() => handleMove("up")}
      >
        <ArrowUp />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={!canMoveDown || pending}
        aria-label={`Turunkan ${groupName}`}
        onClick={() => handleMove("down")}
      >
        <ArrowDown />
      </Button>
    </div>
  )
}

export { ReorderBibleStudyScheduleButtons }
