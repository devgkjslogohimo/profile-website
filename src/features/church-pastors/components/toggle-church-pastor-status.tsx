"use client"

import { useTransition } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toggleChurchPastor } from "@/features/church-pastors/actions/toggle-church-pastor"

type ToggleChurchPastorStatusProps = {
  id: string
  name: string
  isActive: boolean
}

function ToggleChurchPastorStatus({ id, name, isActive }: ToggleChurchPastorStatusProps) {
  const [pending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleChurchPastor(id)

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

export { ToggleChurchPastorStatus }
