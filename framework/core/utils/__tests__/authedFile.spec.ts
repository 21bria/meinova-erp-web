import { describe, expect, it, vi } from "vitest"

import { downloadAuthedFile, previewAuthedFile } from "../authedFile"

function env(overrides: Record<string, any> = {}) {
  const tab = { location: { href: "" }, opener: "parent" as unknown, close: vi.fn() }
  const saved: [string, string][] = []
  const deferred: (() => void)[] = []

  const value = {
    fetcher: vi.fn(async (_path: string) => new Blob(["x"], { type: "image/png" })),
    createObjectURL: vi.fn(() => "blob:fake/1"),
    revokeObjectURL: vi.fn(),
    openWindow: vi.fn(() => tab),
    saveAs: vi.fn((url: string, name: string) => { saved.push([url, name]) }),
    later: vi.fn((fn: () => void) => { deferred.push(fn) }),
    ...overrides,
  }

  return { env: value, tab, saved, deferred }
}

const PREVIEW = "http://demo.localhost:8000/api/uploads/abc/preview/"
const DOWNLOAD = "http://demo.localhost:8000/api/uploads/abc/download/"

describe("previewAuthedFile", () => {
  it("mengambil lewat klien bertoken, lalu membuka blob: di tab baru", async () => {
    const { env: e, tab } = env()

    expect(await previewAuthedFile(PREVIEW, e)).toBe(true)

    expect(e.fetcher).toHaveBeenCalledWith("/api/uploads/abc/preview/")
    expect(tab.location.href).toBe("blob:fake/1")
    expect(tab.opener).toBeNull()
  })

  it("tab dibuka sebelum berkasnya diambil (gerakan pengguna)", async () => {
    const order: string[] = []
    const { env: e } = env()

    e.openWindow.mockImplementation(() => {
      order.push("open")
      return { location: { href: "" }, opener: null, close: vi.fn() }
    })
    e.fetcher.mockImplementation(async () => {
      order.push("fetch")
      return new Blob(["x"])
    })

    await previewAuthedFile(PREVIEW, e)

    expect(order).toEqual(["open", "fetch"])
  })

  it("gagal diambil → tab ditutup, jawabannya false", async () => {
    const { env: e, tab } = env({
      fetcher: vi.fn(async () => {
        throw new Error("403")
      }),
    })

    expect(await previewAuthedFile(PREVIEW, e)).toBe(false)
    expect(tab.close).toHaveBeenCalled()
  })

  it("object URL dicabut belakangan, bukan dibiarkan bocor", async () => {
    const { env: e, deferred } = env()

    await previewAuthedFile(PREVIEW, e)

    expect(e.revokeObjectURL).not.toHaveBeenCalled()
    deferred.forEach(fn => fn())
    expect(e.revokeObjectURL).toHaveBeenCalledWith("blob:fake/1")
  })
})

describe("downloadAuthedFile", () => {
  it("menyimpan dengan nama asli, lewat klien bertoken", async () => {
    const { env: e, saved } = env()

    expect(await downloadAuthedFile(DOWNLOAD, "citra.jpg", e)).toBe(true)

    expect(e.fetcher).toHaveBeenCalledWith("/api/uploads/abc/download/")
    expect(saved).toEqual([["blob:fake/1", "citra.jpg"]])
  })

  it("gagal diambil → false, tidak ada yang disimpan", async () => {
    const { env: e, saved } = env({
      fetcher: vi.fn(async () => {
        throw new Error("404")
      }),
    })

    expect(await downloadAuthedFile(DOWNLOAD, "a.png", e)).toBe(false)
    expect(saved).toEqual([])
  })

  it("alamat yang tidak bisa diurai tidak memicu permintaan", async () => {
    const { env: e } = env()

    expect(await downloadAuthedFile("", "a.png", e)).toBe(false)
    expect(e.fetcher).not.toHaveBeenCalled()
  })
})
