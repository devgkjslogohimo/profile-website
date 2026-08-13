"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { reorderNewsImage } from "@/features/news/actions/reorder-news-image"

type ReorderNewsImageButtonsProps = {
  id: string
  label: string
  canMoveUp: boolean
  canMoveDown: boolean
}

function ReorderNewsImageButtons({
  id,
  label,
  canMoveUp,
  canMoveDown,
}: ReorderNewsImageButtonsProps) {
  const [pending, startTransition] = useTransition()

  function handleReorder(direction: "up" | "down") {
    startTransition(async () => {
      const result = await reorderNewsImage(id, direction)

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

export { ReorderNewsImageButtons }
