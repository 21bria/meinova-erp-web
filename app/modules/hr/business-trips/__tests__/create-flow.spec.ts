import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { afterEach, describe, expect, it } from 'vitest'

import { saveFirstHint, saveFirstHintKey } from '@framework/core/utils/workspaceTabs'

import { messages } from '@/i18n/messages'

import { useBusinessTripsWorkspace } from '../composables/useBusinessTripsWorkspace'
import { legAccess } from '../detail/model'
import { businessTripsWorkspaceTabs } from '../workspace'

/*
| BT-5 UX — Create → simpan pertama → Edit, dan tab yang menunggu record.
|
| Travel & Accommodation butuh id Business Trip karena leg menempel ke
| induknya. Tab itu terkunci HANYA sebelum simpan pertama, dengan kalimat
| yang menjelaskan sebabnya; sesudah Save halaman pindah ke Edit record
| baru dan tabnya langsung terbuka — tidak menunggu Submit atau Approve.
|
| Vitest berjalan tanpa DOM: aturan tab diuji lewat composable workspace,
| perpindahan rute lewat sumber `page.vue` hasil generate.
*/

function source(relative: string): string {
  return readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8')
}

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

function tab(key: string) {
  const found = businessTripsWorkspaceTabs.find(item => item.key === key)

  if (!found)
    throw new Error(`tab ${key} tidak ada`)

  return found
}

function tabsFor(mode: 'create' | 'edit', record: Record<string, any> | null) {
  const workspace = useBusinessTripsWorkspace({
    mode,
    tabs: businessTripsWorkspaceTabs as any,
  })

  workspace.setRecord(record as any)

  return Object.fromEntries(
    workspace.tabs.value.map(item => [item.key, item]),
  )
}

const PAGE = source('../page.vue')
const TABS = source('../components/BusinessTripsTabs.vue')
const EDIT_PAGE = source('../../../../pages/hr/business-trips/[id]/edit.vue')
const LEGS = source('../detail/BusinessTripLegs.vue')

describe('1. Create belum disimpan', () => {
  it('Travel & Accommodation terkunci', () => {
    const tabs = tabsFor('create', null)

    expect(tabs.travel?.disabled).toBe(true)
    expect(tabs.general?.disabled).toBe(false)
    expect(tabs.trip?.disabled).toBe(false)
  })

  it('tab yang terkunci membawa kalimat "simpan dulu" (EN)', () => {
    withLocale('en')

    expect(saveFirstHint(tab('travel'))).toBe(
      'Save the Business Trip first to add travel and accommodation details.',
    )
  })

  it('tab yang terkunci membawa kalimat "simpan dulu" (ID)', () => {
    withLocale('id')

    expect(saveFirstHint(tab('travel'))).toBe(
      'Simpan Perjalanan Dinas terlebih dahulu untuk menambahkan detail perjalanan dan akomodasi.',
    )
  })

  it('kalimatnya tampil di tab, bukan hanya tab abu-abu', () => {
    expect(TABS).toMatch(/:title="waitingHint\(tab\) \|\| undefined"/)
    expect(TABS).toMatch(/\{\{ waitingHint\(tab\) \}\}/)
    expect(TABS).toMatch(/v-for="hint in waitingHints"/)
  })
})

