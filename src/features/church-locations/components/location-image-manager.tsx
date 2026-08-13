"use client"

import { ArrowDown, ArrowUp, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useTransition } from "react"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
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
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import { createLocationImage } from "@/features/church-locations/actions/create-location-image"
import { deleteLocationImage } from "@/features/church-locations/actions/delete-location-image"
import {
  reorderLocationImage,
  type ReorderLocationImageDirection,
} from "@/features/church-locations/actions/reorder-location-image"
import { toggleLocationImage } from "@/features/church-locations/actions/toggle-location-image"
import { updateLocationImage } from "@/features/church-locations/actions/update-location-image"
import { initialLocationImageActionState } from "@/features/church-locations/lib/location-media-action-state"

type LocationImageItem = {
  id: string
  imageUrl: string
  caption: string | null
  altText: string
  sortOrder: number
  isActive: boolean
}

type LocationImageManagerProps = {
  location: {
    id: string
    name: string
  }

  images: LocationImageItem[]
}

function LocationImageCreateForm({
  location,
}: {
  location: LocationImageManagerProps["location"]
}) {
  const router = useRouter()

  const action = createLocationImage.bind(null, location.id)

  const [state, formAction, pending] = useActionState(action, initialLocationImageActionState)

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })

      router.refresh()

      return
    }

    if (state.status === "error" && Object.keys(state.fieldErrors).length === 0) {
      toast.add({
        title: "Gagal",
        description: state.message,
        type: "error",
      })
    }
  }, [router, state])

  return (
    <form key={state.submissionId} action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="locationImageUrl">Link Foto Google Drive</FieldLabel>

          <Input
            id="locationImageUrl"
            name="imageUrl"
            type="url"
            placeholder="https://drive.google.com/file/d/..."
            aria-invalid={Boolean(state.fieldErrors.imageUrl)}
          />

          <FieldError
            errors={state.fieldErrors.imageUrl?.map((message) => ({
              message,
            }))}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="locationImageCaption">Caption</FieldLabel>

          <Input
            id="locationImageCaption"
            name="caption"
            placeholder="Contoh: Ruang ibadah utama"
            aria-invalid={Boolean(state.fieldErrors.caption)}
          />

          <FieldDescription>
            Opsional. Alt Text akan dibuat otomatis dari caption dan nama lokasi.
          </FieldDescription>

          <FieldError
            errors={state.fieldErrors.caption?.map((message) => ({
              message,
            }))}
          />
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Foto"}
      </Button>
    </form>
  )
}

