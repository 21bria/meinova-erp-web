import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import {
  buildPersonalPayload,
  IDENTITY_KEYS,
  identityLabel,
  isPersonalMode,
  PERSONAL_REQUESTS,
  personalFormSchema,
} from '../requests/personalRequest'

/*
 * `form.ts` hasil generator mengimpor `@framework`, yang butuh runtime
 * Nuxt — tidak bisa diimpor di lingkungan `node`. Kuncinya dibaca dari
 * teks berkasnya: yang diuji memang "field apa yang ada di formulir HR",
 * dan itu tertulis literal di sana.
 */
function generatedForm(relative: string) {
  const text = readFileSync(
    fileURLToPath(new URL(`../../hr/${relative}/form.ts`, import.meta.url)),
    'utf8',
  )

  return [...text.matchAll(/field\.(\w+)\("(\w+)"[^{]*\{([\s\S]*?)\n {4}\}\)/g)].map((match) => {
    const body = match[3] ?? ''

    return {
      key: match[2],
      type: match[1],
      tab: /"tab": "(\w+)"/.exec(body)?.[1],
      ...(body.includes('readonlyWhen') ? { readonlyWhen: { field: 'can_edit' } } : {}),
    }
  })
}

const leaveForm = generatedForm('leave')
const attendancePermissionsForm = generatedForm('attendance-permissions')

const leave = PERSONAL_REQUESTS.leave
const permission = PERSONAL_REQUESTS.permission

function keys(schema: Array<{ key?: string }>) {
  return schema.map(field => field.key)
}

describe('personal request endpoints', () => {
  it('post to /api/me/* without any identity in the path', () => {
    for (const config of Object.values(PERSONAL_REQUESTS)) {
      expect(config.endpoint.startsWith('/api/me/')).toBe(true)
      expect(config.endpoint).not.toMatch(/\d|\?|employee/)
    }
  })

  it('never whitelist an identity field', () => {
    for (const config of Object.values(PERSONAL_REQUESTS)) {
      for (const key of IDENTITY_KEYS)
        expect(config.fields).not.toContain(key)
    }
  })
})

describe('personalFormSchema', () => {
  it('reads the generated HR forms, including the HR-only fields', () => {
    expect(keys(leaveForm)).toEqual(expect.arrayContaining(['employee', 'company', 'leave_type']))
    expect(keys(attendancePermissionsForm)).toEqual(expect.arrayContaining(['employee', 'allow_outside_shift', 'outside_shift_reason', 'permission_type']))
  })

  it('formulir HR Izin Kehadiran tidak punya kolom organisasi', () => {
    /*
     * Sejak 21 Sep 2026 company/branch/location diturunkan backend dari
     * penempatan pegawai; kolomnya bukan isian di mana pun, dan yang
     * dikirim dari client diabaikan. Nilainya muncul di panel ringkasan.
     */
    for (const derived of ['company', 'branch', 'location'])
      expect(keys(attendancePermissionsForm)).not.toContain(derived)
  })

  it('formulir HR Cuti tidak punya Status sama sekali', () => {
    /*
     * Sejak 18 Sep 2026 `status` bukan isian di mana pun: backend
     * membalas 400 untuk body yang menyebutnya, dan generator
     * menghilangkannya dari formulir. Yang mencatat cuti tanpa alur
     * memakai tombol Catat Cuti (`POST /api/hr/leaves/record/`), bukan
     * memilih "Recorded" dari sebuah dropdown.
     */
    expect(keys(leaveForm)).not.toContain('status')
  })

  it('leave form shows no employee, status, organization or document number', () => {
    const shown = keys(personalFormSchema(leaveForm as any[], leave))

    for (const hidden of ['employee', 'status', 'company', 'branch', 'location', 'document_number', 'total_days', 'is_active'])
      expect(shown).not.toContain(hidden)

    expect(shown).toEqual(expect.arrayContaining(['leave_type', 'start_date', 'end_date']))
  })

  it('permission form drops employee and the HR override tab', () => {
    const schema = personalFormSchema(attendancePermissionsForm as any[], permission)
    const shown = keys(schema)

    for (const hidden of ['employee', 'allow_outside_shift', 'outside_shift_reason', 'company', 'branch', 'location'])
      expect(shown).not.toContain(hidden)

    expect(shown).toEqual(expect.arrayContaining(['permission_type', 'date', 'reason']))
    expect(schema.every(field => (field as any).tab !== 'override')).toBe(true)
  })

  it('every whitelisted field exists in the generated form', () => {
    expect(keys(personalFormSchema(leaveForm as any[], leave)).sort()).toEqual([...leave.fields].sort())
    expect(keys(personalFormSchema(attendancePermissionsForm as any[], permission)).sort()).toEqual([...permission.fields].sort())
  })

  it('drops readonlyWhen so a new form is not locked by can_edit', () => {
    const schema = personalFormSchema(leaveForm as any[], leave)

    expect(schema.some(field => 'readonlyWhen' in field)).toBe(false)
  })
})

describe('buildPersonalPayload', () => {
  it('sends only whitelisted keys — never employee', () => {
    const payload = buildPersonalPayload({
      employee: 131,
      employee_id: 131,
      user: 9,
      status: 'recorded',
      company: 1,
      allow_outside_shift: true,
      leave_type: { id: 4, name: 'Annual' },
      start_date: '2026-12-01',
      end_date: '2026-12-01',
      notes: '  pulang kampung ',
    }, leave)

    expect(payload).toEqual({
      leave_type: 4,
      start_date: '2026-12-01',
      end_date: '2026-12-01',
      notes: 'pulang kampung',
    })
  })

  it('drops empty values', () => {
    expect(buildPersonalPayload({
      permission_type: 'full_day',
      date: '2026-12-02',
      reason: 'x',
      start_time: null,
      end_time: '',
      supporting_document: undefined,
    }, permission)).toEqual({ permission_type: 'full_day', date: '2026-12-02', reason: 'x' })
  })
})

describe('helpers', () => {
  it('identityLabel', () => {
    expect(identityLabel({ employee_number: 'HO005', full_name: 'Farah Anindita' })).toBe('HO005 — Farah Anindita')
    expect(identityLabel(null)).toBe('')
  })

  it('isPersonalMode', () => {
    expect(isPersonalMode({ mode: 'my' })).toBe(true)
    expect(isPersonalMode({})).toBe(false)
    expect(isPersonalMode({ mode: ['my'] })).toBe(false)
  })
})
