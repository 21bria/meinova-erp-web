import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { actionBody, actionVisible } from '@framework/core/utils/recordActions'

import en from '~/i18n/locales/en'
import id from '~/i18n/locales/id'
import {
  hrRosterTravelCategories,
  hrRosterTravelItems,
} from '~/registry/section-hub/hr-roster-travel'

import { businessTripsRecordActions } from '../actions'
import {
  legAccess,
  lifecycleSteps,
  orderedLegs,
  relationships,
  snapshotItems,
  statusTone,
  terminalState,
  timeline,
  trailRows,
} from '../detail/model'
import { businessTripsWorkspaceTabs } from '../workspace'

/*
| Business Trip — frontend BT-5.
|
| Vitest di repo ini berjalan di `node` tanpa DOM, jadi SFC tidak
| dirender di sini. Yang diuji: (1) logika murni tab detail
| (`detail/model.ts`), (2) kontrak hasil generate dari schema backend
| (berkas dibaca sebagai sumber — `form.ts`/`columns.ts` mengimpor
| `@framework` yang memuat SFC), (3) katalog dwibahasa. Perilaku layar
| sungguhan diuji UAT browser.
*/

function source(relative: string): string {
  return readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8')
}

function get(tree: any, path: string): unknown {
  return path.split('.').reduce((node, key) => node?.[key], tree)
}

const FORM = source('../form.ts')
const COLUMNS = source('../columns.ts')
const FILTERS = source('../filters.ts')

function action(key: string) {
  const found = businessTripsRecordActions.find(item => item.key === key)

  if (!found)
    throw new Error(`action ${key} tidak ada`)

  return found
}

function visible(key: string, record: Record<string, any>) {
  const item = action(key)

  return actionVisible(item.visibleWhen ?? item.visible_when ?? null, record)
}

// ---------------------------------------------------------------------
// Menu
// ---------------------------------------------------------------------

describe('menu: HR → Roster & Travel → Travel', () => {
  const card = hrRosterTravelItems.find(item => item.key === 'business-trips')

  it('Business Trips punya kartu sendiri di kategori Travel', () => {
    expect(card?.link).toBe('/hr/business-trips')
    expect(card?.category).toBe('travel')
    expect(hrRosterTravelCategories.map(item => item.key)).toContain('travel')
  })

  it('Travel Request tetap kartu terpisah di kategori yang sama', () => {
    const travel = hrRosterTravelItems.filter(item => item.category === 'travel')

    expect(travel.map(item => item.link)).toEqual(
      expect.arrayContaining(['/hr/travel-requests', '/hr/business-trips']),
    )
    expect(new Set(travel.map(item => item.link)).size).toBe(travel.length)
  })

  it('bukan modul tingkat atas dan tidak lewat Visitor', () => {
    const menus = source('../../../../constants/menus.ts')

    expect(menus).not.toContain('/hr/business-trips')
    expect(card?.link).not.toContain('visitor')
  })
})

// ---------------------------------------------------------------------
// Daftar
// ---------------------------------------------------------------------

describe('daftar', () => {
  it('kolom: nomor, pegawai, company, tujuan, berangkat, kembali, tujuan dinas, status', () => {
    for (const key of [
      'document_number',
      'employee_name',
      'company_name',
      'destination_summary',
      'departure_datetime',
      'return_datetime',
      'purpose_category_label',
      'status_label',
    ]) {
      expect(COLUMNS, key).toContain(`"${key}"`)
    }
  })

  it('tanpa kolom teknis (is_active, salinan organisasi, jejak waktu)', () => {
    for (const key of ['is_active', 'requester_name', 'cost_center_name', 'submitted_at', 'cancelled_by'])
      expect(COLUMNS, key).not.toContain(`"${key}"`)
  })

  it('gagal memuat (mis. 403) tampil sebagai pesan backend, bukan "No results."', () => {
    const table = source('../components/BusinessTripsTable.vue')
    const crud = source('../../../../../framework/core/composables/useCrud.ts')
    const grid = source('../../../../../framework/components/table/MTable.vue')

    expect(table).toContain(':error="crud.errorMessage.value"')
    expect(crud).toContain('apiErrorMessage(')
    expect(grid).toContain("props.errorText || 'No results.'")
  })

  it('penyaring: cari, status, pegawai, company — yang memang disaring backend', () => {
    expect(FILTERS).toContain('search: {')
    expect(FILTERS).toContain('filter.select("status"')
    expect(FILTERS).toContain('filter.lookup("employee"')
    expect(FILTERS).toContain('filter.lookup("company"')
    expect(FILTERS).not.toContain('"is_active"')
    expect(FILTERS).not.toContain('filter.text("departure_datetime"')
  })
})

