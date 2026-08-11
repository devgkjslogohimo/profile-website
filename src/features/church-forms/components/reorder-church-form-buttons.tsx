"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { reorderChurchForm } from "@/features/church-forms/actions/reorder-church-form"

type ReorderChurchFormButtonsProps = {
  id: string
  title: string
  canMoveUp: boolean
  canMoveDown: boolean
}

function ReorderChurchFormButtons({
  id,
  title,
  canMoveUp,
  canMoveDown,
}: ReorderChurchFormButtonsProps) {
  const [pending, startTransition] = useTransition()

  function handleReorder(direction: "up" | "down") {
    startTransition(async () => {
      const result = await reorderChurchForm(id, direction)

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
        aria-label={`Naikkan urutan ${title}`}
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
        aria-label={`Turunkan urutan ${title}`}
        title="Turunkan urutan"
      >
        <ArrowDown />
      </Button>
    </div>
  )
}

export { ReorderChurchFormButtons }
