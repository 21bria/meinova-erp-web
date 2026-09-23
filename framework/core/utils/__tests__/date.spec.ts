/*
| Kontrak tanggal-tanpa-jam, satu-satunya yang dipakai seluruh ERP:
|
|     25.09.26  <->  2026-09-25
|
| Yang dijaga berkas ini bukan "fungsinya jalan" melainkan tiga janji
| yang kalau salah satunya lepas, tanggal berubah tanpa satu pun pesan:
|
|   1. idempoten — memanggilnya dua kali sama dengan sekali,
|   2. posisi DD/MM/YY tidak pernah bergeser,
|   3. tanggal yang tidak ada di kalender ditolak, bukan digulirkan.
|
| Janji pertama yang dulu tidak ada, dan itu melahirkan `2027-09-2026`.
*/
import { describe, expect, it } from "vitest"

import {
  DATE_DISPLAY_FORMAT,
  daysInMonth,
  expandTwoDigitYear,
  formatDateForDisplay,
  isISODate,
  isLeapYear,
  isValidCalendarDate,
  normalizeDateInput,
  parseDateInput,
} from "../date"

describe("parseDateInput — tampilan ke API", () => {
  it.each([
    ["25.09.26", "2026-09-25"],
    // Nol di depan boleh hilang: itu cara mengetik yang wajar.
    ["25.9.26", "2026-09-25"],
    ["5.9.26", "2026-09-05"],
    ["05.09.2026", "2026-09-05"],
    // Pemisah lain, arti yang sama — papan ketik numerik berbeda-beda.
    ["25-09-26", "2026-09-25"],
    ["25/09/26", "2026-09-25"],
  ])("%s -> %s", (input, expected) => {
    expect(parseDateInput(input)).toBe(expected)
  })

  it("mengembalikan ISO apa adanya, tidak menebaknya ulang", () => {
    expect(parseDateInput("2026-09-25")).toBe("2026-09-25")
    expect(parseDateInput("2026-09-27")).toBe("2026-09-27")
  })

  it("kosong bukan tanggal", () => {
    expect(parseDateInput("")).toBeNull()
    expect(parseDateInput("   ")).toBeNull()
    expect(parseDateInput(null)).toBeNull()
    expect(parseDateInput(undefined)).toBeNull()
  })

  it.each([
    "31.02.26",
    "29.02.25",
    "32.01.26",
    "25.13.26",
    "00.09.26",
    "25.00.26",
    "25.09.260",
    "abc",
    "25.09",
    "25.09.26.27",
    "2026-13-01",
    "2026-02-30",
  ])("menolak %s", (input) => {
    expect(parseDateInput(input)).toBeNull()
  })

  it("29 Februari hanya pada tahun kabisat", () => {
    expect(parseDateInput("29.02.28")).toBe("2028-02-29")
    expect(parseDateInput("29.02.24")).toBe("2024-02-29")
    expect(parseDateInput("29.02.25")).toBeNull()
    expect(parseDateInput("29.02.2100")).toBeNull()
    expect(parseDateInput("29.02.2000")).toBe("2000-02-29")
  })
})