describe('2. Save pertama pindah ke Edit record baru', () => {
  it('Save biasa = aksi "stay"', () => {
    expect(PAGE).toMatch(/async function handleSave\([\s\S]*?"stay",/)
  })

  it('"stay" mendorong rute Edit record yang baru tersimpan, bukan kembali ke daftar', () => {
    const stay = PAGE.slice(PAGE.indexOf('if (action === "close")'))

    expect(stay).toMatch(/router\.push\(\s*`\/hr\/business-trips\/\$\{saved\.id\}\/edit`/)
  })

  it('record tersimpan dipasang ke workspace sebelum rute berpindah', () => {
    expect(PAGE).toMatch(/workspace\.setRecord\(saved\)/)
  })
})

describe('3. Travel & Accommodation langsung terbuka sesudah simpan pertama', () => {
  it('record DRAFT → tab terbuka di Edit', () => {
    const tabs = tabsFor('edit', { id: 41, status: 'draft', is_editable: true })

    expect(tabs.travel?.disabled).toBe(false)
  })

  it('tidak menunggu Submit atau Approve', () => {
    for (const status of ['draft', 'submitted', 'approved']) {
      const tabs = tabsFor('edit', { id: 41, status })

      expect(tabs.travel?.disabled, status).toBe(false)
    }
  })

  it('tab yang sudah terbuka tidak membawa kalimat "simpan dulu"', () => {
    expect(TABS).toMatch(/if \(!tab\?\.requiresRecord \|\| hasRecord\.value\)\s*return ""/)
  })

  it('halaman Edit mengisi tab travel dengan panel leg', () => {
    expect(EDIT_PAGE).toMatch(/<template #travel="\{ record, recordId \}">\s*<BusinessTripLegs/)
  })
})

describe('4. Leg bisa ditambah pada DRAFT', () => {
  const allowed = { create: true, update: true, delete: true }

  it('DRAFT yang editable + izin backend → Add/Edit/Delete', () => {
    expect(legAccess({ status: 'draft', is_editable: true }, allowed)).toEqual({
      canCreate: true,
      canEdit: true,
      canDelete: true,
    })
  })

  it('izin leg dari backend tetap menentukan', () => {
    expect(
      legAccess({ status: 'draft', is_editable: true }, { create: false, update: false, delete: false }).canCreate,
    ).toBe(false)
  })

  it('tombol Add di panel leg memakai izin itu', () => {
    expect(LEGS).toMatch(/:can-create="resource\.canCreate\.value && access\.canCreate"/)
  })
})

describe('5. Save & New / Save & Close tidak berubah', () => {
  it('Save & New membuat record lalu membuka form kosong', () => {
    expect(PAGE).toMatch(/async function handleSaveAndNew\([\s\S]*?"new",/)
    expect(PAGE).toMatch(/if \(action === "new"\) \{[\s\S]*?formPayload\.value = \{\}[\s\S]*?router\.push\(\s*"\/hr\/business-trips\/create",/)
  })

  it('Save & Close membuat record lalu kembali ke daftar', () => {
    expect(PAGE).toMatch(/async function handleSaveAndClose\([\s\S]*?"close",/)
    expect(PAGE).toMatch(/if \(action === "close"\) \{\s*await router\.push\(\s*"\/hr\/business-trips",/)
  })
})

describe('Assignment & Approval saat Create', () => {
  /*
  | Lookup pegawai hanya membawa company/branch/location — tanpa
  | department, section, position, cost center. Pratinjau setengah
  | snapshot lebih menyesatkan daripada tidak ada, jadi Assignment
  | memakai pola yang sama: terkunci dengan kalimat.
  */
  it('terkunci sebelum simpan, terbuka sesudahnya', () => {
    expect(tabsFor('create', null).assignment?.disabled).toBe(true)
    expect(tabsFor('create', null).approval?.disabled).toBe(true)
    expect(tabsFor('edit', { id: 41 }).assignment?.disabled).toBe(false)
  })

  it('punya kalimat sendiri di kedua bahasa', () => {
    for (const locale of ['en', 'id'] as const) {
      withLocale(locale)

      for (const key of ['assignment', 'travel', 'approval']) {
        const hint = saveFirstHint(tab(key))

        expect(hint, `${locale} ${key}`).not.toBe('')
        expect(hint, `${locale} ${key}`).not.toBe(
          flatten(messages[locale]).get('common.workspace.saveFirst'),
        )
      }
    }
  })

  it('tab yang tidak menunggu record tidak membawa kalimat', () => {
    withLocale('en')

    expect(saveFirstHint(tab('general'))).toBe('')
  })
})

describe('kunci kalimat "simpan dulu"', () => {
  it('namespace diambil dari labelKey tab', () => {
    expect(saveFirstHintKey(tab('travel'))).toBe('hr.business-trips.saveFirst.travel')
  })

  it('modul tanpa kalimat khusus mendapat kalimat umum', () => {
    withLocale('id')

    expect(saveFirstHint({ key: 'lines', labelKey: 'x.y.fields.lines', requiresRecord: true })).toBe(
      'Simpan data ini terlebih dahulu untuk memakai bagian ini.',
    )
    expect(saveFirstHint({ key: 'lines', requiresRecord: true })).toBe(
      'Simpan data ini terlebih dahulu untuk memakai bagian ini.',
    )
  })

  it('tanpa i18n terpasang tetap ada kalimat Inggris', () => {
    expect(saveFirstHint({ key: 'lines', requiresRecord: true })).toBe(
      'Save this record first to use this section.',
    )
  })
})
