import { afterEach, describe, expect, it } from 'vitest'

import { messages } from '@/i18n/messages'
import type { DashboardDrilldownData } from '@framework/core/types/dashboard'

/*
| Dialog rincian HR Period Summary — penyajian dwibahasa.
|
| Yang dijaga: (1) kalimat mengikuti bahasa aktif, (2) kode backend
| tidak pernah berubah karena diterjemahkan, (3) frontend tidak
| menghitung ulang durasi — menit dari backend ditampilkan apa adanya.
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

// Composer tiruan yang menginterpolasi `{param}` seperti vue-i18n.
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
  return import('@framework/core/utils/drilldown')
}

function lateDetail(): DashboardDrilldownData {
  return {
    metric: 'late',
    label: 'Late',
    unit: 'days',
    source: 'Attendance',
    link: '/hr/attendance',
    count: 4,
    total: 4,
    items: [
      {
        employee: 'Sarah Wibowo',
        date: '2026-08-20',
        value: 1,
        source_code: 'attendance',
        row_unit: 'occurrence',
        scheduled_time: '08:00',
        actual_time: '08:27',
        // Sesudah toleransi — sengaja BUKAN 27.
        duration_minutes: 12,
        excused_minutes: 0,
        record_id: 10,
        status: 'late',
      },
      {
        employee: 'Sarah Wibowo',
        date: '2026-08-24',
        value: 1,
        source_code: 'attendance',
        scheduled_time: '08:00',
        actual_time: '08:15',
        duration_minutes: 15,
        record_id: 11,
      },
      { employee: 'Sarah Wibowo', date: '2026-08-25', value: 1, source_code: 'attendance', duration_minutes: 60, record_id: 12 },
      { employee: 'Sarah Wibowo', date: '2026-08-26', value: 1, source_code: 'attendance', duration_minutes: 48, record_id: 13 },
    ],
    source_code: 'attendance',
    detail_kind: 'late',
    aggregate: { value: 4, unit: 'occurrence' },
    occurrences: 4,
    duration_minutes: 135,
    duration_complete: true,
    employee: { id: 1, name: 'Sarah Wibowo', number: 'HO001' },
  }
}

function earlyDetail(): DashboardDrilldownData {
  return {
    ...lateDetail(),
    metric: 'early',
    label: 'Early',
    count: 2,
    total: 2,
    detail_kind: 'early',
    aggregate: { value: 2, unit: 'occurrence' },
    occurrences: 2,
    duration_minutes: 45,
    items: [
      { employee: 'Sarah Wibowo', date: '2026-08-21', value: 1, source_code: 'attendance', scheduled_time: '17:00', actual_time: '16:42', duration_minutes: 18, record_id: 20 },
      { employee: 'Sarah Wibowo', date: '2026-08-22', value: 1, source_code: 'attendance', duration_minutes: 27, record_id: 21 },
    ],
  }
}

function overtimeDetail(): DashboardDrilldownData {
  return {
    metric: 'ot_regular',
    label: 'Regular OT',
    unit: 'hours',
    source: 'Overtime',
    link: '/hr/overtime',
    count: 2,
    total: 6.5,
    items: [
      { employee: 'A', date: '2026-06-01', value: 4, quantity: 4, row_unit: 'hour', start_time: '18:00', end_time: '22:00', duration_minutes: 240, detail: 'Lembur Hari Kerja', reason: 'Closing', source_code: 'overtime' },
      { employee: 'A', date: '2026-06-02', value: 2.5, quantity: 2.5, row_unit: 'hour', start_time: '18:00', end_time: '20:30', duration_minutes: 150, detail: 'Lembur Hari Kerja', reason: '', source_code: 'overtime' },
    ],
    source_code: 'overtime',
    detail_kind: 'overtime',
    aggregate: { value: 6.5, unit: 'hour' },
    occurrences: 2,
    duration_minutes: 390,
    duration_complete: true,
    employee: null,
  }
}

describe('formatDuration', () => {
  it('en', async () => {
    withLocale('en')
    const { formatDuration } = await load()

    expect(formatDuration(27)).toBe('27m')
    expect(formatDuration(75)).toBe('1h 15m')
    expect(formatDuration(390)).toBe('6h 30m')
    expect(formatDuration(120)).toBe('2h')
    expect(formatDuration(null)).toBe('—')
  })

  it('id', async () => {
    withLocale('id')
    const { formatDuration } = await load()

    expect(formatDuration(135)).toBe('2j 15m')
    expect(formatDuration(45)).toBe('45m')
    expect(formatDuration(120)).toBe('2j')
  })
})

describe('subjudul dialog', () => {
  it('Late — Indonesia', async () => {
    withLocale('id')
    const { drilldownSummary } = await load()

    expect(drilldownSummary(lateDetail())).toBe('4 kejadian · total 2j 15m · sumber Kehadiran')
  })

  it('Late — English', async () => {
    withLocale('en')
    const { drilldownSummary } = await load()

    expect(drilldownSummary(lateDetail())).toBe('4 occurrences · total 2h 15m · source Attendance')
  })

  it('Early — dua bahasa', async () => {
    withLocale('id')
    let mod = await load()
    expect(mod.drilldownSummary(earlyDetail())).toBe('2 kejadian · total 45m · sumber Kehadiran')

    withLocale('en')
    mod = await load()
    expect(mod.drilldownSummary(earlyDetail())).toBe('2 occurrences · total 45m · source Attendance')
  })

  it('jam lembur menyebut menit dan jam agregat yang sama', async () => {
    withLocale('en')
    let mod = await load()
    expect(mod.drilldownSummary(overtimeDetail())).toBe('2 records · total 6h 30m = 6.5h · source Overtime')

    withLocale('id')
    mod = await load()
    expect(mod.drilldownSummary(overtimeDetail())).toBe('2 catatan · total 6j 30m = 6,5 jam · sumber Lembur')
  })

  it('cuti setengah hari: hari dan catatan disebut terpisah', async () => {
    withLocale('id')
    const { drilldownSummary } = await load()

    const detail: DashboardDrilldownData = {
      metric: 'annual',
      label: 'Annual',
      unit: 'days',
      count: 3,
      total: 2.5,
      items: [],
      source_code: 'leave',
      detail_kind: 'leave',
      aggregate: { value: 2.5, unit: 'day' },
      duration_minutes: null,
    }

    expect(drilldownSummary(detail)).toBe('2,5 hari · 3 catatan · sumber Cuti')
  })

  it('durasi yang tidak tercatat disebut, tidak ditebak', async () => {
    withLocale('en')
    const { drilldownSummary, drilldownColumns } = await load()

    const detail = lateDetail()
    detail.items[3]!.duration_minutes = null
    detail.duration_minutes = 87
    detail.duration_complete = false

    expect(drilldownSummary(detail)).toBe(
      '4 occurrences · total 1h 27m · 1 without recorded duration · source Attendance',
    )

    const duration = drilldownColumns(detail).find(col => col.key === 'late_duration')!

    expect(duration.cell(detail.items[3]!)).toBe('—')
  })
})

describe('kolom dialog', () => {
  it('Late — Indonesia', async () => {
    withLocale('id')
    const { drilldownColumns } = await load()

    const columns = drilldownColumns(lateDetail())

    expect(columns.map(col => col.label)).toEqual([
      'Tanggal',
      'Jadwal Masuk',
      'Aktual Masuk',
      'Durasi Terlambat',
      'Sumber',
    ])

    const row = lateDetail().items[0]!

    expect(columns.map(col => col.cell(row))).toEqual([
      '20 Agu 2026',
      '08:00',
      '08:27',
      '12m',
      'Kehadiran',
    ])
  })

  it('Late — English', async () => {
    withLocale('en')
    const { drilldownColumns } = await load()

    const columns = drilldownColumns(lateDetail())

    expect(columns.map(col => col.label)).toEqual([
      'Date',
      'Scheduled Clock-in',
      'Actual Clock-in',
      'Late Duration',
      'Source',
    ])
    expect(columns[0]!.cell(lateDetail().items[0]!)).toBe('Aug 20, 2026')
  })

  it('Early — dua bahasa', async () => {
    withLocale('id')
    let mod = await load()
    expect(mod.drilldownColumns(earlyDetail()).map(col => col.label)).toEqual([
      'Tanggal', 'Jadwal Pulang', 'Aktual Pulang', 'Durasi Pulang Cepat', 'Sumber',
    ])

    withLocale('en')
    mod = await load()
    const columns = mod.drilldownColumns(earlyDetail())
    expect(columns.map(col => col.label)).toEqual([
      'Date', 'Scheduled Clock-out', 'Actual Clock-out', 'Early Leave Duration', 'Source',
    ])
    expect(columns.map(col => col.cell(earlyDetail().items[0]!)).slice(1, 4)).toEqual(['17:00', '16:42', '18m'])
  })

  it('tidak menghitung durasi dari jam jadwal dan jam tap', async () => {
    withLocale('en')
    const { drilldownColumns } = await load()

    const detail = lateDetail()
    const row = detail.items[0]!
    const duration = drilldownColumns(detail).find(col => col.key === 'late_duration')!

    // 08:00 → 08:27 = 27 menit di jam dinding; backend bilang 12.
    expect(duration.cell(row)).toBe('12m')

    // Menghapus jamnya tidak mengubah durasi — durasinya bukan turunan jam.
    expect(duration.cell({ ...row, scheduled_time: null, actual_time: null })).toBe('12m')
  })

  it('lembur menampilkan mulai, selesai, durasi', async () => {
    withLocale('id')
    const { drilldownColumns } = await load()

    const columns = drilldownColumns(overtimeDetail())

    expect(columns.map(col => col.label)).toEqual([
      'Tanggal', 'Mulai', 'Selesai', 'Durasi', 'Jenis Lembur', 'Alasan',
    ])
    expect(columns.map(col => col.cell(overtimeDetail().items[1]!))).toEqual([
      '02 Jun 2026', '18:00', '20:30', '2j 30m', 'Lembur Hari Kerja', '—',
    ])
  })

  it('backend lama tetap mendapat empat kolom', async () => {
    withLocale('id')
    const { drilldownColumns } = await load()

    const legacy: DashboardDrilldownData = {
      metric: 'late', label: 'Late', unit: 'days', count: 1, total: 1,
      items: [{ employee: 'A', date: '2026-06-01', value: 1, detail: 'Late' }],
    }

    expect(drilldownColumns(legacy).map(col => col.label)).toEqual([
      'Tanggal', 'Keterangan', 'Referensi', 'Nilai',
    ])
  })
})

describe('kode stabil', () => {
  it('ganti bahasa tidak mengubah kode metrik/sumber/satuan', async () => {
    const detail = lateDetail()
    const before = JSON.stringify(detail)

    for (const locale of ['id', 'en', 'id'] as const) {
      withLocale(locale)
      const { drilldownColumns, drilldownSummary, drilldownSourceLabel } = await load()

      drilldownSummary(detail)
      drilldownColumns(detail).forEach(col => detail.items.forEach(item => col.cell(item)))
      drilldownSourceLabel(detail.source_code, detail.source)
    }

    expect(JSON.stringify(detail)).toBe(before)
    expect(detail.metric).toBe('late')
    expect(detail.source_code).toBe('attendance')
    expect(detail.aggregate?.unit).toBe('occurrence')
  })

  it('label sumber per bahasa, kodenya tetap', async () => {
    withLocale('id')
    let mod = await load()
    expect(mod.drilldownSourceLabel('attendance')).toBe('Kehadiran')
    expect(mod.drilldownSourceLabel('overtime')).toBe('Lembur')

    withLocale('en')
    mod = await load()
    expect(mod.drilldownSourceLabel('attendance')).toBe('Attendance')
    expect(mod.drilldownSourceLabel(undefined, 'Leave Request')).toBe('Leave Request')
  })

  it('tombol sumber: "Buka Kehadiran" / "Open Attendance"', async () => {
    const { translate } = await import('@framework/core/utils/i18n')

    withLocale('id')
    expect(translate('common.drilldown.openSource', 'Open Attendance', { source: 'Kehadiran' })).toBe('Buka Kehadiran')

    withLocale('en')
    expect(translate('common.drilldown.openSource', 'Open Attendance', { source: 'Attendance' })).toBe('Open Attendance')
  })
})

describe('nilai nol tidak bisa ditelusuri', () => {
  it('isDrillable', async () => {
    const { isDrillable } = await load()

    expect(isDrillable({ drilldown: 'late' }, 4)).toBe(true)
    expect(isDrillable({ drilldown: 'ot_regular' }, 6.5)).toBe(true)
    expect(isDrillable({ drilldown: 'late' }, 0)).toBe(false)
    expect(isDrillable({ drilldown: 'late' }, '0')).toBe(false)
    expect(isDrillable({ drilldown: 'late' }, null)).toBe(false)
    expect(isDrillable({}, 4)).toBe(false)
  })
})

describe('kolom Period Summary dilokalkan', () => {
  it('lewat resourceLabel, sama seperti useDashboard', async () => {
    const { resourceLabel } = await import('@framework/core/utils/i18n')

    withLocale('id')
    expect(resourceLabel('reports.hr.period-summary.fields.late', 'Late')).toBe('Terlambat')
    expect(resourceLabel('reports.hr.period-summary.fields.early', 'Early')).toBe('Pulang Cepat')

    withLocale('en')
    expect(resourceLabel('reports.hr.period-summary.fields.late', 'Late')).toBe('Late')
    expect(resourceLabel('reports.hr.period-summary.fields.ot_regular', 'Regular OT')).toBe('Regular OT')
  })
})

describe('paritas kunci baru', () => {
  const groups = [
    'common.drilldown',
    'reports.hr.period-summary',
  ]

  for (const group of groups) {
    it(`${group} punya kunci yang sama di en dan id`, () => {
      const pick = (locale: 'en' | 'id') =>
        [...flatten(messages[locale]).keys()].filter(key => key.startsWith(`${group}.`)).sort()

      const en = pick('en')

      expect(en.length).toBeGreaterThan(0)
      expect(pick('id')).toEqual(en)
    })
  }

  for (const key of [
    'common.labels.employees',
    'common.labels.total',
    'common.state.searchMatched',
    'common.state.searchNoMatch',
    'common.actions.clearSearch',
  ]) {
    it(`${key} ada di en dan id`, () => {
      expect(flatten(messages.en).get(key)).toBeTruthy()
      expect(flatten(messages.id).get(key)).toBeTruthy()
    })
  }
})
