"use client"

import { useActionState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toggleWorshipServiceRole } from "@/features/worship-service-roles/actions/toggle-worship-service-role"
import { initialToggleWorshipServiceRoleActionState } from "@/features/worship-service-roles/lib/toggle-action-state"

type ToggleRoleStatusProps = {
  id: string
  name: string
  isActive: boolean
}

function ToggleRoleStatus({ id, name, isActive }: ToggleRoleStatusProps) {
  const toggleAction = toggleWorshipServiceRole.bind(null, id)

  const [state, formAction, pending] = useActionState(
    toggleAction,
    initialToggleWorshipServiceRoleActionState
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

export { ToggleRoleStatus }
