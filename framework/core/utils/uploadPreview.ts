/*
|--------------------------------------------------------------------------
| Pratinjau berkas di widget unggah
|--------------------------------------------------------------------------
|
| Alamat mana yang dipakai untuk menggambar pratinjau sebuah berkas yang
| sudah diunggah.
|
| **`preview_url` didahulukan, bukan `thumbnail_url`.** `preview/`
| melewati `FileAccessService` — hak bacanya diturunkan dari record yang
| memuat berkasnya. `thumbnail_url` jalur `MEDIA_URL` statis: di
| produksi ia tidak dilayani sama sekali (gambar rusak), dan di tempat
| yang melayaninya ia terbuka tanpa login. Payload referensi (mis.
| `avatar_file_detail` pegawai) bahkan sengaja tidak mengirimnya, jadi
| widget yang hanya membaca `thumbnail_url` tidak pernah menampilkan
| foto yang sudah tersimpan begitu form dibuka ulang.
|
| `thumbnail_url` tetap dibaca sebagai cadangan untuk payload lama yang
| tidak membawa `preview_url`.
*/

export interface UploadPreviewDetail {
  file_type?: string | null
  mime_type?: string | null
  preview_url?: string | null
  thumbnail_url?: string | null
}

function isImage(detail: UploadPreviewDetail, imageMode: boolean): boolean {
  if (detail.file_type)
    return detail.file_type === "image"

  if (detail.mime_type)
    return detail.mime_type.startsWith("image/")

  // Payload tanpa keterangan jenis: percayai widget-nya. Field
  // `image-upload` memang hanya menerima gambar.
  return imageMode
}

/**
 * Alamat pratinjau gambar, atau `null` kalau berkas ini bukan gambar
 * atau tidak punya alamat yang bisa digambar — pemanggilnya
 * menampilkan ikon berkas.
 */
export function uploadPreviewSource(
  detail: UploadPreviewDetail | null | undefined,
  imageMode = false,
): string | null {
  if (!detail || !isImage(detail, imageMode))
    return null

  const preview = (detail.preview_url ?? "").trim()

  if (preview)
    return preview

  const thumbnail = (detail.thumbnail_url ?? "").trim()

  return thumbnail || null
}