// ---------------------------------------------------------------------
// Form buat / sunting
// ---------------------------------------------------------------------

describe('form', () => {
  it('memuat field kanonik BT-2', () => {
    for (const key of [
      'employee',
      'destination_type',
      'destination_detail',
      'purpose_category',
      'purpose',
      'departure_datetime',
      'return_datetime',
      'notes',
      'attachment',
    ]) {
      expect(FORM, key).toContain(`("${key}"`)
    }
  })

  it('salinan organisasi tidak bisa diisi dari form', () => {
    for (const key of ['company', 'branch', 'location', 'division', 'department', 'section', 'position', 'cost_center'])
      expect(FORM, key).not.toMatch(new RegExp(`field\\.\\w+\\("${key}"`))
  })

  it('tab form menyebut field yang dirender, termasuk lampiran', () => {
    const byKey = Object.fromEntries(
      businessTripsWorkspaceTabs.map((tab: any) => [tab.key, tab]),
    )

    expect(byKey.trip.fields).toEqual(expect.arrayContaining(['departure_datetime', 'return_datetime']))
    expect(byKey.attachments.fields).toEqual(['attachment'])
  })

  it('pengganti/perpanjangan belum diisi dari form (belum ada lookup per pegawai)', () => {
    const trip: any = businessTripsWorkspaceTabs.find((tab: any) => tab.key === 'trip')

    expect(trip.fields).not.toContain('supersedes')
    expect(trip.fields).not.toContain('supersede_type')
  })

  it('tab custom: Assignment, Travel & Accommodation, Approval / History', () => {
    const custom = businessTripsWorkspaceTabs
      .filter((tab: any) => tab.type === 'custom')
      .map((tab: any) => tab.key)

    expect(custom).toEqual(['assignment', 'travel', 'approval'])

    for (const page of ['../../../../pages/hr/business-trips/[id]/index.vue', '../../../../pages/hr/business-trips/[id]/edit.vue']) {
      const text = source(page)

      expect(text).toContain('#assignment=')
      expect(text).toContain('#travel=')
      expect(text).toContain('#approval=')
    }
  })
})

// ---------------------------------------------------------------------
// Batas sunting & izin
// ---------------------------------------------------------------------

describe('batas sunting ruas (dari backend, bukan aturan frontend)', () => {
  const all = { create: true, update: true, delete: true }

  it('dokumen yang tidak is_editable → ruas terkunci walau punya izin', () => {
    expect(legAccess({ status: 'approved', is_editable: false }, all)).toEqual({
      canCreate: false,
      canEdit: false,
      canDelete: false,
    })
  })

  it('is_editable → mengikuti izin model ruas per kata kerja', () => {
    expect(legAccess({ is_editable: true }, { create: true, update: false, delete: false })).toEqual({
      canCreate: true,
      canEdit: false,
      canDelete: false,
    })
  })

  it('peta izin belum dimuat → tidak menyembunyikan apa pun (API penjaganya)', () => {
    expect(legAccess({ is_editable: true }, null).canEdit).toBe(true)
  })

  it('tidak ada aksi yang menyaring izin sendiri — backend yang menolak', () => {
    for (const item of businessTripsRecordActions)
      expect(item.permission ?? null, item.key).toBeNull()
  })
})

// ---------------------------------------------------------------------
// Detail
// ---------------------------------------------------------------------

