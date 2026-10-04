import { beforeEach, describe, expect, it, vi } from "vitest"

import {
  imagePath,
  loadAuthedImage,
  needsAuthedFetch,
  resetAuthedImageCache,
} from "../authedImage"

/*
 * `URL.createObjectURL` tidak ada di Node, dan yang diuji di sini bukan
 * implementasinya melainkan **berapa kali** gambarnya diambil. Jadi
 * dipasang tiruan yang bisa dihitung.
 */
let created = 0

beforeEach(() => {
  created = 0

  URL.createObjectURL = vi.fn(() => `blob:fake/${++created}`)
  URL.revokeObjectURL = vi.fn()

  resetAuthedImageCache()
})

function imageBlob() {
  return new Blob([new Uint8Array([1, 2, 3])], { type: "image/png" })
}

describe("needsAuthedFetch", () => {
  it("benar untuk endpoint uploads yang menuntut token", () => {
    expect(needsAuthedFetch("/api/uploads/abc/preview/")).toBe(true)
    expect(needsAuthedFetch("http://demo.localhost:8000/api/uploads/abc/preview/")).toBe(true)
  })

  /*
   * Kolom `avatar` yang lama dilayani `MEDIA_URL` statis. Mengambilnya
   * lewat `useApi` berarti menempelkan token pada alamat yang tidak
   * memeriksanya — permintaan tambahan tanpa satu pun manfaat.
   */
  it("salah untuk alamat media statis", () => {
    expect(needsAuthedFetch("/media/employees/avatars/a.png")).toBe(false)
    expect(needsAuthedFetch("http://demo.localhost:8000/media/a.png")).toBe(false)
  })

  it("salah untuk alamat yang tidak bisa diurai", () => {
    expect(needsAuthedFetch("")).toBe(false)
    expect(needsAuthedFetch("::::")).toBe(false)
  })
})

describe("imagePath", () => {
  it("menyisakan jalur dan query, membuang host", () => {
    expect(imagePath("http://django:8000/api/uploads/a/preview/?v=2"))
      .toBe("/api/uploads/a/preview/?v=2")
  })
})

describe("loadAuthedImage", () => {
  it("mengembalikan object URL untuk gambar yang berhasil diambil", async () => {
    const fetcher = vi.fn(async () => imageBlob())

    const url = await loadAuthedImage("/api/uploads/a/preview/", fetcher)

    expect(url).toBe("blob:fake/1")
    expect(fetcher).toHaveBeenCalledWith("/api/uploads/a/preview/")
  })

  it("mengambil sekali saja untuk alamat yang sama", async () => {
    const fetcher = vi.fn(async () => imageBlob())

    const first = await loadAuthedImage("/api/uploads/a/preview/", fetcher)
    const second = await loadAuthedImage("/api/uploads/a/preview/", fetcher)

    expect(first).toBe(second)
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  /*
   * 25 baris dalam satu halaman tabel meminta foto yang sama pada saat
   * yang hampir sama. Tanpa penggabungan permintaan yang sedang
   * berjalan, satu halaman berarti 25 unduhan untuk satu berkas.
   */
  it("menggabungkan permintaan yang berjalan bersamaan", async () => {
    const fetcher = vi.fn(async () => imageBlob())

    const [a, b] = await Promise.all([
      loadAuthedImage("/api/uploads/a/preview/", fetcher),
      loadAuthedImage("/api/uploads/a/preview/", fetcher),
    ])

    expect(a).toBe(b)
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it("mengembalikan null — bukan melempar — saat pengambilannya gagal", async () => {
    const fetcher = vi.fn(async () => {
      throw new Error("401")
    })

    await expect(loadAuthedImage("/api/uploads/a/preview/", fetcher))
      .resolves.toBeNull()
  })

  /*
   * Balasan error dari server tetap sebuah Blob — halaman HTML juga.
   * Dipasang apa adanya ia jadi ikon gambar rusak, yang persis hal
   * yang seharusnya tidak pernah terlihat.
   */
  it("menolak balasan yang bukan gambar", async () => {
    const fetcher = vi.fn(async () =>
      new Blob(["<html>404</html>"], { type: "text/html" }))

    await expect(loadAuthedImage("/api/uploads/a/preview/", fetcher))
      .resolves.toBeNull()
  })

  it("tidak mencoba lagi alamat yang sudah terbukti gagal", async () => {
    const fetcher = vi.fn(async () => {
      throw new Error("404")
    })

    await loadAuthedImage("/api/uploads/a/preview/", fetcher)
    await loadAuthedImage("/api/uploads/a/preview/", fetcher)

    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  /*
   * Alamat kosong berarti "pegawai ini tidak punya foto", dan jawaban
   * yang benar adalah inisialnya — bukan permintaan ke `/`, yang
   * membalas HTML dan menghabiskan satu perjalanan jaringan per baris.
   */
  it("tidak mengambil apa pun untuk alamat kosong", async () => {
    const fetcher = vi.fn(async () => imageBlob())

    await expect(loadAuthedImage("", fetcher)).resolves.toBeNull()
    await expect(loadAuthedImage("   ", fetcher)).resolves.toBeNull()

    expect(fetcher).not.toHaveBeenCalled()
  })
})
