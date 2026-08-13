const WIB_OFFSET_MINUTES = 7 * 60

const AGENDA_DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/

function isValidAgendaDateTime(value: string): boolean {
  const match = value.match(AGENDA_DATE_TIME_PATTERN)

  if (!match) {
    return false
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4])
  const minute = Number(match[5])

  const date = new Date(Date.UTC(year, month - 1, day, hour, minute))

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day &&
    date.getUTCHours() === hour &&
    date.getUTCMinutes() === minute
  )
}

function createAgendaDateTime(value: string): Date {
  const match = value.match(AGENDA_DATE_TIME_PATTERN)

  if (!match) {
    throw new Error("Format tanggal dan waktu agenda tidak valid.")
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4])
  const minute = Number(match[5])

  return new Date(Date.UTC(year, month - 1, day, hour, minute - WIB_OFFSET_MINUTES, 0, 0))
}

function getAgendaDateTimeInputValue(value: Date): string {
  const wibDate = new Date(value.getTime() + WIB_OFFSET_MINUTES * 60 * 1000)

  const year = wibDate.getUTCFullYear()
  const month = String(wibDate.getUTCMonth() + 1).padStart(2, "0")
  const day = String(wibDate.getUTCDate()).padStart(2, "0")
  const hour = String(wibDate.getUTCHours()).padStart(2, "0")
  const minute = String(wibDate.getUTCMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hour}:${minute}`
}

export { createAgendaDateTime, getAgendaDateTimeInputValue, isValidAgendaDateTime }
