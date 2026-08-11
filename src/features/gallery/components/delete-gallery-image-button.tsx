"use client"

import { Trash2 } from "lucide-react"
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
import { deleteGalleryImage } from "@/features/gallery/actions/delete-gallery-image"

type DeleteGalleryImageButtonProps = {
  id: string
  label: string
}

function DeleteGalleryImageButton({ id, label }: DeleteGalleryImageButtonProps) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteGalleryImage(id)

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
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button type="button" variant="destructive" size="sm" disabled={pending} />}
      >
        <Trash2 />
        Hapus
      </AlertDialogTrigger>

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus foto galeri?</AlertDialogTitle>

          <AlertDialogDescription>
            {label} akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Batal</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={pending}
            className={buttonVariants({
              variant: "destructive",
            })}
          >
            <Trash2 />
            {pending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteGalleryImageButton }
