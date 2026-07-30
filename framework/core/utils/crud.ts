export function normalizeId(value: any): number | string | null {
  if (value == null || value === "") return null

  const raw = value?.value ?? value?.id ?? value
  const n = Number(raw)

  return Number.isFinite(n) ? n : String(raw)
}

export function getRowLabel(row: any, fallback = "Data") {
  return row?.name ?? row?.title ?? row?.username ?? row?.code ?? fallback
}

export function buildOrdering(key: string | null, dir: "asc" | "desc" | null) {
  if (!key || !dir) return null
  return `${dir === "desc" ? "-" : ""}${key}`
}