function LocationImageCard({
  image,
  locationName,
  canMoveUp,
  canMoveDown,
}: {
  image: LocationImageItem
  locationName: string
  canMoveUp: boolean
  canMoveDown: boolean
}) {
  const router = useRouter()
  const [pendingAction, startTransition] = useTransition()

  const updateAction = updateLocationImage.bind(null, image.id)

  const [state, formAction, pendingUpdate] = useActionState(
    updateAction,
    initialLocationImageActionState
  )

  useEffect(() => {
    if (state.status === "success") {
      toast.add({
        title: "Berhasil",
        description: state.message,
        type: "success",
      })

      router.refresh()

      return
    }

    if (state.status === "error" && Object.keys(state.fieldErrors).length === 0) {
      toast.add({
        title: "Gagal",
        description: state.message,
        type: "error",
      })
    }
  }, [router, state])

  function runAction(
    action: () => Promise<{
      success: boolean
      message: string
    }>
  ) {
    startTransition(async () => {
      const result = await action()

      toast.add({
        title: result.success ? "Berhasil" : "Gagal",
        description: result.message,
        type: result.success ? "success" : "error",
      })

      if (result.success) {
        router.refresh()
      }
    })
  }

  function move(direction: ReorderLocationImageDirection) {
    runAction(() => reorderLocationImage(image.id, direction))
  }

  const disabled = pendingAction || pendingUpdate

  return (
    <div className="rounded-xl border p-4">
      <GoogleDriveImage url={image.imageUrl} alt={image.altText} />

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium">{image.caption || "Tanpa caption"}</p>

          <p className="mt-1 text-xs text-muted-foreground">Alt otomatis: {image.altText}</p>
        </div>

        <Badge variant={image.isActive ? "secondary" : "outline"}>
          {image.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canMoveUp || disabled}
          aria-label={`Naikkan ${image.caption || locationName}`}
          onClick={() => move("up")}
        >
          <ArrowUp />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={!canMoveDown || disabled}
          aria-label={`Turunkan ${image.caption || locationName}`}
          onClick={() => move("down")}
        >
          <ArrowDown />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => runAction(() => toggleLocationImage(image.id))}
        >
          {image.isActive ? "Nonaktifkan" : "Aktifkan"}
        </Button>

        {!image.isActive ? (
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button type="button" variant="outline" size="sm" disabled={disabled} />}
            >
              <Trash2 />
              Hapus
            </AlertDialogTrigger>

            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus foto lokasi?</AlertDialogTitle>

                <AlertDialogDescription>
                  Foto akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>

                <AlertDialogAction
                  className={buttonVariants({
                    variant: "destructive",
                  })}
                  onClick={() => runAction(() => deleteLocationImage(image.id))}
                >
                  Hapus Permanen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
      </div>

      <details className="mt-4 border-t pt-4">
        <summary className="cursor-pointer list-none text-sm font-medium [&::-webkit-details-marker]:hidden">
          Edit Foto
        </summary>

        <form action={formAction} className="mt-4 space-y-4 rounded-xl bg-muted/30 p-4">
          <Field>
            <FieldLabel htmlFor={`imageUrl-${image.id}`}>Link Foto Google Drive</FieldLabel>

            <Input
              id={`imageUrl-${image.id}`}
              name="imageUrl"
              type="url"
              defaultValue={image.imageUrl}
              aria-invalid={Boolean(state.fieldErrors.imageUrl)}
            />

            <FieldError
              errors={state.fieldErrors.imageUrl?.map((message) => ({
                message,
              }))}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={`caption-${image.id}`}>Caption</FieldLabel>

            <Input
              id={`caption-${image.id}`}
              name="caption"
              defaultValue={image.caption ?? ""}
              placeholder="Contoh: Tampak depan gereja"
              aria-invalid={Boolean(state.fieldErrors.caption)}
            />

            <FieldDescription>
              Alt Text diperbarui otomatis setelah caption disimpan.
            </FieldDescription>

            <FieldError
              errors={state.fieldErrors.caption?.map((message) => ({
                message,
              }))}
            />
          </Field>

          <Button type="submit" size="sm" disabled={disabled}>
            {pendingUpdate ? "Menyimpan..." : "Simpan Foto"}
          </Button>
        </form>
      </details>
    </div>
  )
}

function LocationImageManager({ location, images }: LocationImageManagerProps) {
  const activeCount = images.filter((image) => image.isActive).length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Total Foto</p>

          <p className="mt-1 text-2xl font-semibold">{images.length}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Aktif</p>

          <p className="mt-1 text-2xl font-semibold">{activeCount}</p>
        </div>

        <div className="rounded-xl border p-4">
          <p className="text-sm text-muted-foreground">Nonaktif</p>

          <p className="mt-1 text-2xl font-semibold">{images.length - activeCount}</p>
        </div>
      </div>

      <details className="rounded-xl border">
        <summary className="cursor-pointer list-none px-5 py-4 font-medium [&::-webkit-details-marker]:hidden">
          + Tambah Foto
        </summary>

        <div className="border-t p-5">
          <LocationImageCreateForm location={location} />
        </div>
      </details>

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm font-medium">Belum ada koleksi foto</p>

          <p className="mt-1 text-sm text-muted-foreground">
            Tambahkan foto untuk menunjukkan kondisi gereja atau pepanthan.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {images.map((image, index) => (
            <LocationImageCard
              key={image.id}
              image={image}
              locationName={location.name}
              canMoveUp={index > 0}
              canMoveDown={index < images.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { LocationImageManager }
