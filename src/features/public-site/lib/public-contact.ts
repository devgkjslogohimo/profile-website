function createTelHref(value: string | null): string | null {
  if (!value) {
    return null
  }

  const normalized = value.replace(/[^\d+]/g, "")

  if (!normalized) {
    return null
  }

  return `tel:${normalized}`
}

function createWhatsAppHref(value: string | null): string | null {
  if (!value) {
    return null
  }

  const digits = value.replace(/\D/g, "")

  if (!digits) {
    return null
  }

  return `https://wa.me/${digits}`
}

export { createTelHref, createWhatsAppHref }