describe('siklus hidup', () => {
  const states = (status: string, extra: Record<string, any> = {}) =>
    lifecycleSteps({ status, ...extra }).map(step => `${step.key}:${step.state}`)

  it('Approved → On Trip → Completed', () => {
    expect(states('approved', { approved_at: 'x' })).toEqual([
      'draft:done', 'submitted:done', 'approved:current', 'on_trip:upcoming', 'completed:upcoming',
    ])
    expect(states('on_trip')).toEqual([
      'draft:done', 'submitted:done', 'approved:done', 'on_trip:current', 'completed:upcoming',
    ])
    expect(states('completed').every(item => item.endsWith(':done'))).toBe(true)
  })

  it('dibatalkan sesudah berangkat berhenti di On Trip', () => {
    const record = { status: 'cancelled', approved_at: 'a', departed_at: 'b' }

    expect(terminalState(record)).toBe('cancelled')
    expect(lifecycleSteps(record).filter(step => step.state === 'done').map(step => step.key))
      .toEqual(['draft', 'submitted', 'approved', 'on_trip'])
  })

  it('ditolak berhenti di Submitted', () => {
    expect(terminalState({ status: 'rejected' })).toBe('rejected')
    expect(lifecycleSteps({ status: 'rejected' }).map(step => step.state))
      .toEqual(['done', 'done', 'upcoming', 'upcoming', 'upcoming'])
  })

  it('jejak waktu urut, hanya yang dikirim API', () => {
    expect(timeline({
      completed_at: '2026-10-05T10:00:00Z',
      submitted_at: '2026-10-01T10:00:00Z',
      actual_departure_datetime: '2026-10-03T01:00:00Z',
      approved_at: null,
    }).map(event => event.key)).toEqual([
      'submitted_at',
      'actual_departure_datetime',
      'completed_at',
    ])
  })

  it('pengganti / perpanjangan terbaca dua arah', () => {
    const links = relationships({
      supersedes: 7,
      supersedes_number: 'BT-2026-00007',
      supersede_type: 'extension',
      superseded_by: [{ id: 9, document_number: 'BT-2026-00009', supersede_type: 'replacement', status: 'draft' }],
    })

    expect(links.supersedes).toEqual({ id: 7, number: 'BT-2026-00007', type: 'extension' })
    expect(links.supersededBy).toEqual([{ id: 9, number: 'BT-2026-00009', type: 'replacement', status: 'draft' }])
    expect(relationships({}).supersedes).toBeNull()
  })

  it('salinan organisasi dibaca dari *_name, kosong = null', () => {
    const items = snapshotItems({ company_name: 'PT Meinova', cost_center_name: '' })

    expect(items.find(item => item.key === 'company')?.value).toBe('PT Meinova')
    expect(items.find(item => item.key === 'cost_center')?.value).toBeNull()
  })

  it('jejak persetujuan memakai bentuk WorkflowApprovalTrail', () => {
    expect(trailRows({
      steps: [{ approval_id: 1, sequence: 1, name: 'Manager', decision: 'approved', decision_label: 'Approved', approver: 'Budi', notes: 'ok', decided_at: 'x' }],
    })).toEqual([{
      id: 1, sequence: 1, name: 'Manager', status: 'approved', status_label: 'Approved',
      approver_name: 'Budi', comment: 'ok', acted_at: 'x',
    }])
    expect(trailRows(null)).toEqual([])
  })
})

describe('ruas perjalanan', () => {
  it('itinerary urut sequence lalu id', () => {
    expect(orderedLegs([
      { id: 3, sequence: 2 },
      { id: 2, sequence: 1 },
      { id: 1, sequence: 2 },
    ]).map(leg => leg.id)).toEqual([2, 1, 3])
  })

  it('isian ruas dari schema backend: arah, waktu, rute, transport, tiket, akomodasi', () => {
    const legs = source('../../business-trip-legs/form.ts')

    for (const key of [
      'direction', 'sequence', 'travel_start_date', 'travel_end_date', 'origin', 'destination',
      'transport_mode', 'ticket_number', 'accommodation_name', 'check_in_date', 'check_out_date', 'notes',
    ]) {
      expect(legs, key).toContain(`("${key}"`)
    }

    for (const direction of ['outbound', 'return', 'intermediate'])
      expect(legs).toContain(`"value": "${direction}"`)
  })
})

describe('status', () => {
  const STATUSES = ['draft', 'submitted', 'approved', 'on_trip', 'completed', 'rejected', 'cancelled']

  it('tiap status punya label di kedua bahasa — tidak ada kode mentah', () => {
    for (const status of STATUSES) {
      expect(get(en, `common.status.${status}`), status).toBeTypeOf('string')
      expect(get(id, `common.status.${status}`), status).toBeTypeOf('string')
    }
  })

  it('lencana membedakan status', () => {
    expect(new Set(STATUSES.map(statusTone)).size).toBe(STATUSES.length)
  })
})

