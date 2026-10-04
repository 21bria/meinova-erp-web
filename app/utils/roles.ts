/*
 * Dua kosakata peran yang selama ini berdampingan, dan yang satu tidak
 * pernah dituliskan di sini.
 *
 * Seluruh modul hasil generate memakai lima nilai (`GLOBAL_VIEWER` dan
 * `SITE_USER` ikut), sementara tipe kanoniknya cuma memuat empat —
 * jadi setiap `columns.ts` membawa error TS2367 "no overlap" yang tidak
 * menandakan apa pun: 134 error, satu bunyi. Yang salah tipenya, bukan
 * pemakainya.
 *
 * `normalizeRole` sengaja **tidak** diperlebar: ia menerjemahkan nilai
 * dari server, dan server tidak pernah mengirim kedua nama itu. Yang
 * memakainya adalah nilai bawaan di komponen (`opts.role ?? "SITE_USER"`).
 */
export type UserRole =
  | "SYSTEM"
  | "MANAGEMENT"
  | "GLOBAL_VIEWER"
  | "VIEWER"
  | "SITE_USER"
  | "USER"

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