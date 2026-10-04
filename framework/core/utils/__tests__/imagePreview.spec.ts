import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import {
  imagePreviewState,
  imagePreviewTitle,
  isPreviewableImage,
} from "../imagePreview"

/*
| Lightbox lampiran gambar.
|
| Repo ini menjalankan vitest di `node` tanpa DOM, jadi yang diuji di
| sini keputusannya — kapan kotaknya boleh dibuka, apa isinya pada tiap
| keadaan, dan dari mana alamat gambarnya datang. Bahwa klik benar-benar
| membuka kotaknya dijamin UAT browser
| (`scripts/uat/employee-avatar-persist.mjs`,
| `scripts/uat/candidate-attachment.mjs`).
*/

function read(path: string) {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8")
}

const preview = () => read("../../../components/forms/MUploadPreview.vue")
const dialog = () => read("../../../components/feedback/MImagePreviewDialog.vue")
const field = () => read("../../../components/forms/MUploadField.vue")

const IMAGE = {
  original_name: "citra.jpg",
  file_type: "image",
  mime_type: "image/jpeg",
  preview_url: "http://demo.localhost:8000/api/uploads/abc/preview/",
  download_url: "http://demo.localhost:8000/api/uploads/abc/download/",
}

const PDF = {
  original_name: "kontrak.pdf",
  file_type: "document",
  mime_type: "application/pdf",
  preview_url: "http://demo.localhost:8000/api/uploads/def/preview/",
}

describe("isPreviewableImage", () => {
  it("gambar tersimpan bisa dibuka besar", () => {
    expect(isPreviewableImage(IMAGE)).toBe(true)
  })

  it("gambar yang baru diunggah (payload unggahan) juga", () => {
    expect(isPreviewableImage({ ...IMAGE, file_type: "image" }, true)).toBe(true)
  })

  it("berkas PDF/dokumen tidak dipaksa masuk penampil gambar", () => {
    expect(isPreviewableImage(PDF, true)).toBe(false)
    expect(isPreviewableImage(null, true)).toBe(false)
  })
})

describe("imagePreviewState", () => {
  it("alamat sudah didapat → gambarnya ditampilkan", () => {
    expect(imagePreviewState({ detail: IMAGE, url: "blob:fake/1" })).toBe("ready")
  })

  it("sedang diambil → pemutar, bukan gambar rusak", () => {
    expect(imagePreviewState({ detail: IMAGE, pending: true })).toBe("loading")
  })

  it("gagal diambil → keadaan galat yang bersih", () => {
    expect(imagePreviewState({ detail: IMAGE, failed: true })).toBe("error")
  })

  it("belum diminta sama sekali → dianggap sedang dimuat", () => {
    expect(imagePreviewState({ detail: IMAGE })).toBe("loading")
  })

  it("bukan gambar → tidak ada yang dibuka", () => {
    expect(imagePreviewState({ detail: PDF, imageMode: true })).toBe("none")
  })
})

describe("imagePreviewTitle", () => {
  it("memakai nama berkas aslinya", () => {
    expect(imagePreviewTitle(IMAGE)).toBe("citra.jpg")
  })

  it("tanpa nama tetap punya judul", () => {
    expect(imagePreviewTitle({ ...IMAGE, original_name: "  " })).toBe("Image")
    expect(imagePreviewTitle(null)).toBe("Image")
  })
})

describe("sambungan komponen", () => {
  it("thumbnail gambar bisa diklik dan difokus", () => {
    expect(preview()).toMatch(/role="previewable \? 'button' : undefined"|:role="previewable/)
    expect(preview()).toContain("@click.stop=\"open\"")
    expect(preview()).toContain("@keydown.enter.prevent=\"open\"")
    expect(preview()).toContain("cursor-zoom-in")
  })

  it("kliknya membuka dialog, bukan tab baru", () => {
    expect(preview()).toContain("<MImagePreviewDialog")
    expect(preview()).not.toContain("window.open")
    expect(preview()).not.toContain("target=\"_blank\"")
  })

  it("dialog memakai object URL yang sudah ada — tanpa unduhan kedua", () => {
    expect(preview()).toContain(":src=\"resolved\"")
    expect(dialog()).not.toMatch(/fetch\(|createObjectURL/)
  })

  it("dialog tidak mencabut blob yang masih dipakai thumbnail", () => {
    expect(dialog()).not.toContain("revokeObjectURL")
  })

  it("tidak ada alamat penyimpanan mentah di jalur pratinjau", () => {
    for (const source of [preview(), dialog()]) {
      expect(source).not.toContain("/media/")
      expect(source).not.toContain("file_url")
      expect(source).not.toMatch(/token=|access_token/)
    }
  })

  it("nama berkas dan tombol tutup ada di kepala dialog", () => {
    expect(dialog()).toContain("<DialogTitle")
    expect(dialog()).toContain("{{ title }}")

    // Escape, klik overlay, dan tombol X datang dari `DialogContent`
    // bersama — bukan ditulis ulang di sini.
    expect(dialog()).toContain("<DialogContent")
  })

  it("unduh dari dialog memakai jalur bertoken milik widget", () => {
    expect(dialog()).toContain("emit('download')")
    expect(preview()).toContain("@download=\"emit('download')\"")
    expect(field()).toContain("@download=\"downloadFile(fileDetail)\"")
    expect(field()).toContain("downloadAuthedFile(")
  })

  it("keadaan muat dan galat punya tampilannya sendiri", () => {
    expect(dialog()).toContain("animate-spin")
    expect(dialog()).toContain("Image could not be loaded.")
    expect(dialog()).toContain("@error=\"broken = true\"")
  })

  it("gambar dipasang utuh (contain), bukan dipotong", () => {
    expect(dialog()).toContain("object-contain")

    // Tinggi 75–78vh dan lebar 90vw sampai 940px: kotak yang menimpa
    // halaman, bukan kotak yang menggantikannya.
    expect(dialog()).toContain("max-h-[75vh]")
    expect(dialog()).toContain("sm:max-h-[78vh]")
    expect(dialog()).toContain("sm:max-w-[min(940px,90vw)]")
    expect(dialog()).toContain("max-w-[calc(100%-1.5rem)]")
  })

  it("gambar kecil tidak diregangkan", () => {
    // Batas atas saja — tidak ada `w-full`/`h-full` pada gambarnya.
    expect(dialog()).toContain("h-auto max-h-[calc(75vh-2rem)] w-auto max-w-full")

    const classes = (dialog().split("<img")[1] ?? "")
      .split("class=\"")[1]
      ?.split("\"")[0]
      ?.split(/\s+/) ?? []

    expect(classes).not.toContain("w-full")
    expect(classes).not.toContain("h-full")
  })

  it("berkas bukan gambar tetap memakai jalur lamanya", () => {
    expect(field()).toContain("previewAuthedFile(")
    expect(field()).toContain("preview?.previewable")
  })
})
