import { describe, expect, it } from 'vitest'

import { generateRecordActions } from '../generators/actions.mjs'

/*
| Record action + kunci terjemahan (BT-5).
|
| Tanpa namespace keluarannya identik dengan sebelum `i18nKey` ada —
| 90-an modul yang diregenerate tanpa namespace tidak boleh berubah
| satu byte pun.
*/

const schema = {
  actions: [
    { key: 'submit', label: 'Submit', endpoint: '/api/x/{id}/submit/', visible_when: { status: ['draft'] } },
    { key: 'export', label: 'Export' },
  ],
}

describe('generateRecordActions', () => {
  it('tanpa namespace: tidak ada i18nKey', () => {
    const out = generateRecordActions(schema)

    expect(out).not.toContain('i18nKey')
    expect(out).toContain('"key": "submit"')
    expect(out).not.toContain('"key": "export"')
  })

  it('dengan namespace: i18nKey per tombol', () => {
    const out = generateRecordActions(schema, 'hr.business-trips')

    expect(out).toContain('"i18nKey": "hr.business-trips.actions.submit"')
  })
})
