/*
|--------------------------------------------------------------------------
| Membuka / mengunduh berkas di balik endpoint berautentikasi
|--------------------------------------------------------------------------
|
| `preview/` dan `download/` milik `uploads` menuntut
| `Authorization: Bearer ...`. Tautan `<a href target="_blank">` tidak
| pernah membawa header itu — tab barunya dibalas 401, untuk berkas yang
| sebenarnya boleh dibuka orangnya.
|
| Jadi berkasnya diambil lewat klien API yang membawa token (jalur yang
| sama dengan `authedImage.ts`), lalu:
|
|   * pratinjau → dibuka sebagai `blob:` URL di tab baru;
|   * unduh     → disimpan lewat `<a download>` dengan nama aslinya.
|
| Tidak ada alamat `/media/` yang dipakai, dan backend tidak dilonggarkan.
|
| Tab untuk pratinjau dibuka **sebelum** berkasnya diambil: peramban
| hanya mengizinkan `window.open` di dalam gerakan pengguna, dan sesudah
| `await` gerakan itu sudah lewat — tab yang dibuka belakangan diblokir
| sebagai popup.
*/

import { imagePath } from "./authedImage"

type BlobFetcher = (path: string) => Promise<Blob>

export interface AuthedFileEnv {
  fetcher: BlobFetcher
  createObjectURL: (blob: Blob) => string
  revokeObjectURL: (url: string) => void
  /** `window.open` — boleh `null` kalau popup diblokir. */
  openWindow: () => { location: { href: string }, opener: unknown, close: () => void } | null
  /** Menyimpan berkas lewat `<a download>`. */
  saveAs: (url: string, filename: string) => void
  /** Penunda pencabutan; tab baru butuh waktu memuat `blob:`-nya. */
  later: (fn: () => void) => void
}

/**
 * Buka berkas di tab baru. `false` kalau gagal — pemanggil menampilkan
 * pesan; tab kosong yang sudah terbuka ditutup lagi.
 */
export async function previewAuthedFile(
  source: string,
  env: AuthedFileEnv,
): Promise<boolean> {
  const path = imagePath(source)

  if (!path)
    return false

  const tab = env.openWindow()

  if (tab)
    tab.opener = null

  try {
    const blob = await env.fetcher(path)

    const url = env.createObjectURL(blob)

    if (tab)
      tab.location.href = url

    env.later(() => env.revokeObjectURL(url))

    return Boolean(tab)
  }
  catch {
    tab?.close()

    return false
  }
}

/** Unduh berkas dengan nama aslinya. `false` kalau gagal. */
export async function downloadAuthedFile(
  source: string,
  filename: string,
  env: AuthedFileEnv,
): Promise<boolean> {
  const path = imagePath(source)

  if (!path)
    return false

  try {
    const blob = await env.fetcher(path)

    const url = env.createObjectURL(blob)

    env.saveAs(url, filename || "download")
    env.later(() => env.revokeObjectURL(url))

    return true
  }
  catch {
    return false
  }
}

/** Lingkungan peramban yang sesungguhnya. */
export function browserFileEnv(fetcher: BlobFetcher): AuthedFileEnv {
  return {
    fetcher,
    createObjectURL: blob => URL.createObjectURL(blob),
    revokeObjectURL: url => URL.revokeObjectURL(url),
    openWindow: () => window.open("", "_blank"),
    saveAs: (url, filename) => {
      const link = document.createElement("a")

      link.href = url
      link.download = filename
      link.rel = "noopener"
      document.body.appendChild(link)
      link.click()
      link.remove()
    },
    later: fn => window.setTimeout(fn, 60_000),
  }
}
