export function normalizeDateInput(value: string): string {
  const raw = value.trim()
  if (!raw) return ""

  const parts = raw.split(/[.\-/]/).filter(Boolean)
  if (parts.length !== 3) return raw

  let [d, m, y] = parts

  if (y.length === 2) {
    y = Number(y) >= 70 ? `19${y}` : `20${y}`
  }

  d = d.padStart(2, "0")
  m = m.padStart(2, "0")

  return `${y}-${m}-${d}`
}