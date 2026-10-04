import { describe, expect, it } from 'vitest'

import {
  activeStatCarouselPage,
  statCarouselPages,
  visibleCardCount,
} from '@framework/core/utils/statCarousel'

import type { StatCarouselMetrics } from '@framework/core/utils/statCarousel'

/*
| Perhitungan baris KPI yang digulir mendatar.
|
| Yang dijaga di sini bukan angka piksel milik satu layar, melainkan tiga
| janji yang membuat indikatornya bisa dipercaya:
|
|   1. jumlah kartu yang terlihat DIUKUR, bukan ditebak dari breakpoint
|   2. halaman terakhir mendarat tepat di ujung track — tidak di posisi
|      yang browser tolak lalu bulatkan sendiri
|   3. titik yang menyala selalu titik terdekat, termasuk saat trackpad
|      berhenti di tengah-tengah dua halaman
|
| Angka di bawah memakai kartu 200px + jarak 16px (step 216) supaya
| hitungannya bisa dibaca ulang tanpa kalkulator.
*/

const STEP = 216

function metrics(overrides: Partial<StatCarouselMetrics> = {}): StatCarouselMetrics {
  const total = overrides.total ?? 8
  const viewport = overrides.viewport ?? STEP * 5

  return {
    scrollLeft: 0,
    // Isi track = total × step, dikurangi jarak terakhir yang tidak ada.
    maxScroll: Math.max(0, total * STEP - 16 - viewport),
    step: STEP,
    viewport,
    total,
    ...overrides,
  }
}

describe('visibleCardCount', () => {
  it('mengukur dari lebar track, bukan dari daftar breakpoint', () => {
    expect(visibleCardCount(metrics({ viewport: STEP * 5 }))).toBe(5)
    expect(visibleCardCount(metrics({ viewport: STEP * 4 }))).toBe(4)
    expect(visibleCardCount(metrics({ viewport: STEP * 3 }))).toBe(3)
  })

  it('menghitung intipan kartu berikutnya di ponsel sebagai satu kartu', () => {
    // Kartu selebar 86% layar: yang terlihat satu, sisanya cuma isyarat
    // bahwa areanya bisa digeser.
    const mobile = metrics({ viewport: 360, step: 360 * 0.86 + 16 })

    expect(visibleCardCount(mobile)).toBe(1)
  })

  it('tidak pernah melebihi jumlah kartu yang ada', () => {
    expect(visibleCardCount(metrics({ total: 4, viewport: STEP * 5 }))).toBe(4)
  })

  it('menganggap semua kartu terlihat selama belum diukur', () => {
    // Render di server dan frame pertama di klien. Indikator dan panah
    // ikut disembunyikan pemanggilnya, bukan berkedip di posisi salah.
    const unmeasured = metrics({ step: 0, viewport: 0, maxScroll: 0 })

    expect(visibleCardCount(unmeasured)).toBe(8)
    expect(statCarouselPages(unmeasured)).toEqual([0])
  })
})

describe('statCarouselPages', () => {
  it('membagi delapan kartu menjadi dua halaman saat lima terlihat', () => {
    const pages = statCarouselPages(metrics())

    expect(pages).toHaveLength(2)
    expect(pages[0]).toBe(0)
  })

  it('menjepit halaman terakhir ke ujung track', () => {
    const state = metrics()
    const pages = statCarouselPages(state)

    // 5 × step = 1080 melewati batas gulirnya; yang dipakai batasnya.
    expect(pages.at(-1)).toBe(state.maxScroll)
    expect(pages.at(-1)!).toBeLessThan(5 * STEP)
  })

  it('memberi satu titik per kartu saat hanya satu kartu terlihat', () => {
    const mobile = metrics({ viewport: STEP, total: 6 })

    expect(statCarouselPages(mobile)).toHaveLength(6)
  })

  it('tidak memberi halaman kedua kalau tidak ada yang bisa digulir', () => {
    expect(statCarouselPages(metrics({ total: 4, maxScroll: 0 }))).toEqual([0])
  })

  it('tidak menghasilkan dua halaman di titik henti yang sama', () => {
    const pages = statCarouselPages(metrics({ total: 9, viewport: STEP * 4 }))

    const distinct = new Set(pages)

    expect(distinct.size).toBe(pages.length)
  })
})

describe('activeStatCarouselPage', () => {
  it('menyalakan titik pertama di awal track', () => {
    expect(activeStatCarouselPage(metrics())).toBe(0)
  })

  it('menyalakan titik terakhir di ujung track', () => {
    const state = metrics()

    expect(
      activeStatCarouselPage({ ...state, scrollLeft: state.maxScroll }),
    ).toBe(statCarouselPages(state).length - 1)
  })

  it('memilih titik terdekat saat gulirnya berhenti di tengah', () => {
    const state = metrics({ total: 9, viewport: STEP * 3 })
    const pages = statCarouselPages(state)

    // Tepat di antara halaman kedua dan ketiga, sedikit condong ke kedua.
    const between = (pages[1]! + pages[2]!) / 2 - 10

    expect(activeStatCarouselPage({ ...state, scrollLeft: between })).toBe(1)
  })

  it('mengikuti kartu satu per satu di ponsel', () => {
    const mobile = metrics({ viewport: STEP, total: 6 })

    expect(activeStatCarouselPage({ ...mobile, scrollLeft: STEP * 2 })).toBe(2)
    expect(activeStatCarouselPage({ ...mobile, scrollLeft: STEP * 3 })).toBe(3)
  })
})
