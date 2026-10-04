import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

/*
| Foto profil yang bisa diklik (`MAvatar preview`).
|
| Vitest di repo ini berjalan di `node` tanpa DOM, jadi yang dikunci di
| sini aturannya, dibaca dari sumber komponennya: kapan avatar menjadi
| tombol, kapan ia **tetap** sekadar gambar, dan dari mana gambar besar
| itu datang. Bahwa kliknya benar-benar membuka kotak dibuktikan UAT
| browser (`scripts/uat/self-avatar-hero.mjs`,
| `scripts/uat/employee-avatar-persist.mjs`).
*/

function read(path: string) {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8")
}

const avatar = () => read("../feedback/MAvatar.vue")
const dialog = () => read("../feedback/MImagePreviewDialog.vue")
const identityCell = () => read("../table/MIdentityCell.vue")

describe("mAvatar — kapan fotonya bisa diklik", () => {
  it("bawaannya mati: pemanggil lama tidak berubah perilakunya", () => {
    expect(avatar()).toMatch(/preview\?: boolean/)
    expect(avatar()).toMatch(/preview: false/)
  })

  it("interaktif menuntut tiga-tiganya: dinyalakan, ada alamat, tidak gagal", () => {
    expect(avatar()).toContain(
      "() => props.preview && Boolean(resolved.value) && !broken.value,",
    )
  })

  it("inisial tidak pernah jadi tombol", () => {
    // `role`, `tabindex`, dan kursornya semua digantung ke `interactive`
    // yang sama — bukan ke `props.preview` saja.
    expect(avatar()).toContain("interactive ? 'button' : undefined")
    expect(avatar()).toContain("interactive ? 0 : undefined")
    expect(avatar()).toContain("interactive ? 'cursor-zoom-in")
  })

  it("gambar yang gagal dimuat kembali jadi tidak bisa diklik", () => {
    expect(avatar()).toContain("@loading-status-change=\"handleStatus\"")
    expect(avatar()).toContain("broken.value = status === \"error\"")

    // Kotak yang sempat terbuka ikut ditutup saat fotonya hilang.
    expect(avatar()).toMatch(/watch\(interactive[\s\S]*?dialogOpen\.value = false/)
  })

  it("klik yang tidak interaktif tidak membuka apa pun", () => {
    expect(avatar()).toMatch(
      /function open\(event\?: Event\) \{\s*if \(!interactive\.value\)\s*return/,
    )
  })

  it("papan ketik: Enter dan Space membuka", () => {
    expect(avatar()).toContain("@keydown.enter.prevent=\"open\"")
    expect(avatar()).toContain("@keydown.space.prevent=\"open\"")
  })

  it("punya label yang menyebut siapa fotonya", () => {
    expect(avatar()).toContain("Preview photo of ")
    expect(avatar()).toContain("previewTitle")
  })
})

describe("mAvatar — gambar besarnya", () => {
  it("memakai kotak bersama, bukan lightbox kedua", () => {
    expect(avatar()).toContain("<MImagePreviewDialog")
    expect(avatar()).not.toContain("<Dialog")
  })

  it("memakai object URL yang sudah diambil — tanpa permintaan kedua", () => {
    expect(avatar()).toContain(":src=\"resolved\"")

    // Satu-satunya pengambilan di komponen ini.
    expect(avatar().match(/useAuthedImage\(/g)).toHaveLength(1)
    expect(avatar()).not.toMatch(/fetch\(|createObjectURL|revokeObjectURL/)
  })

  it("bukan layar kelola berkas: tanpa tombol unduh", () => {
    expect(avatar()).toContain(":downloadable=\"false\"")
    expect(dialog()).toContain("v-if=\"downloadable\"")
  })

  it("tidak memakai alamat penyimpanan mentah atau token di URL", () => {
    expect(avatar()).not.toContain("/media/")
    expect(avatar()).not.toMatch(/token=|access_token/)
    expect(avatar()).not.toContain("/api/uploads/")
  })

  it("tetap berakar tunggal supaya `class` pemanggil tidak hilang", () => {
    const template = avatar().split("<template>")[1] ?? ""

    // Dialognya di dalam `Avatar`; isinya di-teleport `DialogContent`.
    expect(template.match(/<Avatar[\s>]/g)).toHaveLength(1)
    expect(template).toMatch(/<MImagePreviewDialog[\s\S]*?<\/Avatar>/)
  })
})

describe("yang sengaja tidak ikut", () => {
  it("sel identitas tabel tetap tidak bisa diklik fotonya", () => {
    expect(identityCell()).toContain("<MAvatar")
    expect(identityCell()).not.toContain("preview")
  })
})
