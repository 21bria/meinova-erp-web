import { describe, expect, it } from "vitest"

import { keepsFileFieldValue } from "../uploadPayload"

const separate = { type: "file", valueMode: "id" }
const legacy = { type: "image" }

describe("keepsFileFieldValue", () => {
  /*
   * Akar masalah foto pegawai yang "tersimpan" lalu hilang: id dari
   * widget unggah terpisah dibuang dari PATCH karena bukan `File`.
   */
  it("id unggahan dari widget terpisah ikut dikirim", () => {
    expect(keepsFileFieldValue(separate, 42)).toBe(true)
    expect(keepsFileFieldValue({ type: "file", value_mode: "id" }, 42)).toBe(true)
  })

  it("nilai `null` ikut dikirim — itu cara melepas berkasnya", () => {
    expect(keepsFileFieldValue(separate, null)).toBe(true)
  })

  it("daftar id (unggah jamak) ikut dikirim", () => {
    expect(keepsFileFieldValue(separate, [1, 2])).toBe(true)
    expect(keepsFileFieldValue(separate, [1, "x"])).toBe(false)
  })

  it("nilai URL dan objek detail tetap dibuang", () => {
    expect(keepsFileFieldValue(separate, "http://x/api/uploads/a/preview/")).toBe(false)
    expect(keepsFileFieldValue(separate, { id: 1 })).toBe(false)
    expect(keepsFileFieldValue(separate, undefined)).toBe(false)
    expect(keepsFileFieldValue(separate, 0)).toBe(false)
  })

  it("field lama tanpa `valueMode: id` tidak berubah perilakunya", () => {
    expect(keepsFileFieldValue(legacy, 42)).toBe(false)
    expect(keepsFileFieldValue(legacy, null)).toBe(false)
    expect(keepsFileFieldValue(legacy, "/media/a.png")).toBe(false)
  })

  it("objek `File` selalu dikirim", () => {
    const file = new File([new Uint8Array([1])], "a.png", { type: "image/png" })

    expect(keepsFileFieldValue(legacy, file)).toBe(true)
    expect(keepsFileFieldValue(separate, file)).toBe(true)
  })
})
