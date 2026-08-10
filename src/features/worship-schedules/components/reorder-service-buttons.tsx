"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { reorderWorshipService } from "@/features/worship-schedules/actions/reorder-worship-service"
import type { ReorderDirection } from "@/features/worship-schedules/lib/reorder-action-state"

type ReorderServiceButtonsProps = {
  id: string
  name: string
  canMoveUp: boolean
  canMoveDown: boolean
}

function ReorderServiceButtons({ id, name, canMoveUp, canMoveDown }: ReorderServiceButtonsProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleMove(direction: ReorderDirection) {
    startTransition(async () => {
      const result = await reorderWorshipService(id, direction)

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
        aria-label={`Naikkan ${name}`}
        onClick={() => handleMove("up")}
      >
        <ArrowUp />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={!canMoveDown || pending}
        aria-label={`Turunkan ${name}`}
        onClick={() => handleMove("down")}
      >
        <ArrowDown />
      </Button>
    </div>
  )
}

export { ReorderServiceButtons }
