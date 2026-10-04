// framework/core/utils/statCarousel.ts

/*
|--------------------------------------------------------------------------
| Baris kartu KPI yang digulir mendatar
|--------------------------------------------------------------------------
|
| Perhitungan murni di balik `MDashboardStatCarousel`: berapa kartu yang
| sedang terlihat, di mana titik henti tiap "halaman", dan halaman mana
| yang sedang aktif. Semuanya berangkat dari angka yang diukur dari DOM
| (lebar, jarak antar kartu, posisi gulir) — tidak ada satu pun yang
| menyentuh DOM di sini, supaya bisa diuji tanpa browser.
|
| Kenapa "halaman", bukan satu titik per kartu: di ponsel satu layar
| memang satu kartu, jadi halaman dan kartu berarti sama persis dan
| indikatornya tetap sedetail sekarang. Di layar lebar lima kartu
| terlihat sekaligus — delapan titik di sana tidak memberi tahu apa pun
| yang belum kelihatan, dan justru terbaca seperti ada delapan layar
| yang belum dibuka.
*/

export interface StatCarouselMetrics {
  /** Posisi gulir mendatar saat ini, px. */
  scrollLeft: number
  /** Batas gulir: `scrollWidth - clientWidth`, px. */
  maxScroll: number
  /** Jarak antar-kartu (lebar kartu + jarak), px. */
  step: number
  /** Lebar area yang terlihat (`clientWidth`), px. */
  viewport: number
  /** Jumlah kartu di dalam track. */
  total: number
}

export const EMPTY_STAT_CAROUSEL_METRICS: StatCarouselMetrics = {
  scrollLeft: 0,
  maxScroll: 0,
  step: 0,
  viewport: 0,
  total: 0,
}

/**
 * Jumlah kartu yang muat dalam satu layar.
 *
 * Diturunkan dari hasil ukur, **bukan** dari daftar breakpoint yang
 * ditulis dua kali. Lebar kartu ditentukan CSS (`basis-*` per
 * breakpoint); kalau angkanya besok digeser, yang di sini ikut sendiri.
 * Dua sumber kebenaran untuk hal yang sama adalah cara paling sunyi
 * untuk membuat indikator menunjuk kartu yang salah.
 *
 * Sebelum diukur (`step` masih 0 — render di server dan frame pertama
 * di klien) seluruh kartu dianggap terlihat, jadi indikator dan panah
 * belum muncul sama sekali. Lebih baik daripada berkedip di posisi yang
 * salah selama satu frame.
 */
export function visibleCardCount(metrics: StatCarouselMetrics): number {
  const { step, viewport, total } = metrics

  if (step <= 0 || viewport <= 0) return Math.max(1, total)

  return Math.min(Math.max(1, Math.round(viewport / step)), Math.max(1, total))
}

function dedupe(values: number[]): number[] {
  return values.filter(
    (value, index) => index === 0 || Math.abs(value - values[index - 1]!) > 1,
  )
}

/**
 * Titik henti tiap halaman, dalam px.
 *
 * Halaman terakhir dijepit ke `maxScroll`: delapan kartu dengan lima
 * yang terlihat cuma menyisakan tiga kartu untuk digeser, jadi
 * "halaman 2" mendarat di ujung track — bukan di posisi yang browser
 * tolak dan diam-diam bulatkan sendiri, yang membuat titik aktifnya
 * lompat balik ke halaman 1 sesudah animasinya selesai.
 */
export function statCarouselPages(metrics: StatCarouselMetrics): number[] {
  const { maxScroll, step, total } = metrics

  // Tidak ada yang bisa digulir: satu halaman, dan pemanggilnya
  // menyembunyikan indikator maupun panah.
  if (maxScroll <= 1 || step <= 0 || total <= 0) return [0]

  const perView = visibleCardCount(metrics)
  const count = Math.max(1, Math.ceil(total / perView))
  const targets: number[] = []

  for (let page = 0; page < count; page++)
    targets.push(Math.min(page * perView * step, maxScroll))

  return dedupe(targets)
}

/**
 * Halaman yang sedang dilihat: titik henti yang paling dekat dengan
 * posisi gulir sekarang.
 *
 * "Paling dekat", bukan "yang sudah dilewati", supaya gulir bebas
 * dengan trackpad — yang bisa berhenti di tengah-tengah — tetap
 * menyalakan titik yang benar. Seri dimenangkan halaman yang lebih
 * awal, jadi arahnya tidak pernah bergantung pada arah gulirnya.
 */
export function activeStatCarouselPage(metrics: StatCarouselMetrics): number {
  const targets = statCarouselPages(metrics)

  let best = 0
  let bestDistance = Number.POSITIVE_INFINITY

  targets.forEach((target, index) => {
    const distance = Math.abs(target - metrics.scrollLeft)

    if (distance < bestDistance) {
      bestDistance = distance
      best = index
    }
  })

  return best
}
