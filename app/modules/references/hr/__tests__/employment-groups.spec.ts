import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { field } from '@framework/builders/forms/field'

import { afterEach, describe, expect, it } from 'vitest'

import { generateFormFields as generateFormFieldsMjs } from '../../../../../scripts/meinova/generators/form.mjs'
import { generatePayloadFields, generateRowFields } from '../../../../../scripts/meinova/generators/types.mjs'
import { messages } from '../../../../i18n/messages'

// Generator .mjs polos: tipe `namespace` hasil inferensi default `null`.
const generateFormFields = generateFormFieldsMjs as (schema: unknown, namespace?: string | null) => string

/*
| Employee Group — konfigurasi dokumen perjalanan (TR/BT POLICY follow-up).
|
| Yang dijaga:
|   1. dua penanda bisa disunting; `travel_document` hanya tampilan dan
|      memakai kode backend apa adanya — tidak ada resolver di frontend;
|   2. `travel_document_warnings` jadi widget peringatan, bukan field
|      isian atau error validasi;
|   3. teks kode dan peringatan ada di katalog EN dan ID.
*/

const VALUES = ['travel_request', 'business_trip', 'both', 'none'] as const

const SCHEMA = {
  fields: {
    business_trip_applicable: { type: 'boolean', label: 'Business Trip', form: true, help_text: 'Employees in this group may use Business Trip.' },
    travel_document: {
      type: 'select',
      label: 'Travel Document',
      read_only: true,
      display: true,
      modes: ['edit', 'detail'],
      options: VALUES.map(value => ({ value, label: value })),
    },
    travel_document_warnings: {
      widget: 'warnings',
      label: 'Travel Document Warnings',
      read_only: true,
      display: true,
      layout: 'full',
      modes: ['edit', 'detail'],
    },
  },
}

function fakeComposer(locale: 'en' | 'id') {
  const flat = new Map<string, string>()

  const walk = (obj: any, prefix = '') => {
    for (const [key, value] of Object.entries(obj ?? {})) {
      const path = prefix ? `${prefix}.${key}` : key

      if (value && typeof value === 'object')
        walk(value, path)
      else
        flat.set(path, String(value))
    }
  }

  walk((messages as any)[locale])

  return {
    locale: { value: locale },
    t: (key: string) => flat.get(key) ?? key,
    te: (key: string) => flat.has(key),
  }
}

function withLocale(locale: 'en' | 'id') {
  ;(globalThis as any).useNuxtApp = () => ({ $i18n: fakeComposer(locale) })
}

afterEach(() => {
  delete (globalThis as any).useNuxtApp
})

describe('generator — Employee Group travel document', () => {
  it('warnings widget dipancarkan sebagai field.warnings, bukan teks', () => {
    const out = generateFormFields(SCHEMA, 'references.hr.employment-groups')

    expect(out).toContain('field.warnings("travel_document_warnings"')
    expect(out).not.toContain('field.text("travel_document_warnings"')
  })

  it('travel_document = select read-only, hanya edit/detail', () => {
    const out = generateFormFields(SCHEMA, 'references.hr.employment-groups')
    const block = out.slice(out.indexOf('field.select("travel_document"'))

    expect(block).toContain('"readonly": true')
    expect(block).toContain('"edit"')
    expect(block).not.toContain('"create"')
  })

  it('turunan tidak masuk payload; peringatan bertipe daftar', () => {
    expect(generatePayloadFields(SCHEMA)).not.toContain('travel_document')
    expect(generatePayloadFields(SCHEMA)).toContain('business_trip_applicable: boolean')
    expect(generateRowFields(SCHEMA)).toContain(
      'travel_document_warnings: { kind: string, message: string }[]',
    )
  })

  it('field.warnings: selebar form, read-only', () => {
    expect(field.warnings('w', 'W')).toMatchObject({
      key: 'w',
      type: 'warnings',
      layout: 'full',
      readonly: true,
    })
  })
})

