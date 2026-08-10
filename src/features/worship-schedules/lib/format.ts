const scheduleDateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

function formatScheduleDate(value: Date): string {
  return scheduleDateFormatter.format(value)
}

function getScheduleDateInputValue(value: Date): string {
  const year = value.getUTCFullYear()
  const month = String(value.getUTCMonth() + 1).padStart(2, "0")
  const day = String(value.getUTCDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const publishedAtFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
})

function formatPublishedAt(value: Date): string {
  return publishedAtFormatter.format(value)
}

export { formatPublishedAt, formatScheduleDate, getScheduleDateInputValue }
