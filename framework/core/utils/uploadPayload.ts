/*
|--------------------------------------------------------------------------
| Nilai field berkas di payload simpan
|--------------------------------------------------------------------------
|
| Halaman workspace dulu membuang **setiap** field `file`/`image` yang
| nilainya bukan `File`, dengan alasan "nilai dari detail API biasanya
| URL — jangan kirim URL kembali sebagai unggahan".
|
| Alasan itu benar untuk field multipart lama, dan salah untuk widget
| unggah terpisah (`uploadMode: "separate"`, `valueMode: "id"`): di sana
| nilainya **id** `UploadedFile` yang sudah diunggah lebih dulu. Id itu
| ikut terbuang, PATCH-nya dibalas 200, dan berkasnya tidak pernah
| tertaut ke record — foto pegawai yang "sudah disimpan" hilang begitu
| halaman dibuka ulang, tanpa satu pun pesan.
|
| Aturannya sekarang:
|
|   * `File`                         → kirim (multipart lama)
|   * id / `null` / daftar id        → kirim, **hanya** untuk field
|                                       ber-`valueMode: "id"`
|   * selain itu (URL, objek detail) → buang, seperti sebelumnya
|
| `null` ikut dikirim dengan sengaja: itu cara widget menyatakan
| berkasnya dilepas. Membuangnya membuat tombol hapus tidak pernah
| sampai ke backend.
*/

export interface UploadPayloadField {
  type?: string
  valueMode?: string
  value_mode?: string
}

function isUploadId(value: unknown): boolean {
  return typeof value === "number" && Number.isInteger(value) && value > 0
}

/** Benar kalau nilai field berkas ini boleh ikut dikirim. */
export function keepsFileFieldValue(
  field: UploadPayloadField,
  value: unknown,
): boolean {
  if (typeof File !== "undefined" && value instanceof File)
    return true

  const valueMode = field.valueMode ?? field.value_mode

  if (valueMode !== "id")
    return false

  if (value === null || isUploadId(value))
    return true

  return Array.isArray(value) && value.every(isUploadId)
}
