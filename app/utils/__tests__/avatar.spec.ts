import { describe, expect, it } from "vitest"

import { avatarInitials } from "../avatar"

describe("avatarInitials", () => {
  it("mengambil huruf depan nama pertama dan terakhir", () => {
    expect(avatarInitials("Adrian Mahendra")).toBe("AM")
    expect(avatarInitials("Ahmad Sudrajat")).toBe("AS")
    expect(avatarInitials("Citra Halimah")).toBe("CH")
  })

  it("menggabungkan potongan nama yang dikirim terpisah", () => {
    expect(avatarInitials("Adrian", "Mahendra")).toBe("AM")
  })

  it("melompati nama tengah — yang diambil yang pertama dan terakhir", () => {
    expect(avatarInitials("Raden Bagus Wicaksono")).toBe("RW")
  })

  it("memberi satu huruf untuk nama satu kata", () => {
    expect(avatarInitials("Sukarno")).toBe("S")
    expect(avatarInitials("Bimo", "")).toBe("B")
    expect(avatarInitials("", "Nugroho")).toBe("N")
  })

  /*
   * Baris yang namanya disaring policy atau belum terisi tetap harus
   * menghasilkan sesuatu. `?` dipilih karena terbaca sebagai "datanya
   * tidak ada", bukan sebagai gambar yang gagal dimuat.
   */
  it("aman untuk nama yang hilang, null, atau hanya spasi", () => {
    expect(avatarInitials()).toBe("?")
    expect(avatarInitials(null, undefined)).toBe("?")
    expect(avatarInitials("   ")).toBe("?")
    expect(avatarInitials("", "")).toBe("?")
  })

  it("selalu huruf besar dan tidak terganggu spasi berlebih", () => {
    expect(avatarInitials("  adrian   mahendra  ")).toBe("AM")
  })
})
