/*
| Perilaku kolom tanggal dari ujung ke ujung: hidrasi Edit, ketikan,
| blur, dan gema `update:modelValue` dari induk — semuanya tanpa DOM.
|
| `parent` di bawah bukan mock: ia persis apa yang dilakukan `v-model`
| di `MFormBuilder` — menyimpan nilai yang dipancarkan lalu
| mengembalikannya sebagai prop. Gema itu yang paling sering merusak
| kolom berformat, dan hanya terlihat kalau ikut disimulasikan.
*/
import { describe, expect, it } from "vitest"
import { effectScope, ref } from "vue"

import { useDateFieldModel } from "../useDateFieldModel"

type Field = ReturnType<typeof useDateFieldModel>

/* Satu kolom tanggal beserta induknya. */
function mount(initial: string | null = null) {
  const scope = effectScope()

  /*
  | Apa yang akan dikirim ke API kalau Save ditekan sekarang.
  |
  | `ref`, bukan objek biasa: induk yang sebenarnya reaktif, dan
  | watcher hidrasi hanya menembak kalau sumbernya ikut reaktif. Objek
  | biasa membuat seluruh test hidrasi di bawah hijau tanpa pernah
  | menjalankan watcher-nya.
  */
  const payload = ref<string | null>(initial)

  /* Tiap nilai yang pernah dipancarkan, untuk memeriksa yang berlebih. */
  const emitted: (string | null)[] = []

  let field!: Field

  scope.run(() => {
    field = useDateFieldModel({
      value: () => payload.value,
      emit: (next) => {
        emitted.push(next)
        payload.value = next
      },
    })
  })

  /* Data Edit yang datang sesudah form terpasang. */
  function hydrate(value: string | null) {
    payload.value = value
  }

  /* Mengetik satu string, karakter demi karakter. */
  function type(value: string) {
    for (let i = 1; i <= value.length; i++)
      field.onInput(value.slice(0, i))
  }

  /* Mengganti sebagian isi kotak tanpa mengetik ulang seluruhnya. */
  function replaceRange(start: number, end: number, insert: string) {
    const next = field.text.value.slice(0, start)
      + insert
      + field.text.value.slice(end)

    field.onInput(next)
  }

  return { field, payload, emitted, hydrate, type, replaceRange, scope }
}

describe("create", () => {
  it("25.09.26 -> 2026-09-25", () => {
    const f = mount()

    f.type("25.09.26")
    f.field.onBlur()

    expect(f.payload.value).toBe("2026-09-25")
    expect(f.field.text.value).toBe("25.09.26")
  })

  it("25.9.26 -> 2026-09-25, lalu dirapikan saat blur", () => {
    const f = mount()

    f.type("25.9.26")

    expect(f.payload.value).toBe("2026-09-25")

    f.field.onBlur()

    expect(f.field.text.value).toBe("25.09.26")
    expect(f.payload.value).toBe("2026-09-25")
  })

  it("kotak kosong tetap kosong, bukan 'hari ini'", () => {
    const f = mount()

    expect(f.field.text.value).toBe("")
    expect(f.payload.value).toBeNull()
    expect(f.emitted).toEqual([])
  })

  it("yang diketik tidak ditulis ulang di tengah jalan", () => {
    const f = mount()

    f.type("25.09.26")

    // Kalau gema induk menyusun ulang string-nya, `text` akan sudah
    // menjadi "25.09.26" hasil format ulang pada ketukan ke-8 dan
    // kursor sudah pindah. Yang dijaga: isinya persis yang diketik.
    expect(f.field.text.value).toBe("25.09.26")
  })
})

describe("edit — hidrasi", () => {
  it("2026-09-25 dari API tampil sebagai 25.09.26", () => {
    const f = mount()

    f.hydrate("2026-09-25")

    expect(f.field.text.value).toBe("25.09.26")
  })

  it("nilai awal langsung tampil dalam bentuk tampilan", () => {
    const f = mount("2026-09-25")

    expect(f.field.text.value).toBe("25.09.26")
  })

  it("tidak pernah menampilkan ISO di kotak", () => {
    const f = mount("2027-03-08")

    expect(f.field.text.value).toBe("08.03.27")
    expect(f.field.text.value).not.toMatch(/^\d{4}-/)
  })

  it("hidrasi tidak memancarkan apa pun", () => {
    const f = mount()

    f.hydrate("2026-09-25")

    expect(f.emitted).toEqual([])
  })

  it("submit tanpa mengubah apa pun mengirim tanggal yang sama", () => {
    const f = mount("2026-09-25")

    // Dibuka, dilihat, ditinggalkan — tanpa satu ketukan pun.
    f.field.onBlur()

    expect(f.payload.value).toBe("2026-09-25")
    expect(f.emitted).toEqual([])
  })

  it("blur pada kolom yang tidak disentuh tidak mengubah nilainya", () => {
    const f = mount("1965-03-15")

    expect(f.field.text.value).toBe("15.03.1965")

    f.field.onBlur()

    expect(f.payload.value).toBe("1965-03-15")
    expect(f.field.text.value).toBe("15.03.1965")
  })
})

