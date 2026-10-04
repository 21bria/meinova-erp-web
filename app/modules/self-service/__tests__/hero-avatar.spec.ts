import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

/*
| Foto di kepala dashboard `/me`.
|
| Yang dikunci berkas ini **bukan** tampilannya melainkan dari mana
| fotonya diambil. Self Service memakai `/api/me/avatar/`, yang dijaga
| identitas: pegawai selalu boleh melihat fotonya sendiri, sekalipun ia
| tidak punya `hr.view_employee`. Memakai `preview/` milik pegawai di
| sini akan "jalan" bagi HR dan gagal diam-diam bagi semua orang lain.
|
| Ukurannya ikut dikunci karena keempatnya beda per layar dan gampang
| bergeser saat komponennya dipakai ulang: 64px hero `/me`, 56px kepala
| Detail/Edit pegawai, 32px baris tabel, 80px pratinjau unggah.
*/

function read(path: string) {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8")
}

const hero = () => read("../components/WorkspaceHero.vue")

describe("hero /me — sumber foto", () => {
  it("memakai avatar bersama, bukan <img> atau pemuat sendiri", () => {
    expect(hero()).toContain("<MAvatar")
    expect(hero()).not.toContain("<img")
    expect(hero()).not.toMatch(/createObjectURL|fetch\(/)
  })

  it("sumbernya `avatarUrl` milik useSelfAvatar, bukan alamat rakitan", () => {
    expect(hero()).toContain(':src="avatarUrl"')

    // Tidak boleh ada jejak jalur HR / penyimpanan mentah di sini.
    expect(hero()).not.toContain("/api/uploads/")
    expect(hero()).not.toContain("/media/")
    expect(hero()).not.toContain("avatar_file")
  })

  it("halaman `/me` mengambil fotonya lewat composable Self Service", () => {
    const page = read("../workspace/page.vue")

    expect(page).toContain("useSelfAvatar")
    expect(page).toContain(":avatar-url=\"avatarUrl\"")
  })

  it("composable-nya menembak `/api/me/avatar/`, sekali per pemuatan halaman", () => {
    const client = read("../api/client.ts")

    expect(client).toContain("/api/me/avatar/")

    const page = read("../workspace/page.vue")

    // Dipanggil hanya kalau `/me` memang menyebut ada fotonya — pegawai
    // tanpa foto tidak menambah satu permintaan pun.
    const guarded = page
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)

    const at = guarded.indexOf("if (workspace.value?.identity.avatar.url)")

    expect(at).toBeGreaterThan(-1)
    expect(guarded[at + 1]).toBe("await loadAvatar()")
  })

  it("inisial dari backend tetap dioper sebagai cadangan terakhir", () => {
    expect(hero()).toContain(':initials="photo.initials"')
  })
})

/** Isi satu tag pembuka, supaya "ada `preview`" dibaca di tempatnya. */
function openingTag(source: string, name: string) {
  const start = source.indexOf(`<${name}`)

  return start < 0 ? "" : source.slice(start, source.indexOf(">", start) + 1)
}

describe("klik foto → gambar utuh", () => {
  it("hero /me menyalakan pratinjaunya, dengan nama orangnya sebagai judul", () => {
    expect(openingTag(hero(), "MAvatar")).toContain("preview")
    expect(hero()).toContain(':preview-title="fullName"')
  })

  it("kepala Detail/Edit pegawai ikut menyalakannya", () => {
    const header = read("../../hr/employees/components/EmployeesHeader.vue")

    expect(openingTag(header, "EmployeeAvatar")).toContain("preview")

    const component = read("../../hr/employees/components/EmployeeAvatar.vue")

    expect(component).toContain(':preview="props.preview"')
    expect(component).toContain(':preview-title="avatar.name"')
  })

  it("baris daftar pegawai tidak: fotonya tetap penanda, bukan tombol", () => {
    const columns = read("../../hr/employees/columns.ts")

    expect(columns).not.toContain("preview")

    // Bawaan `EmployeeAvatar` mati, jadi pemanggil yang diam tetap diam.
    const component = read("../../hr/employees/components/EmployeeAvatar.vue")

    expect(component).toMatch(/preview: false/)
  })

  it("gambar besarnya tidak menembak `/api/me/avatar/` untuk kedua kali", () => {
    const component = read("../../../../framework/components/feedback/MAvatar.vue")

    // Dialognya dioper object URL yang sudah dipegang avatarnya.
    expect(component).toMatch(/<MImagePreviewDialog[\s\S]*?:src="resolved"/)
    expect(component).not.toMatch(/fetch\(|createObjectURL/)
  })
})

describe("ukuran avatar per layar", () => {
  it("hero /me 64px, bulat", () => {
    expect(hero()).toContain('size="size-16"')
  })

  it("kepala Detail/Edit pegawai 56px", () => {
    const component = read("../../hr/employees/components/EmployeeAvatar.vue")

    expect(component).toMatch(/md: \{ size: "size-14"/)

    const header = read("../../hr/employees/components/EmployeesHeader.vue")

    expect(header).toContain('size="md"')
    expect(header).toContain("size-14 shrink-0 rounded-full")
  })

  it("baris tabel pegawai 32px", () => {
    const component = read("../../hr/employees/components/EmployeeAvatar.vue")

    expect(component).toMatch(/sm: \{ size: "size-8"/)
  })

  it("pratinjau widget unggah 80px", () => {
    const field = read("../../../../framework/components/forms/MUploadField.vue")

    expect(field).toContain("size-20 rounded-lg")
  })
})