describe("formatDateForDisplay — API ke tampilan", () => {
  it.each([
    ["2026-09-25", "25.09.26"],
    ["2026-09-05", "05.09.26"],
    ["2027-09-25", "25.09.27"],
    ["2000-01-01", "01.01.00"],
  ])("%s -> %s", (input, expected) => {
    expect(formatDateForDisplay(input)).toBe(expected)
  })

  it("kosong tetap kosong", () => {
    expect(formatDateForDisplay(null)).toBe("")
    expect(formatDateForDisplay(undefined)).toBe("")
    expect(formatDateForDisplay("")).toBe("")
  })

  /*
  | Tahun yang tidak muat di dua digit ditulis lengkap.
  |
  | `1965` lewat `65` kembali sebagai 2065. Memendekkannya berarti
  | membuka lalu menyimpan ulang data pegawai memindahkan tanggal
  | lahirnya seratus tahun ke depan — persis kelas kesalahan yang
  | dihindari seluruh berkas ini.
  */
  it.each([
    ["1965-03-15", "15.03.1965"],
    ["1900-01-01", "01.01.1900"],
    ["2070-01-01", "01.01.2070"],
    // 1970–1999 justru muat, karena pivotnya 70.
    ["1985-06-30", "30.06.85"],
    ["1970-01-01", "01.01.70"],
  ])("%s ditulis lengkap/pendek sesuai round-trip: %s", (input, expected) => {
    expect(formatDateForDisplay(input)).toBe(expected)
    expect(parseDateInput(expected)).toBe(input)
  })

  it("yang bukan ISO dikembalikan apa adanya, tidak dikosongkan", () => {
    // Kotak kosong terbaca seperti data yang belum diisi, lalu Save
    // benar-benar mengosongkannya.
    expect(formatDateForDisplay("2026-09-25T07:00:00Z")).toBe("2026-09-25T07:00:00Z")
    expect(formatDateForDisplay("bukan tanggal")).toBe("bukan tanggal")
  })
})

describe("idempoten — tidak ada parsing/format ganda", () => {
  it("parse(parse(x)) === parse(x)", () => {
    for (const input of ["25.09.26", "25.9.26", "2026-09-25", "15.03.1965"]) {
      const once = parseDateInput(input)
      expect(parseDateInput(once)).toBe(once)
    }
  })

  it("format(format(x)) === format(x)", () => {
    for (const input of ["2026-09-25", "1965-03-15", ""]) {
      const once = formatDateForDisplay(input)
      expect(formatDateForDisplay(once)).toBe(once)
    }
  })

  /*
  | Regresi `2027-09-2026`.
  |
  | Versi lama memperlakukan tiap string bertiga-bagian sebagai
  | hari-dulu, jadi ISO dari API ditebak untuk kedua kalinya:
  | `2026-09-27` -> hari 2026, tahun 27 -> `2027-09-2026`. Nilai itu
  | lolos ke payload tanpa ada yang menyentuh kolomnya.
  */
  it.each([
    "2026-09-25",
    "2026-09-27",
    "2027-09-25",
    "2026-01-31",
  ])("%s tidak pernah menjadi nilai bertahun-di-belakang", (value) => {
    const out = normalizeDateInput(value)

    expect(out).toBe(value)
    expect(out).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(out).not.toMatch(/-\d{4}$/)
  })

  it("normalizeDateInput tetap menerjemahkan tampilan", () => {
    expect(normalizeDateInput("25.09.26")).toBe("2026-09-25")
    expect(normalizeDateInput("25.9.26")).toBe("2026-09-25")
  })

  it("normalizeDateInput mengembalikan yang tidak terbaca apa adanya", () => {
    expect(normalizeDateInput("31.02.26")).toBe("31.02.26")
    expect(normalizeDateInput("")).toBe("")
  })
})

describe("round-trip", () => {
  it.each([
    "2026-09-25",
    "2026-01-01",
    "2026-12-31",
    "2028-02-29",
    "2024-02-29",
    "1985-06-30",
    "1965-03-15",
  ])("%s -> tampilan -> kembali utuh", (value) => {
    expect(parseDateInput(formatDateForDisplay(value))).toBe(value)
  })
})

/*
| Sunting sebagian: posisi DD/MM/YY tetap, dan yang tidak disentuh
| tidak ikut berubah. Ini yang dijamin bentuk tampilan berposisi tetap
| — sesuatu yang tidak bisa dijanjikan kotak yang isinya ISO.
*/
describe("sunting sebagian", () => {
  const BASE = "2026-09-25"

  it("mengganti tahun tidak menggeser hari/bulan", () => {
    const shown = formatDateForDisplay(BASE)

    expect(shown).toBe("25.09.26")
    expect(parseDateInput("25.09.27")).toBe("2027-09-25")
  })

  it("mengganti hari tidak mengubah tahun", () => {
    expect(parseDateInput("27.09.26")).toBe("2026-09-27")
  })

  it("mengganti bulan tidak mengubah tahun maupun hari", () => {
    expect(parseDateInput("25.10.26")).toBe("2026-10-25")
  })

  it("membuka lalu menyimpan tanpa mengubah apa pun menghasilkan nilai yang sama", () => {
    const hydrated = formatDateForDisplay(BASE)

    expect(parseDateInput(hydrated)).toBe(BASE)
  })
})

