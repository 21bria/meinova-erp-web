import { beforeEach, describe, expect, it } from 'vitest'

import { generateColumnItems } from '../generators/columns.mjs'

import { generateFilterItems } from '../generators/filters.mjs'
import { generateFormFields } from '../generators/form.mjs'
import {
  collectedKeys,
  i18nImport,
  i18nNamespace,
  labelExpr,
  resetCollectedKeys,
} from '../generators/i18n.mjs'

/*
| Janji generator, dan janji pertamanya yang paling penting:
|
|     tanpa namespace, keluarannya IDENTIK dengan sebelum i18n ada.
|
| 90-an modul sudah di-generate dengan bentuk lama. Kalau bentuk itu
| bergeser, regenerate rutin apa pun akan menghasilkan diff besar yang
| tidak ada hubungannya dengan perubahan yang sedang dikerjakan.
*/

const schema = {
  fields: {
    employee_no: { type: 'string', label: 'Employee Number', table: true, filter: true },
    name: { type: 'string', label: 'Name', table: true, required: true },
    is_active: { type: 'boolean', label: 'Active', table: true, filter: true },
    join_date: { type: 'date', label: 'Join Date', table: true },
  },
}

beforeEach(() => {
  resetCollectedKeys()
})

describe('i18nNamespace', () => {
  it('membaca bentuk bersarang dari schema backend', () => {
    expect(i18nNamespace({ i18n: { namespace: 'hr.employees' } })).toBe('hr.employees')
  })

  it('membaca bentuk datar untuk schema lama', () => {
    expect(i18nNamespace({ i18n_namespace: 'hr.employees' })).toBe('hr.employees')
  })

  it('menerima flag CLI kalau schema diam', () => {
    expect(i18nNamespace({}, { i18n: 'hr.employees' })).toBe('hr.employees')
  })

  it('schema menang atas flag CLI', () => {
    expect(
      i18nNamespace({ i18n: { namespace: 'dari.schema' } }, { i18n: 'dari.cli' }),
    ).toBe('dari.schema')
  })

  it('null kalau tidak ada yang menyetel — dan itu keadaan bawaannya', () => {
    expect(i18nNamespace({})).toBeNull()
    expect(i18nNamespace(null)).toBeNull()
    expect(i18nNamespace({}, {})).toBeNull()
    expect(i18nNamespace({ i18n_namespace: '   ' })).toBeNull()
  })

  it('tIDAK menebak namespace dari nama modul', () => {
    // Menebaknya berarti memindahkan folder diam-diam memutus seluruh
    // terjemahan modul itu.
    expect(i18nNamespace({ endpoint: '/api/hr/employees/' })).toBeNull()
  })
})

describe('labelExpr', () => {
  it('tanpa namespace menghasilkan literal', () => {
    expect(labelExpr(null, 'fields', 'name', 'Name')).toBe('"Name"')
  })

  it('dengan namespace menghasilkan resourceLabel berisi teks Inggrisnya', () => {
    expect(labelExpr('hr.employees', 'fields', 'name', 'Name'))
      .toBe('resourceLabel("hr.employees.fields.name", "Name")')
  })

  it('memisahkan ruang kunci kolom dan filter', () => {
    // Kolom "Status" dan filter "Status" tidak boleh berebut satu kunci.
    expect(labelExpr('m', 'fields', 'status', 'Status'))
      .not
      .toBe(labelExpr('m', 'filters', 'status', 'Status'))
  })

  it('mencatat kunci yang dipancarkan untuk dicetak generator', () => {
    labelExpr('hr.employees', 'fields', 'name', 'Name')
    labelExpr('hr.employees', 'filters', 'name', 'Name')

    expect(collectedKeys()).toEqual([
      { key: 'hr.employees.fields.name', label: 'Name' },
      { key: 'hr.employees.filters.name', label: 'Name' },
    ])
  })

  it('tidak mencatat apa pun saat i18n mati', () => {
    labelExpr(null, 'fields', 'name', 'Name')

    expect(collectedKeys()).toEqual([])
  })
})

describe('i18nImport', () => {
  it('kosong saat mati, supaya tidak ada import yang tak terpakai', () => {
    expect(i18nImport(null)).toBe('')
  })

  it('menyisipkan resourceLabel saat hidup', () => {
    expect(i18nImport('hr.employees')).toBe(', resourceLabel')
  })
})

describe('keluaran generator tanpa namespace = keluaran lama', () => {
  it('kolom', () => {
    const out = generateColumnItems(schema)

    expect(out).toContain('column.text("employee_no", "Employee Number")')
    expect(out).toContain('column.status("is_active", "Active")')
    expect(out).not.toContain('resourceLabel')
  })

  it('field form', () => {
    const out = generateFormFields(schema)

    expect(out).toContain('field.text("name", "Name"')
    expect(out).not.toContain('resourceLabel')
  })

  it('filter', () => {
    const out = generateFilterItems(schema)

    expect(out).toContain('{ label: "Active", value: "true" }')
    expect(out).not.toContain('resourceLabel')
  })
})

describe('keluaran generator dengan namespace', () => {
  it('kolom membawa kunci DAN teks Inggrisnya', () => {
    const out = generateColumnItems(schema, 'hr.employees')

    expect(out).toContain(
      'column.text("employee_no", resourceLabel("hr.employees.fields.employee_no", "Employee Number"))',
    )
  })

  it('field form membawa kunci lewat labelKey, label tetap Inggris', () => {
    const out = generateFormFields(schema, 'hr.employees')

    /*
     * Form BUKAN memakai `resourceLabel(...)` inline, dan itu
     * disengaja: `createForm([...])` adalah `const` tingkat module,
     * dihitung sekali saat chunk dimuat — saat i18n belum tentu
     * terpasang. Kuncinya dititipkan, komponen yang menerjemahkan.
     */
    expect(out).toContain('field.text("name", "Name"')
    expect(out).toContain('"labelKey": "hr.employees.fields.name"')
    expect(out).not.toContain('resourceLabel(')
  })

  it('filter membawa kunci lewat labelKey', () => {
    const out = generateFilterItems(schema, 'hr.employees')

    expect(out).toContain('labelKey: "hr.employees.filters.employee_no"')
    expect(out).not.toContain('resourceLabel(')
  })

  it('opsi Active/Inactive filter boolean tetap literal', () => {
    /*
     * Diterjemahkan `MCrudFilters` saat render, bukan di sini —
     * alasannya sama: opsi ini tersimpan di `const` tingkat module.
     * Yang penting keluarannya tidak berubah bentuk.
     */
    const out = generateFilterItems(schema, 'hr.employees')

    expect(out).toContain('{ label: "Active", value: "true" }')
    expect(out).toContain('{ label: "Inactive", value: "false" }')
  })

  it('nama field dan endpoint TIDAK ikut diterjemahkan', () => {
    const out = generateColumnItems(schema, 'hr.employees')

    // Argumen pertama adalah kunci payload. Kalau ia ikut dibungkus
    // terjemahan, tabelnya membaca kolom yang tidak ada.
    expect(out).toContain('column.text("employee_no",')
    expect(out).not.toContain('resourceLabel("hr.employees.fields.employee_no", "employee_no")')
  })
})