describe('modul hasil generate', () => {
  const form = readFileSync(
    fileURLToPath(new URL('../employment-groups/form.ts', import.meta.url)),
    'utf8',
  )

  it('kedua penanda bisa disunting dan punya keterangan', () => {
    expect(form).toContain('field.switch("field_break_applicable", "Field Break / Travel Request"')
    expect(form).toContain('field.switch("business_trip_applicable", "Business Trip"')
    expect(form).toContain('Employees in this group may use Travel Request.')
    expect(form).toContain('Employees in this group may use Business Trip.')
  })

  it('travel_document tidak bisa disunting dan memakai kode backend', () => {
    const block = form.slice(
      form.indexOf('field.select("travel_document"'),
      form.indexOf('field.warnings('),
    )

    expect(block).toContain('"readonly": true')

    for (const value of VALUES)
      expect(block).toContain(`"value": "${value}"`)

    expect(form).not.toContain('field.switch("travel_document"')
  })

  it('peringatan memakai widget, tanpa required', () => {
    const block = form.slice(form.indexOf('field.warnings("travel_document_warnings"'))

    expect(block.slice(0, block.indexOf('})'))).not.toContain('"required"')
  })
})

describe('katalog — kode dan peringatan dokumen perjalanan', () => {
  const EXPECTED_EN: Record<string, string> = {
    travel_request: 'Travel Request',
    business_trip: 'Business Trip',
    both: 'Travel Request + Business Trip',
    none: 'No travel document enabled',
  }

  it('en: label manusiawi untuk keempat kode', async () => {
    withLocale('en')
    const { codeLabel } = await import('@framework/core/utils/i18n')

    for (const value of VALUES)
      expect(codeLabel('travel_document', value)).toBe(EXPECTED_EN[value])
  })

  it('id: keempat kode diterjemahkan', async () => {
    withLocale('id')
    const { codeLabel } = await import('@framework/core/utils/i18n')

    expect(codeLabel('travel_document', 'none')).toBe('Tidak ada dokumen perjalanan yang aktif')
    expect(codeLabel('travel_document', 'business_trip')).toBe('Perjalanan Dinas')
  })

  it('peringatan BOTH/NONE ada di kedua bahasa dan berbeda', async () => {
    const { codeLabel } = await import('@framework/core/utils/i18n')

    for (const kind of ['both', 'none']) {
      withLocale('en')
      const en = codeLabel('travel_document_warnings', kind, 'FALLBACK')
      withLocale('id')
      const id = codeLabel('travel_document_warnings', kind, 'FALLBACK')

      expect(en).not.toBe('FALLBACK')
      expect(id).not.toBe('FALLBACK')
      expect(id).not.toBe(en)
    }

    withLocale('en')
    expect(codeLabel('travel_document_warnings', 'both'))
      .toContain('both Travel Request and Business Trip')
    expect(codeLabel('travel_document_warnings', 'none'))
      .toContain('cannot use Travel Request or Business Trip')
  })

  // POLICY-2C: makna kanonik. BOTH = konfigurasi sah, dua dokumen untuk
  // tujuan perjalanan masing-masing — bukan galat, bukan "matikan satu",
  // bukan dokumen yang bisa saling menggantikan.
  it('teks BOTH/NONE kanonik EN/ID (POLICY-2C)', async () => {
    const { codeLabel } = await import('@framework/core/utils/i18n')

    withLocale('en')
    expect(codeLabel('travel_document_warnings', 'both')).toBe(
      'Employees in this group can use both Travel Request and Business Trip. '
      + 'Use each document according to its intended travel purpose.',
    )
    expect(codeLabel('travel_document_warnings', 'none')).toBe(
      'Employees in this group cannot use Travel Request or Business Trip.',
    )

    withLocale('id')
    expect(codeLabel('travel_document_warnings', 'both')).toBe(
      'Pegawai dalam grup ini dapat menggunakan Travel Request dan Perjalanan Dinas. '
      + 'Gunakan masing-masing dokumen sesuai tujuan perjalanannya.',
    )
    expect(codeLabel('travel_document_warnings', 'none')).toBe(
      'Pegawai dalam grup ini tidak dapat menggunakan Travel Request maupun Perjalanan Dinas.',
    )

    for (const locale of ['en', 'id'] as const) {
      withLocale(locale)
      const both = codeLabel('travel_document_warnings', 'both')

      for (const forbidden of [/turn .* off/i, /disable/i, /invalid/i, /interchangeab/i, /matikan/i, /tidak sah/i])
        expect(both).not.toMatch(forbidden)
    }
  })
})