// ---------------------------------------------------------------------
// Aksi
// ---------------------------------------------------------------------

describe('aksi mengikuti schema backend', () => {
  it('delapan aksi BT-2, masing-masing ke endpoint-nya sendiri', () => {
    const keys = ['submit', 'approve', 'reject', 'return', 'withdraw', 'depart', 'complete', 'cancel']

    expect(businessTripsRecordActions.map(item => item.key)).toEqual(keys)

    for (const key of keys)
      expect(action(key).endpoint).toBe(`/api/hr/business-trips/{id}/${key}/`)
  })

  it('submit: draft/rejected, dengan konfirmasi', () => {
    expect(visible('submit', { status: 'draft' })).toBe(true)
    expect(visible('submit', { status: 'rejected' })).toBe(true)
    expect(visible('submit', { status: 'approved' })).toBe(false)
    expect(action('submit').confirm).toBeTruthy()
  })

  it('approve/reject/return hanya untuk yang boleh memutuskan (approval.can_act dari backend)', () => {
    for (const key of ['approve', 'reject', 'return']) {
      expect(visible(key, { status: 'submitted', approval: { can_act: true } }), key).toBe(true)
      expect(visible(key, { status: 'submitted', approval: { can_act: false } }), key).toBe(false)
    }

    expect(action('reject').fields?.[0]).toMatchObject({ key: 'notes', required: true })
  })

  it('depart: approved saja', () => {
    expect(visible('depart', { status: 'approved' })).toBe(true)
    expect(visible('depart', { status: 'on_trip' })).toBe(false)
  })

  it('complete: approved/on_trip, waktu kembali aktual wajib dan dikirim ber-offset', () => {
    expect(visible('complete', { status: 'on_trip' })).toBe(true)
    expect(visible('complete', { status: 'completed' })).toBe(false)

    const field = action('complete').fields?.[0]

    expect(field).toMatchObject({ key: 'actual_return_datetime', type: 'datetime', required: true })
    expect(actionBody(action('complete').fields, { actual_return_datetime: '2026-10-04T17:00' }, 420))
      .toEqual({ actual_return_datetime: '2026-10-04T17:00:00+07:00' })
  })

  it('cancel: approved/on_trip, alasan wajib', () => {
    expect(visible('cancel', { status: 'approved' })).toBe(true)
    expect(visible('cancel', { status: 'draft' })).toBe(false)
    expect(action('cancel').fields?.[0]).toMatchObject({ key: 'cancellation_reason', required: true })
    expect(action('cancel').variant).toBe('destructive')
  })

  it('withdraw: submitted saja', () => {
    expect(visible('withdraw', { status: 'submitted' })).toBe(true)
    expect(visible('withdraw', { status: 'approved' })).toBe(false)
  })

  it('tiap aksi punya kunci terjemahan', () => {
    for (const item of businessTripsRecordActions) {
      expect(item.i18nKey).toBe(`hr.business-trips.actions.${item.key}`)
      expect(get(en, `${item.i18nKey}.label`), item.key).toBeTypeOf('string')
      expect(get(id, `${item.i18nKey}.label`), item.key).toBeTypeOf('string')
    }
  })
})

describe('error backend tampil apa adanya', () => {
  it('workspace menampilkan error yang tidak menempel ke kolom', () => {
    const workspace = source('../components/BusinessTripsWorkspace.vue')

    expect(workspace).toContain('unattachedErrors(props.errors')
    expect(workspace).toContain('data-testid="workspace-unattached-errors"')
  })

  it('aksi memakai kalimat `errors` backend, bukan "Validation failed."', () => {
    const actions = source('../../../../../framework/components/crud/MRecordActions.vue')

    expect(actions).toContain('apiErrorDetail(error)')
  })
})

// ---------------------------------------------------------------------
// Pelaporan & presensi
// ---------------------------------------------------------------------

