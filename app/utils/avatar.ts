/*
|--------------------------------------------------------------------------
| Inisial avatar
|--------------------------------------------------------------------------
|
| Pasangan frontend dari `employee_initials()` di
| `apps/hr/avatar.py`. Backend tetap yang berwenang atas **fotonya**
| (`avatar_display.url`); yang dihitung di sini hanya huruf yang
| ditampilkan saat fotonya tidak ada.
|
| Dihitung ulang di sini, bukan sekadar memakai `avatar_display.initials`
| apa adanya, karena tabel juga memuat baris yang namanya datang dari
| payload lain (lookup, hasil import, baris yang fieldnya disaring
| policy) — dan avatar yang kosong di satu tabel dan terisi di tabel
| sebelahnya, untuk orang yang sama, terbaca sebagai data yang hilang.
| Nilai dari backend tetap dipakai sebagai cadangan kalau namanya
| memang tidak ikut terkirim.
*/

/**
 * Dua huruf dari nama. `Adrian Mahendra` → `AM`.
 *
 * Nama satu kata memberi satu huruf — bukan dua. `Sukarno` → `S`.
 * Nama yang tidak ada sama sekali memberi `?`, yang menyatakan dirinya
 * sebagai ketiadaan data alih-alih sebagai kotak yang gagal dimuat.
 *
 * Menerima potongan nama terpisah (`first_name`, `last_name`) maupun
 * satu nama utuh; `null`, `undefined`, dan spasi berlebih dibuang.
 */
export function avatarInitials(
  ...parts: (string | null | undefined)[]
): string {
  const words = parts
    .map(part => (typeof part === "string" ? part : ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean)

  if (!words.length)
    return "?"

  const first = words[0]!

  if (words.length === 1)
    return first.charAt(0).toUpperCase()

  const last = words[words.length - 1]!

  return (
    first.charAt(0) + last.charAt(0)
  ).toUpperCase()
}
