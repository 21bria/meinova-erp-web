import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { describe, expect, it, vi } from "vitest"

import { keepsFileFieldValue } from "../../../../../framework/core/utils/uploadPayload"
import { uploadPreviewSource } from "../../../../../framework/core/utils/uploadPreview"
import { needsAuthedFetch } from "../../../../../framework/core/utils/authedImage"

import { employeeAvatar, employeeName } from "../avatar"

/*
| Foto pegawai di layar HR — daftar, kepala halaman, dan form Edit.
|
| Repo ini menjalankan vitest di `node` tanpa DOM, jadi yang diuji di
| sini keputusan yang tinggal di luar `<template>`: foto mana yang
| dipasang, alamat mana yang dipakai pratinjau, dan apakah id unggahan
| benar-benar sampai ke PATCH. Sambungan komponennya diperiksa dari
| sumbernya; tampilannya lewat UAT browser.
*/

// `@framework` memuat seluruh komponen `.vue`, yang tidak bisa dibaca
// vitest polos. `form.ts` hanya butuh dua builder murni.
vi.mock("@framework", async () => ({
  ...(await import("../../../../../framework/builders/forms/field")),
  ...(await import("../../../../../framework/builders/forms/createForm")),
}))

const here = (path: string) =>
  readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8")

/** Bentuk yang dibalas `GET /api/hr/employees/<id>/` untuk pegawai berfoto. */
function persisted(publicId = "7f7c1c1e-0000-4000-8000-000000000001") {
  const preview = `http://demo.localhost:8000/api/uploads/${publicId}/preview/`

  return {
    id: 11,
    employee_number: "SGA004",
    first_name: "Citra",
    last_name: "Halimah",
    full_name: "Citra Halimah",
    avatar: null,
    avatar_file: 91,
    avatar_file_detail: {
      id: 91,
      public_id: publicId,
      original_name: "citra.jpg",
      mime_type: "image/jpeg",
      file_type: "image",
      category: "avatar",
      size_display: "84.2 KB",
      preview_url: preview,
      download_url: `http://demo.localhost:8000/api/uploads/${publicId}/download/`,
    },
    avatar_display: { url: preview, source: "upload" as const, initials: "CH" },
  }
}

function withoutPhoto() {
  return {
    ...persisted(),
    avatar_file: null,
    avatar_file_detail: null,
    avatar_display: { url: null, source: null, initials: "CH" },
  }
}

describe("employeeAvatar", () => {
  it("foto tersimpan → alamat `preview/` dari backend", () => {
    const avatar = employeeAvatar(persisted())

    expect(avatar.src).toBe(persisted().avatar_display.url)
    expect(avatar.name).toBe("Citra Halimah")
    expect(avatar.initials).toBe("CH")
  })

  it("tanpa foto → src null, inisial tetap ada", () => {
    expect(employeeAvatar(withoutPhoto())).toEqual({
      src: null,
      name: "Citra Halimah",
      initials: "CH",
    })
  })

  /*
   * Urutan `avatar_file` → `avatar` lama → inisial milik backend. Id
   * berkas yang ada tanpa `avatar_display.url` (mis. berkasnya sudah
   * dihapus) **tidak** dirakit jadi alamat di sini.
   */
  it("tidak merakit alamat sendiri dari id berkas", () => {
    const row = { ...persisted(), avatar_display: null }

    expect(employeeAvatar(row).src).toBeNull()
  })

  it("baris tanpa `full_name` memakai nama depan + belakang", () => {
    expect(employeeName({ first_name: "Citra", last_name: "Halimah" }))
      .toBe("Citra Halimah")
    expect(employeeAvatar(null)).toEqual({ src: null, name: null, initials: null })
  })

  it("alamatnya selalu lewat pengambilan bertoken, bukan `<img src>` langsung", () => {
    expect(needsAuthedFetch(employeeAvatar(persisted()).src!)).toBe(true)
  })
})

describe("form Edit — field foto", async () => {
  const { employeesForm } = await import("../form")

  const photo = employeesForm.find(item => item.key === "avatar_file")!

  it("menulis `avatar_file`, bukan kolom `avatar` lama yang read-only", () => {
    expect(photo).toBeTruthy()
    expect(employeesForm.find(item => item.key === "avatar")).toBeUndefined()
  })

  it("mengunggah dengan kategori yang diterima `Employee.clean()`", () => {
    expect(photo.category).toBe("avatar")
    expect(photo.widget).toBe("image-upload")
    expect(photo.valueMode).toBe("id")
    expect(photo.detailField).toBe("avatar_file_detail")
  })

  it("foto tersimpan tampil sebagai pratinjau begitu form dibuka ulang", () => {
    const record = persisted()

    const detail = (record as Record<string, any>)[photo.detailField!]

    expect(uploadPreviewSource(detail, true)).toBe(record.avatar_display.url)
  })

  it("foto pengganti mengganti alamat pratinjaunya", () => {
    const before = uploadPreviewSource(persisted().avatar_file_detail, true)
    const after = uploadPreviewSource(
      persisted("7f7c1c1e-0000-4000-8000-000000000002").avatar_file_detail,
      true,
    )

    expect(after).not.toBe(before)
  })

  it("tanpa foto → tidak ada pratinjau", () => {
    expect(uploadPreviewSource(withoutPhoto().avatar_file_detail, true)).toBeNull()
  })

  it("id unggahan ikut dikirim saat Save, dan `null` saat foto dilepas", () => {
    expect(keepsFileFieldValue(photo, 91)).toBe(true)
    expect(keepsFileFieldValue(photo, null)).toBe(true)
    expect(keepsFileFieldValue(photo, persisted().avatar_display.url)).toBe(false)
  })
})

describe("sambungan komponen", () => {
  it("page.vue menyaring field berkas lewat `keepsFileFieldValue`", () => {
    const page = here("../page.vue")

    expect(page).toContain("keepsFileFieldValue(")
    expect(page).not.toMatch(/!\(\s*payload\[field\.key\]\s*instanceof File\s*\)/)
  })

  it("template generator ikut membawa perbaikan yang sama", () => {
    const template = here("../../../../../scripts/meinova/templates/crud-workspace/page.vue")

    expect(template).toContain("keepsFileFieldValue(")
  })

  it("kepala halaman merender `EmployeeAvatar` dari record yang sama", () => {
    const header = here("../components/EmployeesHeader.vue")

    expect(header).toMatch(/<EmployeeAvatar[\s\S]*?:employee="record"/)
  })

  it("daftar memakai `employeeAvatar()` di sel identitas, bukan kolom foto terpisah", () => {
    const columns = here("../columns.ts")

    expect(columns).toContain("employeeAvatar(row)")
    expect(columns).toContain("h(MIdentityCell")
    expect(columns).not.toContain("avatar_display?.url")
  })

  it("EmployeeAvatar memakai `MAvatar` bersama, bukan `<img>` sendiri", () => {
    const component = here("../components/EmployeeAvatar.vue")

    expect(component).toContain("<MAvatar")
    expect(component).not.toContain("<img")
  })
})
