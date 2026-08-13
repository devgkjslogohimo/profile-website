type WorshipLanguage = "JAVANESE" | "INDONESIAN"

type WorshipLanguageInput = "AUTO" | WorshipLanguage

function getWorshipWeekNumber(date: Date): number {
  return Math.floor((date.getUTCDate() - 1) / 7) + 1
}

function getDefaultWorshipLanguage(date: Date): WorshipLanguage {
  const weekNumber = getWorshipWeekNumber(date)

  return weekNumber % 2 === 1 ? "JAVANESE" : "INDONESIAN"
}

function resolveWorshipLanguage(date: Date, override: WorshipLanguage | null): WorshipLanguage {
  return override ?? getDefaultWorshipLanguage(date)
}

function getWorshipLanguageLabel(language: WorshipLanguage): string {
  switch (language) {
    case "JAVANESE":
      return "Bahasa Jawa"

    case "INDONESIAN":
      return "Bahasa Indonesia"
  }
}

export {
  getDefaultWorshipLanguage,
  getWorshipLanguageLabel,
  getWorshipWeekNumber,
  resolveWorshipLanguage,
}

export type { WorshipLanguage, WorshipLanguageInput }
