"use client"

import { useActionState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toggleChurchMinistry } from "@/features/church-ministries/actions/toggle-church-ministry"
import { initialToggleChurchMinistryActionState } from "@/features/church-ministries/lib/toggle-action-state"

type ToggleChurchMinistryStatusProps = {
  id: string
  name: string
  isActive: boolean
}

function ToggleChurchMinistryStatus({ id, name, isActive }: ToggleChurchMinistryStatusProps) {
  const toggleAction = toggleChurchMinistry.bind(null, id)

  const [state, formAction, pending] = useActionState(
    toggleAction,
    initialToggleChurchMinistryActionState
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

export { ToggleChurchMinistryStatus }
