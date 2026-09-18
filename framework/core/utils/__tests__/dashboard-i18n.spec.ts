import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { messages } from '@/i18n/messages'

/*
| Lokalisasi dashboard bersama: label periode, nama deret chart, dan
| state periode yang harus selamat saat halaman dirakit ulang karena
| bahasa berganti.
|
| Yang dijaga bukan cuma "teksnya berubah", tapi juga **yang tidak boleh
| berubah**: tanggal yang sedang dipilih dan kode kanonik dari backend.
*/

function flatten(obj: any, prefix = '', out = new Map<string, string>()) {
  for (const [key, value] of Object.entries(obj ?? {})) {
    const path = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object')
      flatten(value, path, out)
    else
      out.set(path, String(value))
  }

  return out
}

function fakeComposer(locale: 'en' | 'id') {
  const flat = flatten(messages[locale])

  return {
    locale: { value: locale },
    te: (key: string) => flat.has(key),
    t: (key: string, params?: Record<string, unknown>) =>
      (flat.get(key) ?? key).replace(/\{(\w+)\}/g, (_, name) => String(params?.[name] ?? '')),
  }
}

let active: 'en' | 'id' = 'en'

function withLocale(locale: 'en' | 'id') {
  active = locale
  ;(globalThis as any).useNuxtApp = () => ({ $i18n: fakeComposer(active) })
}

afterEach(() => {
  delete (globalThis as any).useNuxtApp
})

async function load() {
  return import('@framework/core/utils/dashboard')
}

const AUGUST = { mode: 'month' as const, start: '2026-08-01', end: '2026-08-31' }

describe('label periode mengikuti bahasa', () => {
  it('bulanan — Indonesia', async () => {
    withLocale('id')
    const { periodRangeLabel, periodModeLabel } = await load()

    expect(periodRangeLabel(AUGUST)).toBe('Agustus 2026')
    expect(periodModeLabel('month')).toBe('Bulanan')
  })

  it('bulanan — English', async () => {
    withLocale('en')
    const { periodRangeLabel, periodModeLabel } = await load()

    expect(periodRangeLabel(AUGUST)).toBe('August 2026')
    expect(periodModeLabel('month')).toBe('Monthly')
  })

  it('nama bulan datang dari Intl, bukan daftar tulis tangan', async () => {
    withLocale('id')
    let mod = await load()
    expect(mod.monthLabel(8)).toBe('Agustus')
    expect(mod.monthAbbr(8)).toBe('Agu')

    withLocale('en')
    mod = await load()
    expect(mod.monthLabel(8)).toBe('August')
    expect(mod.monthAbbr(8)).toBe('Aug')
  })

  it('seluruh satuan periode punya label di dua bahasa', async () => {
    const modes = ['day', 'week', 'month', 'quarter', 'year', 'custom'] as const

    withLocale('id')
    let mod = await load()
    expect(modes.map(m => mod.periodModeLabel(m))).toEqual([
      'Harian', 'Mingguan', 'Bulanan', 'Kuartal', 'Tahunan', 'Kustom',
    ])

    withLocale('en')
    mod = await load()
    expect(modes.map(m => mod.periodModeLabel(m))).toEqual([
      'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Custom',
    ])
  })

  it('harian, kuartal, tahun, dan rentang kustom ikut bahasanya', async () => {
    const day = { mode: 'day' as const, start: '2026-08-03', end: '2026-08-03' }
    const quarter = { mode: 'quarter' as const, start: '2026-07-01', end: '2026-09-30' }
    const year = { mode: 'year' as const, start: '2026-01-01', end: '2026-12-31' }
    const custom = { mode: 'custom' as const, start: '2026-08-03', end: '2026-09-05' }

    withLocale('id')
    let mod = await load()
    expect(mod.periodRangeLabel(day)).toBe('3 Agustus 2026')
    expect(mod.periodRangeLabel(quarter)).toBe('Kuartal III 2026')
    expect(mod.periodRangeLabel(year)).toBe('2026')
    expect(mod.periodRangeLabel(custom)).toBe('3 Agu – 5 Sep 2026')

    withLocale('en')
    mod = await load()
    expect(mod.periodRangeLabel(day)).toBe('3 August 2026')
    expect(mod.periodRangeLabel(quarter)).toBe('Quarter III 2026')
    expect(mod.periodRangeLabel(year)).toBe('2026')
    expect(mod.periodRangeLabel(custom)).toBe('3 Aug – 5 Sep 2026')
  })

  it('pintasan periode ikut bahasa dan tetap menghasilkan rentang yang sama', async () => {
    withLocale('id')
    let mod = await load()
    const idLabels = mod.PERIOD_PRESETS.map(p => mod.presetLabel(p))
    const idRanges = mod.PERIOD_PRESETS.map(p => JSON.stringify(p.build()))

    expect(idLabels).toContain('Bulan Ini')
    expect(idLabels).toContain('Kuartal Ini')
    expect(idLabels.every(label => label && !label.startsWith('common.'))).toBe(true)

    withLocale('en')
    mod = await load()
    const enLabels = mod.PERIOD_PRESETS.map(p => mod.presetLabel(p))

    expect(enLabels).toContain('This Month')
    expect(enLabels).toContain('This Quarter')
    // Label berubah, rentangnya tidak.
    expect(mod.PERIOD_PRESETS.map(p => JSON.stringify(p.build()))).toEqual(idRanges)
  })

  it('tanggal sel tabel mengikuti bahasa, bukan id-ID mati', async () => {
    withLocale('en')
    let mod = await load()
    expect(mod.formatDashboardValue('2026-08-20', 'date')).toBe('Aug 20, 2026')

    withLocale('id')
    mod = await load()
    expect(mod.formatDashboardValue('2026-08-20', 'date')).toBe('20 Agu 2026')
  })
})

