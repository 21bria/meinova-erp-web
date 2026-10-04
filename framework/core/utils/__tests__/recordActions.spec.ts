import { afterEach, describe, expect, it, vi } from 'vitest'

import { messages } from '@/i18n/messages'

import {
  actionBody,
  actionConfirm,
  actionFieldLabel,
  actionLabel,
  actionVisible,
  toOffsetIso,
} from '../recordActions'

vi.mock('@/composables/useNotify', () => ({
  useNotify: () => ({ error: vi.fn(), success: vi.fn() }),
}))

/*
| Record action (BT-5): teks dwibahasa lewat `i18nKey`, isian `datetime`
| yang dikirim sebagai instan ber-offset, syarat tampil yang dipindah dari
| `MRecordActions.vue`, dan error simpan yang tidak menempel ke kolom.
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

function withLocale(locale: 'en' | 'id') {
  const flat = flatten(messages[locale])

  ;(globalThis as any).useNuxtApp = () => ({
    $i18n: {
      locale: { value: locale },
      te: (key: string) => flat.has(key),
      t: (key: string) => flat.get(key) ?? key,
    },
  })
}

afterEach(() => {
  delete (globalThis as any).useNuxtApp
})

const cancel = {
  key: 'cancel',
  label: 'Cancel',
  i18nKey: 'hr.business-trips.actions.cancel',
  fields: [{ key: 'cancellation_reason', type: 'textarea', label: 'Alasan Pembatalan' }],
}

describe('teks action', () => {
  it('memakai katalog bahasa aktif lewat i18nKey', () => {
    withLocale('id')
    expect(actionLabel(cancel)).toBe('Batalkan Perjalanan')
    expect(actionFieldLabel(cancel, cancel.fields[0]!)).toBe('Alasan Pembatalan')

    withLocale('en')
    expect(actionLabel(cancel)).toBe('Cancel Trip')
    expect(actionFieldLabel(cancel, cancel.fields[0]!)).toBe('Cancellation Reason')
  })

  it('tanpa i18nKey = teks schema apa adanya (modul lama tidak berubah)', () => {
    withLocale('id')
    expect(actionLabel({ key: 'x', label: 'Generate Periods' })).toBe('Generate Periods')
  })

  it('kunci yang belum ditulis jatuh ke teks schema, bukan kunci mentah', () => {
    withLocale('id')
    expect(actionLabel({ key: 'x', label: 'Do It', i18nKey: 'hr.nope.actions.x' })).toBe('Do It')
  })

  it('kalimat konfirmasi ikut diterjemahkan', () => {
    withLocale('en')

    const confirm = actionConfirm({
      key: 'submit',
      label: 'Submit for Approval',
      i18nKey: 'hr.business-trips.actions.submit',
      confirm: { title: 'Ajukan Business Trip?', description: 'x' },
    })

    expect(confirm?.title).toBe('Submit this business trip?')
    expect(actionConfirm({ key: 'a', label: 'A' })).toBeNull()
  })
})

describe('isian datetime', () => {
  it('jam dinding dikirim sebagai instan dengan offset', () => {
    expect(toOffsetIso('2026-10-04T17:00', 420)).toBe('2026-10-04T17:00:00+07:00')
    expect(toOffsetIso('2026-10-04T17:00', 480)).toBe('2026-10-04T17:00:00+08:00')
    expect(toOffsetIso('2026-10-04T17:00', -330)).toBe('2026-10-04T17:00:00-05:30')
  })

  it('nilai yang sudah ber-zona atau bukan jam dinding tidak diubah', () => {
    expect(toOffsetIso('2026-10-04T17:00:00Z', 420)).toBe('2026-10-04T17:00:00Z')
    expect(toOffsetIso('besok', 420)).toBe('besok')
  })

  it('hanya isian bertipe datetime yang diubah', () => {
    const body = actionBody(
      [
        { key: 'actual_return_datetime', type: 'datetime' },
        { key: 'notes', type: 'textarea' },
      ],
      { actual_return_datetime: '2026-10-04T17:00', notes: '2026-10-04T17:00' },
      420,
    )

    expect(body).toEqual({
      actual_return_datetime: '2026-10-04T17:00:00+07:00',
      notes: '2026-10-04T17:00',
    })
  })
})

describe('syarat tampil (dipindah dari MRecordActions)', () => {
  it('peta path → nilai, termasuk path bersarang', () => {
    expect(actionVisible({ status: ['draft', 'rejected'] }, { status: 'rejected' })).toBe(true)
    expect(actionVisible({ status: ['draft', 'rejected'] }, { status: 'approved' })).toBe(false)
    expect(actionVisible({ 'approval.can_act': true }, { approval: { can_act: true } })).toBe(true)
    expect(actionVisible({ 'approval.can_act': true }, { approval: null })).toBe(false)
  })

  it('bentuk field-level dan kombinator tetap diterima', () => {
    expect(actionVisible({ field: 'status', op: 'not_in', value: ['draft'] }, { status: 'approved' })).toBe(true)
    expect(actionVisible({ any: [{ status: 'x' }, { status: 'y' }] }, { status: 'y' })).toBe(true)
    expect(actionVisible({ not: { status: 'y' } }, { status: 'y' })).toBe(false)
  })

  it('syarat kosong = tampil', () => {
    expect(actionVisible(null, {})).toBe(true)
  })
})

describe('error simpan yang tidak menempel ke kolom', () => {
  it('kalimat backend tampil apa adanya; yang menempel ke kolom tidak diulang', async () => {
    const { unattachedErrors } = await import('../errors')

    const lines = unattachedErrors(
      {
        departure_datetime: ['Bertabrakan dengan cuti CT-2026-00001.'],
        status: ['Business Trip berstatus Approved tidak bisa disunting.'],
        start_date: 'Bertabrakan dengan Business Trip BT-2026-00002.',
      },
      ['departure_datetime', 'return_datetime'],
    )

    expect(lines).toEqual([
      'Business Trip berstatus Approved tidak bisa disunting.',
      'Bertabrakan dengan Business Trip BT-2026-00002.',
    ])
  })

  it('tanpa error = kosong', async () => {
    const { unattachedErrors } = await import('../errors')

    expect(unattachedErrors(null, [])).toEqual([])
  })
})
