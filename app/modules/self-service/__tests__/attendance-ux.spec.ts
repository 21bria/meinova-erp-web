import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import en from '../../../i18n/locales/en/me'
import id from '../../../i18n/locales/id/me'
import { PUNCH_ROUTE, REPORT_ROUTE, resultTone } from '../attendance/punch'

/*
| ATT-UX-1 — absen dan melihat kehadiran adalah dua halaman.
|
|   `/me/attendance/punch`  alur tap saja (lokasi → selfie → kirim → hasil)
|   `/me/attendance`        laporan saja (ringkasan, periode, riwayat)
|
| vitest repo ini berjalan di `node` tanpa DOM, jadi yang dikunci di sini
| adalah susunan sumbernya: komponen mana yang dimuat halaman mana, dan
| urutan formulir vs hasil di template kartu.
*/

function read(path: string) {
  return readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8')
}

const reportPage = () => read('../attendance/page.vue')
const punchPage = () => read('../attendance/punch-page.vue')
const card = () => read('../components/AttendancePunchCard.vue')
const reportRoute = () => read('../../../pages/me/attendance/index.vue')
const punchRoute = () => read('../../../pages/me/attendance/punch.vue')

const REPORTING = [
  'AttendanceSummaryCards',
  'AttendanceHistoryTable',
  'AttendanceDayStrip',
  'AttendanceRangeBar',
  'useSelfAttendance',
]

describe('routes', () => {
  it('has two distinct addresses', () => {
    expect(PUNCH_ROUTE).toBe('/me/attendance/punch')
    expect(REPORT_ROUTE).toBe('/me/attendance')
  })

  it('/me/attendance renders the report and /me/attendance/punch the punch page', () => {
    expect(reportRoute()).toContain('@/modules/self-service/attendance/page.vue')
    expect(punchRoute()).toContain('@/modules/self-service/attendance/punch-page.vue')
  })
})

describe('reporting page', () => {
  it('contains no punch form', () => {
    expect(reportPage()).not.toContain('AttendancePunchCard')
    expect(reportPage()).not.toMatch(/punch/i)
  })

  it('keeps the reporting components', () => {
    for (const name of REPORTING)
      expect(reportPage()).toContain(name)
  })
})

describe('punch page', () => {
  it('reuses the existing punch card, not a second implementation', () => {
    expect(punchPage()).toContain('<AttendancePunchCard')
    expect(punchPage()).not.toMatch(/getCurrentPosition|submitPunch|uploadSelfie|\$fetch|useApi/)
  })

  it('contains the GPS/selfie workflow through the card', () => {
    const source = card()

    for (const key of ['me.punch.getLocation', 'me.punch.selfieTake', 'me.punch.checkIn', 'me.punch.step.location', 'me.punch.step.selfie', 'me.punch.step.submit'])
      expect(source).toContain(key)

    expect(source).toContain('capture="user"')
  })

  it('shows no attendance reporting', () => {
    for (const name of REPORTING) {
      expect(punchPage()).not.toContain(name)
      expect(card()).not.toContain(name)
    }
  })

  it('links back to View Attendance', () => {
    expect(punchPage()).toContain(':to="REPORT_ROUTE"')
    expect(punchPage()).toContain('me.punch.viewAttendance')
  })

  it('renders the result below the form', () => {
    const source = card()
    const submit = source.indexOf('me.punch.checkIn')
    const result = source.indexOf('data-testid="punch-result"')

    expect(submit).toBeGreaterThan(-1)
    expect(result).toBeGreaterThan(submit)
  })

  it('shows a notice instead of a blank page when punching is unavailable', () => {
    const source = card()

    expect(source).toContain('v-if="loaded && !availability?.available"')
    expect(source).toContain('v-else-if="availability?.available"')
    expect(source).toContain('me.punch.notEnabled')
  })
})

describe('result tone', () => {
  it('never shows a trial as success', () => {
    expect(resultTone({ result: 'rejected', trial: { mode: 'gps_trial' } as never })).toBe('warning')
    expect(resultTone({ result: 'accepted', trial: { mode: 'gps_trial' } as never })).toBe('warning')
  })

  it('maps real results', () => {
    expect(resultTone({ result: 'accepted' })).toBe('success')
    expect(resultTone({ result: 'review_required' })).toBe('warning')
    expect(resultTone({ result: 'rejected' })).toBe('error')
  })
})

describe('labels', () => {
  it('uses the concise trial notice', () => {
    expect(en.punch.trialNotice).toBe(
      'GPS attendance trial — location and selfie are validated, but attendance is not recorded.',
    )
    expect(id.punch.trialNotice).toBe(
      'Uji coba absensi GPS — lokasi dan selfie diperiksa, tetapi absensi belum dicatat.',
    )

    for (const notice of [en.punch.trialNotice, id.punch.trialNotice])
      expect(notice.toLowerCase()).not.toMatch(/face|wajah|biometri/)
  })

  it('has page and link labels in EN and ID', () => {
    expect(en.punch.title).toBe('Check In')
    expect(id.punch.title).toBe('Absen Masuk')
    expect(en.punch.viewAttendance).toBe('View Attendance')
    expect(id.punch.viewAttendance).toBe('Lihat Absensi')
    expect(en.punch.result.heading.trial).toMatch(/not recorded/)
    expect(id.punch.result.heading.trial).toMatch(/belum dicatat/)
  })
})
