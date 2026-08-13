"use client"

import { type UseFormReturn, useWatch } from "react-hook-form"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ChurchCouncilMemberFormInput } from "@/features/church-councils/schemas/church-council-member-schema"

type ChurchCouncilLocationOption = {
  id: string
  name: string
  type: "CHURCH" | "PEPANTHAN"
  isActive?: boolean
}

type ChurchCouncilMemberFormFieldsProps = {
  form: UseFormReturn<ChurchCouncilMemberFormInput>
  pending: boolean
  editMode?: boolean
  locations: ChurchCouncilLocationOption[]
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [
    {
      message,
    },
  ]
}

function ChurchCouncilMemberFormFields({
  form,
  pending,
  editMode = false,
  locations,
}: ChurchCouncilMemberFormFieldsProps) {
  const {
    register,
    formState: { errors },
  } = form

  const fullName = useWatch({
    control: form.control,
    name: "fullName",
  })

  const photoUrl = useWatch({
    control: form.control,
    name: "photoUrl",
  })

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="fullName">Nama anggota Majelis</FieldLabel>

        <Input
          id="fullName"
          {...register("fullName")}
          placeholder="Contoh: Nama Lengkap"
          disabled={pending}
          aria-invalid={Boolean(errors.fullName)}
        />

        <FieldDescription>Masukkan nama lengkap anggota Majelis.</FieldDescription>

        <FieldError errors={getFieldError(errors.fullName?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="churchLocationId">Lokasi Pelayanan</FieldLabel>

        <select
          id="churchLocationId"
          {...register("churchLocationId")}
          disabled={pending}
          aria-invalid={Boolean(errors.churchLocationId)}
          className="flex h-10 w-full rounded-xl border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20"
        >
          <option value="">Pilih lokasi pelayanan</option>

          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
              {location.type === "PEPANTHAN" ? " — Pepanthan" : " — Gereja"}
              {location.isActive === false ? " — Nonaktif" : ""}
            </option>
          ))}
        </select>

        <FieldDescription>
          Pilih gereja atau Pepanthan tempat anggota Majelis melayani.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.churchLocationId?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="position">Jabatan</FieldLabel>

        <Input
          id="position"
          {...register("position")}
          placeholder="Contoh: Ketua Majelis, Penatua, Diaken"
          disabled={pending}
          aria-invalid={Boolean(errors.position)}
        />

        <FieldDescription>
          Jabatan disimpan sebagai teks karena susunan dan penyebutannya dapat berbeda antaranggota.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.position?.message)} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="periodStart">Periode mulai</FieldLabel>

          <Input
            id="periodStart"
            type="date"
            {...register("periodStart")}
            disabled={pending}
            aria-invalid={Boolean(errors.periodStart)}
          />

          <FieldDescription>Tanggal mulai pelayanan anggota Majelis.</FieldDescription>

          <FieldError errors={getFieldError(errors.periodStart?.message)} />
        </Field>

        <Field>
          <FieldLabel htmlFor="periodEnd">Periode selesai</FieldLabel>

          <Input
            id="periodEnd"
            type="date"
            {...register("periodEnd")}
            disabled={pending}
            aria-invalid={Boolean(errors.periodEnd)}
          />

          <FieldDescription>
            Opsional. Kosongkan jika anggota masih melayani sampai sekarang.
          </FieldDescription>

          <FieldError errors={getFieldError(errors.periodEnd?.message)} />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="photoUrl">Link foto</FieldLabel>

        <Input
          id="photoUrl"
          type="url"
          {...register("photoUrl")}
          placeholder="https://drive.google.com/..."
          disabled={pending}
          aria-invalid={Boolean(errors.photoUrl)}
        />

        <FieldDescription>
          Opsional. Gunakan link file Google Drive dan pastikan akses file diatur ke &quot;Siapa
          saja yang memiliki link&quot;.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.photoUrl?.message)} />

        {photoUrl ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {editMode ? "Preview foto terbaru" : "Preview foto"}
            </p>

            <GoogleDriveImage
              url={photoUrl}
              alt={fullName ? `Preview foto ${fullName}` : "Preview foto anggota Majelis"}
              className="max-w-xl"
            />
          </div>
        ) : null}
      </Field>
    </FieldGroup>
  )
}

export { ChurchCouncilMemberFormFields }
