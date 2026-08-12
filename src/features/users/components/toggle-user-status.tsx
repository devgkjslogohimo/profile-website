"use client"

import { UserCheck, UserX } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { toggleUser } from "@/features/users/actions/toggle-user"

type ToggleUserStatusProps = {
  id: string
  name: string
  isActive: boolean
  isCurrentUser: boolean
}

function ToggleUserStatus({ id, name, isActive, isCurrentUser }: ToggleUserStatusProps) {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  if (isCurrentUser) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled
        title="Akun yang sedang digunakan tidak dapat dinonaktifkan."
      >
        <UserX />
        Nonaktifkan
      </Button>
    )
  }

  const nextIsActive = !isActive

  function handleStatusChange() {
    startTransition(async () => {
      const result = await toggleUser(id, nextIsActive)

      if (result.status === "success") {
        toast.add({
          title: "Berhasil",
          description: result.message,
          type: "success",
        })

        setOpen(false)
        router.refresh()

        return
      }

      toast.add({
        title: "Gagal",
        description: result.message,
        type: "error",
      })

      setOpen(false)
      router.refresh()
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button type="button" variant="outline" size="sm" disabled={pending} />}
      >
        {isActive ? <UserX /> : <UserCheck />}

        {isActive ? "Nonaktifkan" : "Aktifkan"}
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActive ? "Nonaktifkan pengguna?" : "Aktifkan pengguna?"}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {isActive
              ? `Akun ${name} tidak dapat login setelah dinonaktifkan. Seluruh sesi lama akun ini juga akan dicabut.`
              : `Akun ${name} akan dapat kembali login menggunakan password yang tersimpan. Sesi lama yang sebelumnya dicabut tidak akan aktif kembali.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Batal</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({
              variant: isActive ? "destructive" : "default",
            })}
            disabled={pending}
            onClick={handleStatusChange}
          >
            {pending ? "Memproses..." : isActive ? "Nonaktifkan" : "Aktifkan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { ToggleUserStatus }