describe('nama deret chart', () => {
  it('diterjemahkan dari kode kanonik', async () => {
    withLocale('id')
    let mod = await load()
    expect(mod.seriesLabel('present', 'Hadir')).toBe('Hadir')
    expect(mod.seriesLabel('late', 'Telat')).toBe('Terlambat')
    expect(mod.seriesLabel('ot_regular', 'Regular OT')).toBe('Lembur Reguler')

    withLocale('en')
    mod = await load()
    expect(mod.seriesLabel('present', 'Hadir')).toBe('Present')
    expect(mod.seriesLabel('late', 'Telat')).toBe('Late')
    expect(mod.seriesLabel('absent', 'Tidak Hadir')).toBe('Absent')
    expect(mod.seriesLabel('ot_regular', 'Regular OT')).toBe('Regular OT')
  })

  it('tanpa kode, label API dipakai apa adanya — tidak ada pencocokan teks', async () => {
    withLocale('en')
    const { seriesLabel } = await load()

    // Nama department milik tenant lewat jalur yang sama.
    expect(seriesLabel(undefined, 'Plant Maintenance')).toBe('Plant Maintenance')
    expect(seriesLabel(null, 'Hadir')).toBe('Hadir')
    // Kode yang tidak dikenal juga tidak ditebak.
    expect(seriesLabel('kode_tenant_aneh', 'Cuti Menikah')).toBe('Cuti Menikah')
  })
})

