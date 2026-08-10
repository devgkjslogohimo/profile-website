"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import {
  reorderChurchMinistry,
  type ReorderChurchMinistryDirection,
} from "@/features/church-ministries/actions/reorder-church-ministry"

type ReorderChurchMinistryButtonsProps = {
  id: string
  name: string
  canMoveUp: boolean
  canMoveDown: boolean
}

function ReorderChurchMinistryButtons({
  id,
  name,
  canMoveUp,
  canMoveDown,
}: ReorderChurchMinistryButtonsProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleReorder(direction: ReorderChurchMinistryDirection) {
    startTransition(async () => {
      const result = await reorderChurchMinistry(id, direction)

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
        title={`Naikkan ${name}`}
        onClick={() => handleReorder("up")}
      >
        <ArrowUp />
      </Button>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        disabled={!canMoveDown || pending}
        aria-label={`Turunkan ${name}`}
        title={`Turunkan ${name}`}
        onClick={() => handleReorder("down")}
      >
        <ArrowDown />
      </Button>
    </div>
  )
}

export { ReorderChurchMinistryButtons }
