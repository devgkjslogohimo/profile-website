const JAKARTA_TIME_ZONE = "Asia/Jakarta"

function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10)
}

function getCurrentJakartaDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: JAKARTA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date())

  const year = parts.find((part) => part.type === "year")?.value
  const month = parts.find((part) => part.type === "month")?.value
  const day = parts.find((part) => part.type === "day")?.value

  return `${year}-${month}-${day}`
}

function isCurrentChurchPastorPeriod(periodStart: Date, periodEnd: Date | null) {
  const today = getCurrentJakartaDate()
  const start = formatDateOnly(periodStart)
  const end = periodEnd ? formatDateOnly(periodEnd) : null

  return start <= today && (!end || end >= today)
}

export { isCurrentChurchPastorPeriod }
