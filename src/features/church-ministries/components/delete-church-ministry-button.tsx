"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

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
import { deleteChurchMinistry } from "@/features/church-ministries/actions/delete-church-ministry"

type DeleteChurchMinistryButtonProps = {
  id: string
  name: string
}

function DeleteChurchMinistryButton({ id, name }: DeleteChurchMinistryButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteChurchMinistry(id)

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

      router.refresh()
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button type="button" variant="outline" size="sm" disabled={pending} />}
      >
        <Trash2 />
        Hapus
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus pelayanan?</AlertDialogTitle>

          <AlertDialogDescription>
            {name} akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
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
            {pending ? "Menghapus..." : "Hapus Permanen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteChurchMinistryButton }
