type CreateMediaAltTextOptions = {
  subjectName: string
  caption?: string | null
  variant?: "cover" | "image"
}

function createMediaAltText({
  subjectName,
  caption,
  variant = "image",
}: CreateMediaAltTextOptions): string {
  const normalizedSubject = subjectName.trim()
  const normalizedCaption = caption?.trim()

  if (normalizedCaption) {
    return `${normalizedCaption} - ${normalizedSubject}`
  }

  if (variant === "cover") {
    return `Foto utama ${normalizedSubject}`
  }

  return `Foto ${normalizedSubject}`
}

export { createMediaAltText }

export type { CreateMediaAltTextOptions }