/*
| Tanpa `Date` sama sekali, jadi tidak ada satu pun titik tempat zona
| waktu bisa menggeser tanggalnya.
|
| Dibuktikan dengan membuat `Date` melempar, bukan dengan menukar `TZ`:
| menukar `TZ` di tengah proses tidak selalu terbaca runtime yang sudah
| menyalakan Intl, jadi test-nya bisa hijau justru karena tidak
| berpengaruh. Yang di bawah tidak bisa hijau secara kebetulan — kalau
| ada yang menambahkan `new Date(...)` di `date.ts`, test ini merah.
*/
describe("tidak ada pergeseran zona waktu", () => {
  it("tidak menyentuh Date sama sekali", () => {
    const RealDate = globalThis.Date

    globalThis.Date = new Proxy(RealDate, {
      construct() {
        throw new Error("date.ts tidak boleh memakai Date")
      },
      apply() {
        throw new Error("date.ts tidak boleh memakai Date")
      },
    }) as DateConstructor

    try {
      expect(formatDateForDisplay("2026-09-25")).toBe("25.09.26")
      expect(parseDateInput("25.09.26")).toBe("2026-09-25")
      expect(parseDateInput("01.01.26")).toBe("2026-01-01")
      expect(formatDateForDisplay("2026-01-01")).toBe("01.01.26")
      expect(parseDateInput("31.12.26")).toBe("2026-12-31")
      expect(formatDateForDisplay("2026-12-31")).toBe("31.12.26")
    }
    finally {
      globalThis.Date = RealDate
    }
  })

  it("tanggal tepi tetap tanggal yang sama", () => {
    // Tengah malam dan akhir tahun adalah tempat `new Date("…")` mundur
    // sehari di zona barat.
    expect(parseDateInput("01.01.26")).toBe("2026-01-01")
    expect(parseDateInput("31.12.25")).toBe("2025-12-31")
  })
})

describe("primitif kalender", () => {
  it.each([
    [2024, true],
    [2025, false],
    [2026, false],
    [2028, true],
    [2000, true],
    [1900, false],
    [2100, false],
  ])("isLeapYear(%i) === %s", (year, expected) => {
    expect(isLeapYear(year)).toBe(expected)
  })

  it("daysInMonth", () => {
    expect(daysInMonth(2026, 2)).toBe(28)
    expect(daysInMonth(2028, 2)).toBe(29)
    expect(daysInMonth(2026, 1)).toBe(31)
    expect(daysInMonth(2026, 4)).toBe(30)
    expect(daysInMonth(2026, 13)).toBe(0)
  })

  it("isValidCalendarDate menolak gulir diam-diam", () => {
    expect(isValidCalendarDate(2026, 2, 31)).toBe(false)
    expect(isValidCalendarDate(2026, 2, 28)).toBe(true)
  })

  it("isISODate menuntut kalender, bukan sekadar bentuk", () => {
    expect(isISODate("2026-09-25")).toBe(true)
    expect(isISODate("2026-02-30")).toBe(false)
    expect(isISODate("25.09.26")).toBe(false)
    expect(isISODate(null)).toBe(false)
  })

  it("pivot tahun dua digit", () => {
    expect(expandTwoDigitYear(26)).toBe(2026)
    expect(expandTwoDigitYear(69)).toBe(2069)
    expect(expandTwoDigitYear(70)).toBe(1970)
    expect(expandTwoDigitYear(99)).toBe(1999)
  })

  it("contoh format yang dipakai placeholder/hint", () => {
    expect(DATE_DISPLAY_FORMAT).toBe("dd.mm.yy")
  })
})
