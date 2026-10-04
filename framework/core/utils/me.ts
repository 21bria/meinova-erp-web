/**
 * Penanda `$me.<jalur>` di schema, dibaca dari profil pengguna.
 *
 * Dipakai dua tempat yang harus sepakat: `MFormBuilder` (untuk
 * `default`, `visible_when`, `readonly_when`) dan `MDashboardFilters`
 * (untuk tombol pintas "Lokasi Saya"). Dulu resolvernya hanya ada di
 * yang pertama, dan menyalinnya ke yang kedua adalah persis cara dua
 * pembaca dialek yang sama diam-diam berbeda — kesalahan yang sudah
 * terjadi sekali di repo ini dengan `resolveLookupParams`.
 *
 * Jalur yang tidak ketemu mengembalikan `undefined`, **bukan** `null`.
 * Bedanya menentukan: "tidak ada nilai" tidak boleh sama artinya
 * dengan "kosongkan field ini".
 */

export const ME_PREFIX = "$me."

export function isMeRef(value: unknown): value is string {
  return typeof value === "string" && value.startsWith(ME_PREFIX)
}

export function resolveMe(reference: string, user: any): any {
  const path = reference.slice(ME_PREFIX.length).split(".")

  let cursor: any = user

  for (const key of path) {
    if (cursor == null || typeof cursor !== "object")
      return undefined

    cursor = cursor[key]
  }

  return cursor
}
