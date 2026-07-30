export function formatDate(val?: string | null) {
  if (!val) return "-"

  const date = new Date(val)

  if (isNaN(date.getTime())) return "-"

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatDateTime(val?: string | null) {
  if (!val) return "-"

  const date = new Date(val)

  if (isNaN(date.getTime())) return "-"

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}