import { afterEach, describe, expect, it } from 'vitest'

import { messages } from '../messages'

/*
| Perilaku `translate` / `resourceLabel` / `statusLabel` di
| `framework/core/utils/i18n.ts`.
|
| Yang dijaga di sini satu janji, dan itu janji yang membuat seluruh
| perubahan ini aman untuk dirilis bertahap:
|
|     kunci yang tidak ada -> teks Inggris yang lama, apa adanya
|
| Jadi modul yang belum diterjemahkan, kunci yang salah ketik, dan kode
| yang berjalan di luar konteks Nuxt semuanya menghasilkan layar yang
| persis seperti sebelum i18n dipasang.
*/

// Katalog kecil yang meniru composer vue-i18n, cukup untuk `te`/`t`.
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

  walk(messages[locale])

  return {
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

async function load() {
  // Diimpor ulang tiap kali supaya stub `useNuxtApp` yang berlaku.
  return import('@framework/core/utils/i18n')
}

describe('translate', () => {
  it('menerjemahkan kunci yang ada', async () => {
    withLocale('id')
    const { translate } = await load()

    expect(translate('common.actions.save', 'Save')).toBe('Simpan')
  })

  it('mengembalikan fallback untuk kunci yang tidak ada', async () => {
    withLocale('id')
    const { translate } = await load()

    expect(translate('common.actions.tidak_ada', 'Save')).toBe('Save')
  })

  it('tIDAK pernah mengembalikan kuncinya sendiri', async () => {
    withLocale('id')
    const { translate } = await load()

    const hasil = translate('hr.employees.fields.belum_ada', 'Employee Number')

    expect(hasil).toBe('Employee Number')
    expect(hasil).not.toContain('hr.employees')
  })

  it('jatuh ke fallback saat berjalan di luar konteks Nuxt', async () => {
    // Tanpa stub: `useNuxtApp` tidak ada, dan itu keadaan yang sah —
    // render function tabel bisa jalan di luar setup.
    const { translate } = await load()

    expect(translate('common.actions.save', 'Save')).toBe('Save')
  })

  it('bahasa Inggris mengembalikan teks yang sama dengan sebelum i18n ada', async () => {
    withLocale('en')
    const { translate } = await load()

    expect(translate('common.actions.save', 'Save')).toBe('Save')
    expect(translate('common.actions.cancel', 'Cancel')).toBe('Cancel')
    expect(translate('common.status.active', 'Active')).toBe('Active')
  })
})

describe('resourceLabel — label hasil generator', () => {
  it('memakai katalog kalau kuncinya ada', async () => {
    withLocale('id')
    const { resourceLabel } = await load()

    expect(resourceLabel('hr.employee.fields.employee_no', 'Employee Number'))
      .toBe('Nomor Karyawan')
  })

  it('modul yang belum diterjemahkan tetap tampil seperti dulu', async () => {
    withLocale('id')
    const { resourceLabel } = await load()

    expect(resourceLabel('scm.vendors.fields.npwp', 'Tax ID')).toBe('Tax ID')
  })
})

describe('statusLabel — kode stabil, label yang berubah', () => {
  it('menerjemahkan kode huruf besar dari API', async () => {
    withLocale('id')
    const { statusLabel } = await load()

    expect(statusLabel('APPROVED')).toBe('Disetujui')
    expect(statusLabel('REJECTED')).toBe('Ditolak')
    expect(statusLabel('PENDING')).toBe('Menunggu')
    expect(statusLabel('DRAFT')).toBe('Draf')
    expect(statusLabel('POSTED')).toBe('Diposting')
  })

  it('kode yang belum punya terjemahan memakai label dari API', async () => {
    withLocale('id')
    const { statusLabel } = await load()

    expect(statusLabel('SETTLED', 'Settled')).toBe('Settled')
  })

  it('tanpa label dari API, kodenya sendiri yang tampil', async () => {
    withLocale('id')
    const { statusLabel } = await load()

    expect(statusLabel('SETTLED')).toBe('SETTLED')
  })

  it('nilai kosong tidak menghasilkan teks aneh', async () => {
    withLocale('id')
    const { statusLabel } = await load()

    expect(statusLabel(null)).toBe('')
    expect(statusLabel(undefined)).toBe('')
    expect(statusLabel('', '-')).toBe('-')
  })
})

describe('optionLabel — pasangan {value,label} dari API', () => {
  it('menampilkan terjemahan tapi TIDAK menyentuh value', async () => {
    withLocale('id')
    const { optionLabel } = await load()

    const dariApi = { value: 'APPROVED', label: 'Approved' }

    expect(optionLabel(dariApi)).toBe('Disetujui')

    // Yang paling penting di seluruh berkas ini: objek dari API tidak
    // berubah. Nilai yang dikirim balik ke backend tetap "APPROVED".
    expect(dariApi.value).toBe('APPROVED')
    expect(dariApi.label).toBe('Approved')
  })

  it('mempertahankan label backend untuk kode yang tidak dikenal', async () => {
    withLocale('id')
    const { optionLabel } = await load()

    expect(optionLabel({ value: 'PARTIAL', label: 'Partially Paid' }))
      .toBe('Partially Paid')
  })
})
