import { describe, expect, it } from "vitest"

import { uploadPreviewSource } from "../uploadPreview"

describe("uploadPreviewSource", () => {
  it("memakai `preview_url` berautentikasi, bukan `thumbnail_url` statis", () => {
    expect(uploadPreviewSource({
      file_type: "image",
      preview_url: "http://demo.localhost:8000/api/uploads/abc/preview/",
      thumbnail_url: "http://demo.localhost:8000/media/uploads/thumb.jpg",
    })).toBe("http://demo.localhost:8000/api/uploads/abc/preview/")
  })

  /*
   * Bentuk `avatar_file_detail` pegawai: payload referensi yang sengaja
   * tidak membawa `thumbnail_url`. Widget lama yang hanya membaca
   * `thumbnail_url` tidak pernah menampilkan foto tersimpan.
   */
  it("payload referensi tanpa `thumbnail_url` tetap punya pratinjau", () => {
    expect(uploadPreviewSource({
      file_type: "image",
      mime_type: "image/png",
      preview_url: "/api/uploads/abc/preview/",
    })).toBe("/api/uploads/abc/preview/")
  })

  it("payload lama tanpa `preview_url` jatuh ke `thumbnail_url`", () => {
    expect(uploadPreviewSource({
      file_type: "image",
      thumbnail_url: "/media/t.jpg",
    })).toBe("/media/t.jpg")
  })

  it("bukan gambar → null (ikon berkas)", () => {
    expect(uploadPreviewSource({
      file_type: "document",
      preview_url: "/api/uploads/pdf/preview/",
    }, true)).toBeNull()

    expect(uploadPreviewSource({
      mime_type: "application/pdf",
      preview_url: "/api/uploads/pdf/preview/",
    })).toBeNull()
  })

  it("tanpa keterangan jenis, field gambar dipercaya", () => {
    expect(uploadPreviewSource({ preview_url: "/api/uploads/a/preview/" }, true))
      .toBe("/api/uploads/a/preview/")

    expect(uploadPreviewSource({ preview_url: "/api/uploads/a/preview/" }, false))
      .toBeNull()
  })

  it("tanpa detail atau tanpa alamat → null", () => {
    expect(uploadPreviewSource(null, true)).toBeNull()
    expect(uploadPreviewSource({ file_type: "image" }, true)).toBeNull()
  })
})
