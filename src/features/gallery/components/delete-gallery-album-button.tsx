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
import { deleteGalleryAlbum } from "@/features/gallery/actions/delete-gallery-album"

type DeleteGalleryAlbumButtonProps = {
  id: string
  title: string
}

function DeleteGalleryAlbumButton({ id, title }: DeleteGalleryAlbumButtonProps) {
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteGalleryAlbum(id)

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
          <AlertDialogTitle>Hapus album galeri?</AlertDialogTitle>

          <AlertDialogDescription>
            Album {title} akan dihapus secara permanen. Album hanya dapat dihapus jika sudah
            nonaktif dan tidak mempunyai foto.
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

export { DeleteGalleryAlbumButton }
