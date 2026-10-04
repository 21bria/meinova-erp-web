import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { describe, expect, it, vi } from "vitest"

import { keepsFileFieldValue } from "../../../../framework/core/utils/uploadPayload"

/*
| Field unggah ber-id di halaman workspace hasil generate.
|
| Widget unggah terpisah (`uploadMode: "separate"`, `valueMode: "id"`)
| menaruh **id `UploadedFile`** di model form — bukan objek `File`.
| `buildPayload()` versi lama membuang setiap field `file`/`image` yang
| nilainya bukan `File`, jadi id itu tidak pernah ikut POST/PATCH:
| berkasnya terunggah, tersimpan di `uploads`, dan **tidak pernah
| tertaut** ke record. Balasannya 200, tidak ada pesan apa pun, dan
| lampirannya hilang begitu form dibuka ulang.
|
| Ditemukan pada foto pegawai (`hr/employees`); tiga modul lain memakai
| bentuk field yang sama. Berkas ini mengunci keduanya: aturannya, dan
| kenyataan bahwa tiap halaman memakai aturan itu.
*/

vi.mock("@framework", async () => ({
  ...(await import("../../../../framework/builders/forms/field")),
  ...(await import("../../../../framework/builders/forms/createForm")),
}))

function here(path: string) {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8")
}

/** Predikat `buildPayload()` yang lama, untuk pembanding. */
function oldPredicate(value: unknown) {
  return value instanceof File
}

const MODULES = [
  { name: "employees", key: "avatar_file", form: () => import("../employees/form") },
  { name: "candidates", key: "resume_file", form: () => import("../candidates/form") },
  {
    name: "attendance-permissions",
    key: "supporting_document",
    form: () => import("../attendance-permissions/form"),
  },
  { name: "leave", key: "uploaded_file", form: () => import("../leave/form") },
] as const

describe.each(MODULES)("$name — field unggah ber-id", ({ name, key, form }) => {
  it("field-nya memang widget unggah terpisah bernilai id", async () => {
    const fields = Object.values(await form())[0] as any[]

    const field = fields.find(item => item.key === key)

    expect(field).toBeTruthy()
    expect(field.type).toBe("file")
    expect(field.valueMode).toBe("id")
    expect(field.detailField).toBe(`${key}_detail`)
  })

  it("id unggahan lolos ke payload — dan dulu tidak", async () => {
    const fields = Object.values(await form())[0] as any[]

    const field = fields.find(item => item.key === key)

    expect(keepsFileFieldValue(field, 91)).toBe(true)
    expect(oldPredicate(91)).toBe(false)

    // Melepas lampiran juga harus sampai ke backend.
    expect(keepsFileFieldValue(field, null)).toBe(true)

    // Yang tidak berubah: URL/objek detail dari API tetap dibuang.
    expect(keepsFileFieldValue(field, "/api/uploads/abc/preview/")).toBe(false)
    expect(keepsFileFieldValue(field, { id: 91 })).toBe(false)
  })

  it("halaman modulnya memakai aturan bersama, bukan salinan sendiri", () => {
    const page = here(`../${name}/page.vue`)

    expect(page).toContain("keepsFileFieldValue(")
    expect(page).not.toMatch(/!\(\s*payload\[field\.key\]\s*instanceof File\s*\)/)
  })
})