describe('periode selamat saat bahasa berganti', () => {
  beforeEach(async () => {
    const { clearDashboardSessions } = await import('@framework/core/composables/dashboardSession')
    clearDashboardSessions()
  })

  it('rentang yang dipilih dibaca kembali sesudah remount', async () => {
    const mod = await import('@framework/core/composables/dashboardSession')
    const key = mod.dashboardSessionKey({ module: 'reports/hr/period-summary' })

    expect(mod.readDashboardSession(key)).toBeNull()

    mod.writeDashboardSession(key, {
      period: AUGUST,
      filters: { company: [1, 2], location: null },
    })

    // ID -> EN: komponen mati, lahir lagi, dan membaca state yang sama.
    const afterSwitch = mod.readDashboardSession(key)

    expect(afterSwitch?.period).toEqual(AUGUST)
    expect(afterSwitch?.filters).toEqual({ company: [1, 2], location: null })

    // EN -> ID: tetap sama.
    expect(mod.readDashboardSession(key)?.period).toEqual(AUGUST)
  })

  it('tanggal query tidak bergeser — yang tersimpan hanya disalin', async () => {
    const mod = await import('@framework/core/composables/dashboardSession')
    const key = mod.dashboardSessionKey({ module: 'hr/dashboard' })
    const live = { ...AUGUST }

    mod.writeDashboardSession(key, { period: live, filters: {} })

    // Komponen lama menyunting ref-nya sesudah mati; yang tersimpan tidak
    // boleh ikut berubah.
    live.start = '2026-09-01'
    live.end = '2026-09-30'

    expect(mod.readDashboardSession(key)?.period).toEqual(AUGUST)
  })

  it('dipisah per modul — laporan lain tidak mewarisi periodenya', async () => {
    const mod = await import('@framework/core/composables/dashboardSession')

    expect(mod.dashboardSessionKey({ module: 'hr/dashboard' }))
      .not.toBe(mod.dashboardSessionKey({ module: 'reports/hr/period-summary' }))

    mod.writeDashboardSession(
      mod.dashboardSessionKey({ module: 'hr/dashboard' }),
      { period: AUGUST, filters: {} },
    )

    expect(
      mod.readDashboardSession(
        mod.dashboardSessionKey({ module: 'reports/hr/period-summary' }),
      ),
    ).toBeNull()
  })
})

describe('katalog', () => {
  const required = [
    'common.actions.viewAll',
    'common.period.goToday',
    'common.period.previous',
    'common.period.next',
    'common.period.previousYear',
    'common.period.nextYear',
    'common.period.quarterLabel',
    'common.period.this_week',
    'common.period.last_30_days',
    'common.period.this_quarter',
    'common.period.this_year',
    'common.placeholder.employee',
    'common.placeholder.organization',
  ]

  for (const key of required) {
    it(`${key} ada di en dan id`, () => {
      expect(flatten(messages.en).get(key)).toBeTruthy()
      expect(flatten(messages.id).get(key)).toBeTruthy()
    })
  }

  for (const group of ['common.period.modes', 'common.series', 'reports.hr.period-summary.description']) {
    it(`${group} punya kunci yang sama di en dan id`, () => {
      const pick = (locale: 'en' | 'id') =>
        [...flatten(messages[locale]).keys()].filter(k => k.startsWith(`${group}.`)).sort()

      expect(pick('en').length).toBeGreaterThan(0)
      expect(pick('id')).toEqual(pick('en'))
    })
  }

  it('teks Indonesia tidak lagi ditulis langsung di komponen dashboard bersama', async () => {
    const { readFileSync } = await import('node:fs')

    const files = [
      'framework/core/utils/dashboard.ts',
      'framework/components/dashboard/MDashboardPeriodPicker.vue',
      'framework/components/dashboard/MDashboard.vue',
      'framework/components/dashboard/MDashboardList.vue',
      'framework/components/dashboard/MDashboardChart.vue',
      'framework/components/dashboard/MDashboardTable.vue',
    ]

    // Kata yang dulu tercetak apa adanya di layar. Komentar berbahasa
    // Indonesia tetap boleh — yang dilarang teks yang dirender.
    const banned = /(?:>|["'`])\s*(Periode|Bulanan|Harian|Mingguan|Tahunan|Kustom|Agustus|Ke hari ini|Lihat Semua|Muat ulang|Gagal memuat|Kosongkan pencarian|Pegawai)\b/

    for (const file of files) {
      // Komentar dibuang lebih dulu — HTML, blok, dan baris — supaya
      // yang diperiksa benar-benar teks yang dirender.
      const rendered = readFileSync(file, 'utf8')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')

      expect(banned.test(rendered), `${file} masih memuat teks Indonesia`).toBe(false)
    }
  })
})
