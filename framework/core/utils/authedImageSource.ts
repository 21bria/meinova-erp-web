/*
|--------------------------------------------------------------------------
| Sumber gambar yang siap dipasang ke `<img>`
|--------------------------------------------------------------------------
|
| Dipindah dari `MAvatar.vue` supaya satu aturan dipakai dua tempat —
| avatar (tabel, kepala halaman) dan pratinjau di widget unggah — tanpa
| salinan kedua. Sengaja tanpa Vue: urutannya diuji langsung di
| lingkungan `node` milik repo ini, dan `useAuthedImage` hanya
| membungkusnya dengan `ref` + `watch`.
|
| Tiga aturan:
|
|  1. alamat `/api/...` diambil membawa token (`loadAuthedImage`), yang
|     statis dipasang apa adanya;
|  2. selama pengambilan berjalan, atau kalau gagal, jawabannya `null` —
|     pemanggil menampilkan cadangannya (inisial, ikon), **bukan** ikon
|     gambar rusak bawaan peramban;
|  3. balasan yang datang terlambat tidak menimpa alamat yang lebih
|     baru. Tanpa ini baris tabel yang berganti isi saat pindah halaman
|     — atau foto yang baru diganti — bisa menampilkan gambar lama.
*/

import {
  loadAuthedImage,
  needsAuthedFetch,
} from "./authedImage"

type BlobFetcher = (path: string) => Promise<Blob>

export interface AuthedImageSourceOptions {
  fetcher: BlobFetcher
  /** Dipanggil tiap kali alamat yang siap dipasang berubah. */
  onChange: (value: string | null) => void
  /**
   * Benar di peramban. Di server tidak ada token maupun
   * `URL.createObjectURL`: halaman tergambar dengan cadangannya, lalu
   * gambarnya menyusul di klien.
   */
  isClient?: boolean
}

export interface AuthedImageSource {
  resolve: (source: string | null | undefined) => Promise<void>
  /** Membatalkan balasan yang masih di jalan. Aman diulang. */
  dispose: () => void
}

export function createAuthedImageSource(
  options: AuthedImageSourceOptions,
): AuthedImageSource {
  const isClient = options.isClient ?? true

  let token = 0

  async function resolve(source: string | null | undefined) {
    const current = ++token

    const trimmed = (source ?? "").trim()

    if (!trimmed) {
      options.onChange(null)

      return
    }

    if (!needsAuthedFetch(trimmed)) {
      options.onChange(trimmed)

      return
    }

    if (!isClient) {
      options.onChange(null)

      return
    }

    /*
     * Alamat lama dilepas dulu. Menahannya selama alamat baru diambil
     * berarti foto yang baru diganti masih memperlihatkan foto lama —
     * yang justru membuat orang mengira gantinya tidak tersimpan.
     */
    options.onChange(null)

    const objectUrl = await loadAuthedImage(trimmed, options.fetcher)

    if (current !== token)
      return

    options.onChange(objectUrl)
  }

  return {
    resolve,

    dispose() {
      /*
       * Object URL-nya sengaja TIDAK di-revoke: ia milik cache bersama
       * di `authedImage.ts`, dan baris tabel dilepas-pasang tiap kali
       * halaman berganti. Yang dibatalkan hanya balasan yang masih di
       * jalan.
       */
      token += 1
    },
  }
}
