"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { reorderChurchCouncilMember } from "@/features/church-councils/actions/reorder-church-council-member"

type ReorderChurchCouncilMemberButtonsProps = {
  id: string
  name: string
  canMoveUp: boolean
  canMoveDown: boolean
}

function ReorderChurchCouncilMemberButtons({
  id,
  name,
  canMoveUp,
  canMoveDown,
}: ReorderChurchCouncilMemberButtonsProps) {
  const [pending, startTransition] = useTransition()

  function handleReorder(direction: "up" | "down") {
    startTransition(async () => {
      const result = await reorderChurchCouncilMember(id, direction)

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
        aria-label={`Naikkan urutan ${name}`}
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
        aria-label={`Turunkan urutan ${name}`}
        title="Turunkan urutan"
      >
        <ArrowDown />
      </Button>
    </div>
  )
}

export { ReorderChurchCouncilMemberButtons }
