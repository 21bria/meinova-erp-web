/*
| Rentang tanggal: padanan JS dari `apps/framework/list_period.py`.
|
| Angka-angka di bawah **sengaja kembar** dengan test Python di
| `apps/hr/tests/attendance/test_attendance_list_period.py`. Itu yang
| diuji berkas ini: bukan bahwa fungsinya jalan, melainkan bahwa kedua
| sisi menurunkan periode yang sama dari kode preset yang sama.
|
| Kalau keduanya berbeda, gagalnya diam dan menyesatkan — layar
| menampilkan "1 Feb — 28 Feb" sambil meminta rentang lain, dan yang
| melihatnya menyimpulkan datanya yang hilang.
*/
import { describe, expect, it } from "vitest"

import {
  DEFAULT_DATE_RANGE,
  dateRangeKeys,
  matchPreset,
  rangeDays,
  resolveFilterDefaults,
  resolvePreset,
} from "../dateRange"

// 10 Maret 2026. Dijangkarkan supaya hasilnya tidak bergantung pada
// hari test-nya dijalankan.
const ANCHOR = new Date(2026, 2, 10)

describe("resolvePreset", () => {
  it.each([
    ["today", { from: "2026-03-10", to: "2026-03-10" }],
    ["last_7_days", { from: "2026-03-04", to: "2026-03-10" }],
    ["this_month", { from: "2026-03-01", to: "2026-03-10" }],
    ["last_month", { from: "2026-02-01", to: "2026-02-28" }],
  ])("%s", (code, expected) => {
    expect(resolvePreset(code, ANCHOR)).toEqual(expected)
  })

  it('"7 hari terakhir" berisi tujuh tanggal, bukan delapan', () => {
    expect(rangeDays(resolvePreset("last_7_days", ANCHOR))).toBe(7)
  })

  it("current_month sama dengan this_month", () => {
    expect(resolvePreset("current_month", ANCHOR))
      .toEqual(resolvePreset("this_month", ANCHOR))
  })

  it("bulan lalu ikut hari kabisat", () => {
    expect(resolvePreset("last_month", new Date(2024, 2, 5)))
      .toEqual({ from: "2024-02-01", to: "2024-02-29" })
  })

  it("bulan lalu menyeberang tahun", () => {
    expect(resolvePreset("last_month", new Date(2026, 0, 15)))
      .toEqual({ from: "2025-12-01", to: "2025-12-31" })
  })

  it("kode tak dikenal jatuh ke bulan berjalan, bukan ke kosong", () => {
    // Kosong berarti seluruh sejarah — kebalikan dari maksud penyaring
    // ini, dan justru itu yang membuatnya berbahaya sebagai fallback.
    expect(resolvePreset("nonsense", ANCHOR))
      .toEqual(resolvePreset("this_month", ANCHOR))
  })
})

describe("rangeDays", () => {
  it("menghitung inklusif di kedua ujung", () => {
    expect(rangeDays({ from: "2026-03-01", to: "2026-03-01" })).toBe(1)
    expect(rangeDays({ from: "2026-03-01", to: "2026-03-31" })).toBe(31)
  })

  it("rentang setengah jadi bernilai nol", () => {
    expect(rangeDays({ from: "2026-03-01", to: null })).toBe(0)
    expect(rangeDays({ from: null, to: null })).toBe(0)
  })

  it("tidak tergelincir oleh pergantian musim panas", () => {
    // Selisih jam dihitung dari tanggal lokal, bukan dari UTC — kalau
    // tidak, satu rentang bisa terbaca 89,96 hari dan dibulatkan salah.
    expect(rangeDays({ from: "2026-03-01", to: "2026-05-30" })).toBe(91)
  })
})

describe("resolveFilterDefaults", () => {
  it("satu penyaring rentang menghasilkan dua kunci query", () => {
    const values = resolveFilterDefaults([
      {
        key: "work_date",
        type: "dateRange",
        fromKey: "date_from",
        toKey: "date_to",
        defaultRange: "current_month",
      },
      { key: "status", type: "select" },
    ])

    expect(Object.keys(values).sort()).toEqual(["date_from", "date_to"])
    expect(values.date_from).toBe(resolvePreset("current_month").from)
    expect(values.date_to).toBe(resolvePreset("current_month").to)
  })

  it("tanpa fromKey/toKey memakai nama yang dibaca backend", () => {
    expect(Object.keys(resolveFilterDefaults([
      { key: "d", type: "dateRange" },
    ])).sort()).toEqual(["date_from", "date_to"])
  })

  it("penyaring biasa hanya ikut kalau punya defaultValue", () => {
    expect(resolveFilterDefaults([
      { key: "status", type: "select" },
      { key: "source", type: "select", defaultValue: "device" },
    ])).toEqual({ source: "device" })
  })

  it("daftar kosong menghasilkan bawaan kosong", () => {
    expect(resolveFilterDefaults([])).toEqual({})
    expect(resolveFilterDefaults(undefined)).toEqual({})
  })

  it("bawaannya bulan berjalan", () => {
    expect(DEFAULT_DATE_RANGE).toBe("this_month")
  })
})

describe("matchPreset", () => {
  it("mengenali rentang yang persis sama dengan sebuah preset", () => {
    expect(matchPreset(resolvePreset("last_month"))).toBe("last_month")
    expect(matchPreset(resolvePreset("today"))).toBe("today")
  })

  it("rentang bebas tidak dicocokkan ke preset mana pun", () => {
    expect(matchPreset({ from: "2001-01-01", to: "2001-01-02" })).toBeNull()
  })
})

describe("dateRangeKeys", () => {
  it("memakai nama dari schema kalau ada", () => {
    expect(dateRangeKeys({
      key: "d",
      type: "dateRange",
      fromKey: "start",
      toKey: "end",
    })).toEqual(["start", "end"])
  })

  it("jatuh ke date_from/date_to kalau schema tidak menyebutkannya", () => {
    expect(dateRangeKeys({ key: "d", type: "dateRange" }))
      .toEqual(["date_from", "date_to"])
  })
})