describe('pelaporan', () => {
  it('HR Period Summary: kolom Business Trip, terpisah dari Present', () => {
    const schema = source('../../../reports/hr/period-summary/schema.ts')

    expect(schema).toContain('"key": "business_trip"')
    expect(schema).toContain('"drilldown": "business_trip"')
  })

  it('Self Service: kartu Perjalanan Dinas dan hasil harian sendiri', () => {
    const cards = source('../../../self-service/components/AttendanceSummaryCards.vue')
    const strip = source('../../../self-service/components/AttendanceDayStrip.vue')

    expect(cards).toContain('props.summary.business_trip')
    expect(strip).toContain('business_trip:')
    expect(get(en, 'me.attendance.summary.businessTrip')).toBe('Business Trip')
    expect(get(id, 'me.attendance.summary.businessTrip')).toBe('Perjalanan Dinas')
  })
})

describe('presensi manual', () => {
  it('business_trip tidak bisa dipilih di form presensi, tetap terbaca dan bisa disaring', () => {
    const form = source('../../attendance/form.ts')
    const filters = source('../../attendance/filters.ts')

    expect(form).toMatch(/"value": "business_trip",\s*"disabled": true/)
    expect(filters).toContain('value: "business_trip"')
  })
})

// ---------------------------------------------------------------------
// Bahasa & batas Visitor
// ---------------------------------------------------------------------

describe('katalog dwibahasa', () => {
  const KEYS = [
    'title', 'placeholder.search',
    'tabs.general', 'tabs.trip', 'tabs.attachments', 'tabs.assignment', 'tabs.travel', 'tabs.approval',
    'fields.document_number', 'fields.employee', 'fields.destination_summary', 'fields.departure_datetime',
    'fields.return_datetime', 'fields.actual_departure_datetime', 'fields.actual_return_datetime',
    'fields.company', 'fields.branch', 'fields.location', 'fields.division', 'fields.department',
    'fields.section', 'fields.position', 'fields.cost_center', 'fields.origin_location', 'fields.requester',
    'fields.submitted_at', 'fields.approved_at', 'fields.rejected_at', 'fields.completed_at', 'fields.cancelled_at',
    'assignment.hint', 'legs.description', 'legs.empty', 'legs.locked',
    'lifecycle.title', 'lifecycle.extensionHint', 'cancellation.title', 'links.title',
    'links.supersedes.replacement', 'links.supersedes.extension',
    'links.supersededBy.replacement', 'links.supersededBy.extension',
    'approval.title', 'approval.notSubmitted', 'approval.waitingFor', 'timeline.title',
  ]

  it('setiap kunci layar ada di kedua bahasa', () => {
    for (const key of KEYS) {
      expect(get(en, `hr.business-trips.${key}`), `en ${key}`).toBeTypeOf('string')
      expect(get(id, `hr.business-trips.${key}`), `id ${key}`).toBeTypeOf('string')
    }
  })

  it('istilah: Business Trip / Perjalanan Dinas', () => {
    expect(get(en, 'hr.business-trips.title')).toBe('Business Trip')
    expect(get(id, 'hr.business-trips.title')).toBe('Perjalanan Dinas')
  })

  it('Travel Request tidak lagi bernama "Perjalanan Dinas"', () => {
    expect(get(id, 'hr.travel.title')).not.toBe('Perjalanan Dinas')
    expect(get(id, 'navigation.items.rosterTravel')).toBe('Roster & Perjalanan')
  })

  it('enum tampil sebagai kata, bukan kode', () => {
    for (const [field, codes] of Object.entries({
      purpose_category: ['duty', 'site_visit', 'meeting', 'training', 'audit', 'other'],
      destination_type: ['internal_location', 'external_domestic', 'external_international'],
      supersede_type: ['replacement', 'extension'],
      direction: ['outbound', 'return', 'intermediate'],
    })) {
      for (const code of codes) {
        expect(get(en, `codes.${field}.${code}`), `en ${field}.${code}`).toBeTypeOf('string')
        expect(get(id, `codes.${field}.${code}`), `id ${field}.${code}`).toBeTypeOf('string')
      }
    }
  })
})

describe('batas Visitor', () => {
  it('tidak ada layar Business Trip yang mengarah ke Visitor Request', () => {
    for (const file of [
      '../detail/BusinessTripApproval.vue',
      '../detail/BusinessTripAssignment.vue',
      '../detail/BusinessTripLegs.vue',
      '../../../../pages/hr/business-trips/index.vue',
      '../../../../pages/hr/business-trips/create.vue',
    ]) {
      expect(source(file), file).not.toContain('visitor')
    }
  })
})
