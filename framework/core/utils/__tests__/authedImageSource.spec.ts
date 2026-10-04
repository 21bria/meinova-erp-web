import { beforeEach, describe, expect, it, vi } from "vitest"

import { resetAuthedImageCache } from "../authedImage"
import { createAuthedImageSource } from "../authedImageSource"

/*
 * Aturan yang dipakai bersama `MAvatar` (daftar, kepala halaman
 * pegawai) dan pratinjau `MUploadField` (form Edit). Tanpa DOM:
 * `URL.createObjectURL` ditiru supaya yang diuji adalah urutannya —
 * kapan gambar diambil, kapan jatuh ke cadangan, dan balasan mana
 * yang boleh menang.
 */

let created = 0

beforeEach(() => {
  created = 0

  URL.createObjectURL = vi.fn(() => `blob:fake/${++created}`)
  URL.revokeObjectURL = vi.fn()

  resetAuthedImageCache()
})

function png() {
  return new Blob([new Uint8Array([1, 2, 3])], { type: "image/png" })
}

function setup(fetcher = vi.fn(async (_path: string) => png()), isClient = true) {
  const seen: (string | null)[] = []

  const source = createAuthedImageSource({
    fetcher,
    onChange: value => seen.push(value),
    isClient,
  })

  return { source, seen, fetcher, last: () => seen[seen.length - 1] }
}

describe("createAuthedImageSource", () => {
  it("foto tersimpan diambil membawa token, lalu dipasang sebagai object URL", async () => {
    const { source, fetcher, last } = setup()

    await source.resolve("http://django:8000/api/uploads/abc/preview/")

    // Jalurnya saja: host dari `build_absolute_uri()` belum tentu bisa
    // dibuka peramban, `useApi` merakit ulang dari `apiBaseUrl`.
    expect(fetcher).toHaveBeenCalledWith("/api/uploads/abc/preview/")
    expect(last()).toBe("blob:fake/1")
  })

  it("tanpa foto → null (inisial), tanpa satu pun permintaan", async () => {
    const { source, fetcher, last } = setup()

    await source.resolve(null)
    await source.resolve("   ")

    expect(fetcher).not.toHaveBeenCalled()
    expect(last()).toBeNull()
  })

  it("alamat statis (kolom `avatar` lama) dipasang apa adanya", async () => {
    const { source, fetcher, last } = setup()

    await source.resolve("/media/employees/avatars/a.png")

    expect(fetcher).not.toHaveBeenCalled()
    expect(last()).toBe("/media/employees/avatars/a.png")
  })

  it("gagal diambil → null, bukan gambar rusak dan bukan lemparan", async () => {
    const { source, last } = setup(vi.fn(async () => {
      throw new Error("404")
    }))

    await expect(
      source.resolve("/api/uploads/missing/preview/"),
    ).resolves.toBeUndefined()

    expect(last()).toBeNull()
  })

  it("balasan yang bukan gambar (halaman error HTML) → null", async () => {
    const { source, last } = setup(vi.fn(async () =>
      new Blob(["<html>"], { type: "text/html" })))

    await source.resolve("/api/uploads/x/preview/")

    expect(last()).toBeNull()
  })

  it("selama diambil, yang tampil cadangannya — bukan foto sebelumnya", async () => {
    const { source, seen } = setup()

    await source.resolve("/api/uploads/old/preview/")
    await source.resolve("/api/uploads/new/preview/")

    expect(seen).toEqual([null, "blob:fake/1", null, "blob:fake/2"])
  })

  it("foto pengganti (public_id baru) diambil ulang, bukan disajikan dari cache", async () => {
    const { source, fetcher, last } = setup()

    await source.resolve("/api/uploads/old/preview/")
    await source.resolve("/api/uploads/new/preview/")

    expect(fetcher).toHaveBeenCalledTimes(2)
    expect(last()).toBe("blob:fake/2")
  })

  it("alamat yang sama tidak diunduh dua kali (pindah halaman tabel)", async () => {
    const fetcher = vi.fn(async (_path: string) => png())

    await setup(fetcher).source.resolve("/api/uploads/a/preview/")
    await setup(fetcher).source.resolve("/api/uploads/a/preview/")

    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it("balasan terlambat tidak menimpa alamat yang lebih baru", async () => {
    let releaseSlow!: (blob: Blob) => void

    const fetcher = vi.fn((path: string) => {
      if (path.includes("slow"))
        return new Promise<Blob>((resolve) => { releaseSlow = resolve })

      return Promise.resolve(png())
    })

    const { source, last } = setup(fetcher)

    const slow = source.resolve("/api/uploads/slow/preview/")

    await source.resolve("/api/uploads/fast/preview/")

    releaseSlow(png())
    await slow

    expect(last()).toBe("blob:fake/1")
  })

  it("setelah dilepas, balasan yang masih di jalan diabaikan", async () => {
    let release!: (blob: Blob) => void

    const { source, seen } = setup(vi.fn(() =>
      new Promise<Blob>((resolve) => { release = resolve })))

    const pending = source.resolve("/api/uploads/a/preview/")

    source.dispose()
    release(png())
    await pending

    expect(seen).toEqual([null])
  })

  it("di server: inisial dulu, tanpa permintaan", async () => {
    const { source, fetcher, last } = setup(undefined, false)

    await source.resolve("/api/uploads/a/preview/")

    expect(fetcher).not.toHaveBeenCalled()
    expect(last()).toBeNull()
  })
})
