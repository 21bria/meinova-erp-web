export type UserRole = "SYSTEM" | "MANAGEMENT" | "VIEWER" | "USER"

export function normalizeRole(v: unknown): UserRole {
  const raw = String(v ?? "").trim().toUpperCase()

  if (raw === "SYSTEM") return "SYSTEM"
  if (raw === "MANAGEMENT") return "MANAGEMENT"
  if (raw === "VIEWER") return "VIEWER"
  if (raw === "USER") return "USER"

  if (raw === "SUPER_ADMIN" || raw === "SUPERADMIN" || raw === "ADMIN") {
    return "SYSTEM"
  }

  return "USER"
}