/*
| Regresi `2027-09-2026`.
|
| Yang terjadi sebelumnya: kotaknya menampilkan ISO, dan apa pun yang
| keluar darinya ditebak sebagai hari-dulu. Menyentuh kolomnya sekali
| sudah cukup — `2026-09-27` dibaca hari=2026, tahun=27.
*/
describe("edit — sunting sebagian", () => {
  it("mengganti tahun tidak menggeser hari/bulan", () => {
    const f = mount("2026-09-25")

    expect(f.field.text.value).toBe("25.09.26")

    // Dua karakter terakhir saja: 26 -> 27.
    f.replaceRange(6, 8, "27")
    f.field.onBlur()

    expect(f.field.text.value).toBe("25.09.27")
    expect(f.payload.value).toBe("2027-09-25")
  })

  it("mengganti hari tidak mengubah tahun", () => {
    const f = mount("2026-09-25")

    f.replaceRange(0, 2, "27")
    f.field.onBlur()

    expect(f.field.text.value).toBe("27.09.26")
    expect(f.payload.value).toBe("2026-09-27")
  })

  it("mengganti bulan tidak mengubah tahun maupun hari", () => {
    const f = mount("2026-09-25")

    f.replaceRange(3, 5, "10")
    f.field.onBlur()

    expect(f.field.text.value).toBe("25.10.26")
    expect(f.payload.value).toBe("2026-10-25")
  })

  it("tidak pernah menghasilkan nilai bertahun-di-belakang", () => {
    const f = mount("2026-09-25")

    f.replaceRange(6, 8, "27")
    f.field.onBlur()

    for (const value of [...f.emitted, f.payload.value]) {
      expect(value).not.toBe("2027-09-2026")

      if (value !== null)
        expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it("membuka-menyunting-membuka lagi tetap konsisten", () => {
    const f = mount("2026-09-25")

    f.replaceRange(6, 8, "27")
    f.field.onBlur()

    expect(f.payload.value).toBe("2027-09-25")

    // Muat ulang: API mengembalikan apa yang baru disimpan.
    const reopened = mount(f.payload.value)

    expect(reopened.field.text.value).toBe("25.09.27")

    reopened.field.onBlur()

    expect(reopened.payload.value).toBe("2027-09-25")
  })
})

describe("tanggal yang tidak sah", () => {
  it("31.02.26 ditolak, bukan digulirkan ke Maret", () => {
    const f = mount()

    f.type("31.02.26")
    f.field.onBlur()

    expect(f.payload.value).toBeNull()
    expect(f.field.malformed.value).toBe(true)
    expect(f.field.text.value).toBe("31.02.26")
  })

  it("29.02.25 ditolak, 29.02.28 diterima", () => {
    const invalid = mount()
    invalid.type("29.02.25")
    invalid.field.onBlur()

    expect(invalid.payload.value).toBeNull()
    expect(invalid.field.malformed.value).toBe(true)

    const leap = mount()
    leap.type("29.02.28")
    leap.field.onBlur()

    expect(leap.payload.value).toBe("2028-02-29")
    expect(leap.field.malformed.value).toBe(false)
  })

  it("keluhan ditahan sampai kotaknya ditinggalkan", () => {
    const f = mount()

    f.field.onInput("25.0")

    expect(f.field.malformed.value).toBe(true)
    expect(f.field.touched.value).toBe(false)

    f.field.onBlur()

    expect(f.field.touched.value).toBe(true)
  })

  it("yang tidak sah mengosongkan model, tidak membiarkan nilai lama", () => {
    const f = mount("2026-09-25")

    f.field.onInput("31.02.26")

    // Kalau nilai lama dibiarkan, Save menulis 2026-09-25 sementara
    // kotaknya menampilkan 31.02.26.
    expect(f.payload.value).toBeNull()
  })

  it("mengosongkan kolom mengirim null, bukan string kosong", () => {
    const f = mount("2026-09-25")

    f.field.onInput("")

    expect(f.payload.value).toBeNull()
    expect(f.emitted).toEqual([null])
  })
})

describe("nilai yang dibersihkan induk", () => {
  it("induk yang mengosongkan kolom mengosongkan kotaknya juga", () => {
    const f = mount("2026-09-25")

    // `MFormBuilder` menihilkan field turunan saat induknya berubah.
    f.hydrate(null)

    expect(f.field.text.value).toBe("")
  })

  it("induk yang mengganti nilai memasang bentuk tampilan yang baru", () => {
    const f = mount("2026-09-25")

    f.hydrate("2026-12-31")

    expect(f.field.text.value).toBe("31.12.26")
  })

  it("nilai yang bukan ISO ditampilkan apa adanya, bukan dikosongkan", () => {
    const f = mount()

    f.hydrate("2026-09-25T07:00:00Z")

    expect(f.field.text.value).toBe("2026-09-25T07:00:00Z")
  })
})

describe("tanpa emit berlebih", () => {
  it("mengetik ulang nilai yang sama tidak memancarkan apa-apa", () => {
    const f = mount("2026-09-25")

    f.field.onInput("25.09.26")

    expect(f.emitted).toEqual([])
  })

  it("blur setelah 25.9.26 tidak memancarkan ulang", () => {
    const f = mount()

    f.field.onInput("25.9.26")

    expect(f.emitted).toEqual(["2026-09-25"])

    f.field.onBlur()

    expect(f.emitted).toEqual(["2026-09-25"])
  })
})
