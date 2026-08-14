"use client"

import { useState } from "react"
import { FiEye, FiFileText } from "react-icons/fi"

type PawartosPdfPreviewProps = {
  previewUrl: string
  title: string
}

function PawartosPdfPreview({ previewUrl, title }: PawartosPdfPreviewProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <section aria-labelledby="preview-pawartos" className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 id="preview-pawartos" className="font-heading text-xl font-medium">
          Preview Pawartos
        </h2>

        <p className="hidden text-xs text-muted-foreground sm:block">
          Preview dimuat saat diperlukan untuk menghemat data.
        </p>
      </div>

      {isLoaded ? (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted/20">
          <iframe
            id="pawartos-pdf-frame"
            src={previewUrl}
            title={`Preview ${title}`}
            loading="lazy"
            className="h-[72vh] min-h-128 w-full"
          />
        </div>
      ) : (
        <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-border/70 bg-muted/20 px-6 py-10 text-center sm:min-h-64">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FiFileText aria-hidden="true" className="size-5" />
          </div>

          <p className="mt-4 font-medium text-foreground">Preview dokumen belum dimuat</p>

          <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
            Tampilkan dokumen Pawartos di halaman ini apabila Anda ingin membacanya tanpa membuka
            tab baru.
          </p>

          <button
            type="button"
            aria-expanded={isLoaded}
            aria-controls="pawartos-pdf-frame"
            onClick={() => setIsLoaded(true)}
            className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <FiEye aria-hidden="true" className="size-4" />
            Tampilkan Preview
          </button>
        </div>
      )}
    </section>
  )
}

export { PawartosPdfPreview }
