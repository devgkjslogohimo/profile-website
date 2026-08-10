const WIB_OFFSET_MINUTES = 7 * 60

function createScheduleDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number)

  return new Date(Date.UTC(year, month - 1, day))
}

function combineScheduleDateAndWibTime(scheduleDate: Date, time: string): Date {
  const [hour, minute] = time.split(":").map(Number)

  return new Date(
    Date.UTC(
      scheduleDate.getUTCFullYear(),
      scheduleDate.getUTCMonth(),
      scheduleDate.getUTCDate(),
      hour,
      minute - WIB_OFFSET_MINUTES,
      0,
      0
    )
  )
}

function getWibTime(value: Date): string {
  const wibDate = new Date(value.getTime() + WIB_OFFSET_MINUTES * 60 * 1000)

  const hour = String(wibDate.getUTCHours()).padStart(2, "0")
  const minute = String(wibDate.getUTCMinutes()).padStart(2, "0")

  return `${hour}:${minute}`
}

function moveDateTimeToScheduleDate(value: Date, scheduleDate: Date): Date {
  return combineScheduleDateAndWibTime(scheduleDate, getWibTime(value))
}

export { combineScheduleDateAndWibTime, createScheduleDate, getWibTime, moveDateTimeToScheduleDate }
