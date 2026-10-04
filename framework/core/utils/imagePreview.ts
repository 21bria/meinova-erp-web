/*
|--------------------------------------------------------------------------
| Keadaan pratinjau gambar (lightbox)
|--------------------------------------------------------------------------
|
| Dipisah dari komponennya supaya bisa diuji di lingkungan `node` milik
| repo ini: yang paling gampang salah bukan tata letaknya, melainkan
| **kapan** kotaknya boleh dibuka dan apa yang tampil saat gambarnya
| belum (atau tidak pernah) datang.
|
| Tiga aturan:
|
|  1. hanya berkas gambar yang punya lightbox. PDF dan dokumen tetap di
|     jalur lamanya — memaksanya masuk penampil gambar menghasilkan
|     kotak kosong yang terlihat seperti kerusakan;
|  2. selama blob-nya diambil → `loading` (pemutar, bukan gambar rusak);
|  3. gagal diambil → `error` dengan kalimat, bukan ikon rusak bawaan
|     peramban.
*/

import type { UploadPreviewDetail } from "./uploadPreview"
import { uploadPreviewSource } from "./uploadPreview"

export type ImagePreviewState = "none" | "loading" | "ready" | "error"

export interface ImagePreviewInput {
  /** Detail berkas dari API (`<field>_detail`). */
  detail?: (UploadPreviewDetail & { original_name?: string | null }) | null
  /** Field ini memang field gambar (`widget: "image-upload"`). */
  imageMode?: boolean
  /** Object URL yang sudah didapat `useAuthedImage`, kalau ada. */
  url?: string | null
  /** Pengambilannya masih berjalan. */
  pending?: boolean
  /** Pengambilannya sudah selesai dan gagal. */
  failed?: boolean
}

/**
 * Benar kalau berkas ini punya pratinjau gambar sama sekali —
 * dasar dari "thumbnail-nya bisa diklik".
 */
export function isPreviewableImage(
  detail: ImagePreviewInput["detail"],
  imageMode = false,
): boolean {
  return uploadPreviewSource(detail, imageMode) !== null
}

/**
 * Keadaan isi lightbox.
 *
 * `none` berarti tidak ada yang bisa ditampilkan — pemanggilnya tidak
 * membuka kotak sama sekali.
 */
export function imagePreviewState(input: ImagePreviewInput): ImagePreviewState {
  if (!isPreviewableImage(input.detail, input.imageMode))
    return "none"

  if (input.url)
    return "ready"

  if (input.pending)
    return "loading"

  if (input.failed)
    return "error"

  // Belum diminta sama sekali (mis. di server): diperlakukan sebagai
  // sedang dimuat, bukan gagal.
  return "loading"
}

/** Nama berkas yang dicetak di kepala lightbox. */
export function imagePreviewTitle(
  detail: ImagePreviewInput["detail"],
): string {
  const name = (detail?.original_name ?? "").trim()

  return name || "Image"
}
