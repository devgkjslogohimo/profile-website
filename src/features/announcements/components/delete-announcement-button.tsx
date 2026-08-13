"use client"

import { Trash2 } from "lucide-react"
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
import { deleteAnnouncement } from "@/features/announcements/actions/delete-announcement"

type DeleteAnnouncementButtonProps = {
  id: string
  title: string
  redirectAfterDelete?: boolean
}

function DeleteAnnouncementButton({
  id,
  title,
  redirectAfterDelete = false,
}: DeleteAnnouncementButtonProps) {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAnnouncement(id)

      if (result.status === "error") {
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

      setOpen(false)

      if (redirectAfterDelete) {
        router.push("/admin/pengumuman")
        router.refresh()

        return
      }

      router.refresh()
    })
  }

  function handleOpenChange(nextOpen: boolean) {
    if (pending) {
      return
    }

    setOpen(nextOpen)
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger
        render={<Button type="button" variant="destructive" size="sm" disabled={pending} />}
      >
        <Trash2 />
        Hapus
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus pengumuman?</AlertDialogTitle>

          <AlertDialogDescription>
            {title} akan dihapus permanen dari sistem. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Batal</AlertDialogCancel>

          <AlertDialogAction
            className={buttonVariants({
              variant: "destructive",
            })}
            disabled={pending}
            onClick={handleDelete}
          >
            {pending ? "Menghapus..." : "Hapus Pengumuman"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteAnnouncementButton }
