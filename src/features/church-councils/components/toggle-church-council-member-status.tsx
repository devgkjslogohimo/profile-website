"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toggleChurchCouncilMember } from "@/features/church-councils/actions/toggle-church-council-member"

type ToggleChurchCouncilMemberStatusProps = {
  id: string
  name: string
  isActive: boolean
}

function ToggleChurchCouncilMemberStatus({
  id,
  name,
  isActive,
}: ToggleChurchCouncilMemberStatusProps) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleChurchCouncilMember(id)

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
      aria-label={isActive ? `Nonaktifkan ${name}` : `Aktifkan ${name}`}
    >
      {pending ? "Memproses..." : isActive ? "Nonaktifkan" : "Aktifkan"}
    </Button>
  )
}

export { ToggleChurchCouncilMemberStatus }
