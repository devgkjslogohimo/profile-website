const WIB_OFFSET_MINUTES = 7 * 60

function getWibTodayDate(value = new Date()) {
  const wibDate = new Date(value.getTime() + WIB_OFFSET_MINUTES * 60 * 1000)

  return new Date(Date.UTC(wibDate.getUTCFullYear(), wibDate.getUTCMonth(), wibDate.getUTCDate()))
}

export { getWibTodayDate }
