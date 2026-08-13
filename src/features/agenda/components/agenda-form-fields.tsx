"use client"

import type { UseFormReturn } from "react-hook-form"
import { Controller } from "react-hook-form"

import { GoogleDriveImage } from "@/components/media/google-drive-image"
import { RichTextEditor } from "@/components/rich-text-editor/rich-text-editor"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { AgendaFormInput } from "@/features/agenda/schemas/agenda-schema"

type AgendaFormFieldsProps = {
  form: UseFormReturn<AgendaFormInput>
  pending: boolean
}

function getFieldError(message: unknown) {
  if (typeof message !== "string") {
    return undefined
  }

  return [{ message }]
}

function AgendaFormFields({ form, pending }: AgendaFormFieldsProps) {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = form

  const title = watch("title")
  const coverImageUrl = watch("coverImageUrl")

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="title">Judul Agenda</FieldLabel>

        <Input
          id="title"
          {...register("title")}
          placeholder="Contoh: Perayaan HUT GKJ Slogohimo"
          disabled={pending}
          aria-invalid={Boolean(errors.title)}
        />

        <FieldDescription>Judul digunakan untuk membuat slug halaman agenda.</FieldDescription>

        <FieldError errors={getFieldError(errors.title?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="excerpt">Ringkasan</FieldLabel>

        <Textarea
          id="excerpt"
          rows={4}
          {...register("excerpt")}
          placeholder="Tuliskan ringkasan singkat agenda yang akan tampil pada daftar agenda."
          disabled={pending}
          aria-invalid={Boolean(errors.excerpt)}
        />

        <FieldDescription>
          Wajib. 10–500 karakter. Ringkasan nantinya dapat digunakan sebagai description SEO.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.excerpt?.message)} />
      </Field>

      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="startsAt">Mulai</FieldLabel>

          <Input
            id="startsAt"
            type="datetime-local"
            step={60}
            {...register("startsAt")}
            disabled={pending}
            aria-invalid={Boolean(errors.startsAt)}
          />

          <FieldDescription>Wajib. Tanggal dan waktu agenda menggunakan WIB.</FieldDescription>

          <FieldError errors={getFieldError(errors.startsAt?.message)} />
        </Field>

        <Field>
          <FieldLabel htmlFor="endsAt">Selesai</FieldLabel>

          <Input
            id="endsAt"
            type="datetime-local"
            step={60}
            {...register("endsAt")}
            disabled={pending}
            aria-invalid={Boolean(errors.endsAt)}
          />

          <FieldDescription>
            Opsional. Waktu selesai tidak boleh lebih awal dari waktu mulai.
          </FieldDescription>

          <FieldError errors={getFieldError(errors.endsAt?.message)} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="location">Lokasi</FieldLabel>

          <Input
            id="location"
            {...register("location")}
            placeholder="Contoh: GKJ Slogohimo"
            disabled={pending}
            aria-invalid={Boolean(errors.location)}
          />

          <FieldDescription>
            Opsional. Agenda dapat dilaksanakan di gereja, pepanthan, rumah jemaat, atau lokasi
            lainnya.
          </FieldDescription>

          <FieldError errors={getFieldError(errors.location?.message)} />
        </Field>

        <Field>
          <FieldLabel htmlFor="googleMapsUrl">Google Maps</FieldLabel>

          <Input
            id="googleMapsUrl"
            type="url"
            {...register("googleMapsUrl")}
            placeholder="https://maps.google.com/..."
            disabled={pending}
            aria-invalid={Boolean(errors.googleMapsUrl)}
          />

          <FieldDescription>
            Opsional. Masukkan link Google Maps jika lokasi perlu ditampilkan pada website.
          </FieldDescription>

          <FieldError errors={getFieldError(errors.googleMapsUrl?.message)} />
        </Field>
      </div>

      <Field>
        <FieldLabel>Isi Agenda</FieldLabel>

        <Controller
          control={control}
          name="content"
          render={({ field, fieldState }) => (
            <RichTextEditor
              value={field.value}
              onChange={field.onChange}
              disabled={pending}
              invalid={Boolean(fieldState.error)}
            />
          )}
        />

        <FieldDescription>
          Gunakan Heading 2/3, bold, italic, daftar, kutipan, dan link seperlunya untuk menjelaskan
          agenda.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.content?.message)} />
      </Field>

      <Field>
        <FieldLabel htmlFor="coverImageUrl">Cover Agenda</FieldLabel>

        <Input
          id="coverImageUrl"
          type="url"
          {...register("coverImageUrl")}
          placeholder="https://drive.google.com/file/d/..."
          disabled={pending}
          aria-invalid={Boolean(errors.coverImageUrl)}
        />

        <FieldDescription>
          Opsional. Gunakan link file gambar Google Drive. Agenda tetap dapat dipublikasikan tanpa
          cover.
        </FieldDescription>

        <FieldError errors={getFieldError(errors.coverImageUrl?.message)} />

        {coverImageUrl ? (
          <div className="space-y-2">
            <p className="text-sm font-medium">Preview cover</p>

            <GoogleDriveImage
              url={coverImageUrl}
              alt={title ? `Preview cover ${title}` : "Preview cover agenda"}
              className="max-w-2xl"
            />
          </div>
        ) : null}
      </Field>
    </FieldGroup>
  )
}

export { AgendaFormFields }
