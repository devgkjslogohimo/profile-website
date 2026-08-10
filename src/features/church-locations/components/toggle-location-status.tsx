"use client"

import { useActionState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toggleChurchLocation } from "@/features/church-locations/actions/toggle-church-location"
import { initialToggleChurchLocationActionState } from "@/features/church-locations/lib/toggle-action-state"

type ToggleLocationStatusProps = {
  id: string
  name: string
  isActive: boolean
}

function ToggleLocationStatus({ id, name, isActive }: ToggleLocationStatusProps) {
  const toggleAction = toggleChurchLocation.bind(null, id)

  const [state, formAction, pending] = useActionState(
    toggleAction,
    initialToggleChurchLocationActionState
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
        aria-label={isActive ? `Nonaktifkan ${name}` : `Aktifkan ${name}`}
      >
        {pending ? "Memproses..." : isActive ? "Nonaktifkan" : "Aktifkan"}
      </Button>
    </form>
  )
}

export { ToggleLocationStatus }
