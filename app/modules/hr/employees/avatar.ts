/*
|--------------------------------------------------------------------------
| Foto pegawai — dari payload ke avatar
|--------------------------------------------------------------------------
|
| Satu tempat yang membaca `avatar_display` dari baris pegawai, dipakai
| daftar (`columns.ts` → `MIdentityCell`) dan kepala halaman
| (`EmployeeAvatar.vue`). Urutan fotonya sendiri — `avatar_file` →
| `avatar` lama → inisial — **tidak** ditulis di sini: backend yang
| memutuskannya (`resolve_employee_avatar`), dan yang disalin ke
| frontend adalah cara dua layar mulai menampilkan foto berbeda untuk
| orang yang sama.
|
| Self Service tidak lewat sini dan memang tidak boleh: fotonya dilayani
| `/api/me/avatar/`, yang dijaga identitas, bukan izin HR.
*/

import type { EmployeeAvatarDisplay } from "./types"

type EmployeeLike = {
  full_name?: string | null
  display_name?: string | null
  first_name?: string | null
  last_name?: string | null
  avatar_display?: EmployeeAvatarDisplay | null
}

export type EmployeeAvatarProps = {
  /** Alamat `preview/` berautentikasi, atau `null` → inisial. */
  src: string | null
  name: string | null
  initials: string | null
}

/**
 * Nama utuh pegawai, dari apa pun yang ada di baris itu.
 *
 * `full_name` dikirim serializer, tapi baris yang datang dari payload
 * lain (hasil aksi massal, baris yang sebagian fieldnya disaring
 * policy) bisa hanya membawa nama depan + belakang.
 */
export function employeeName(
  row: EmployeeLike | null | undefined,
): string {
  if (!row)
    return ""

  const full = (row.full_name ?? "").trim()

  if (full)
    return full

  return [row.first_name, row.last_name]
    .filter(Boolean)
    .join(" ")
    .trim()
}

export function employeeAvatar(
  row: EmployeeLike | null | undefined,
): EmployeeAvatarProps {
  const display = row?.avatar_display ?? null

  const src = (display?.url ?? "").trim()

  return {
    src: src || null,
    name: employeeName(row) || null,
    initials: display?.initials ?? null,
  }
}
