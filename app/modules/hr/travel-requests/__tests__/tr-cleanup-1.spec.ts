import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { actionVisible } from '@framework/core/utils/recordActions'

import { travelRequestsWorkspaceTabs } from '../workspace'

/*
| TR-CLEANUP-1 — Travel Request dipisah dari Business Trip, tab
| Accommodation dipulihkan.
|
| Vitest di repo ini berjalan di `node` tanpa DOM, jadi SFC tidak
| dirender. Yang diuji: kontrak hasil generate (`workspace.ts`), syarat
| kunci per record lewat evaluator yang sama dengan layar
| (`actionVisible`), dan kabel komponennya (dibaca sebagai sumber).
| Penyimpanan barisnya diuji di Django (`test_tr_cleanup_1.py`).
*/

function source(relative: string): string {
  return readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf8')
}

function tab(key: string) {
  const found = travelRequestsWorkspaceTabs.find(item => item.key === key)

  if (!found)
    throw new Error(`tab ${key} tidak ada`)

  return found
}

function field(tabKey: string, key: string): Record<string, any> {
  const found = (tab(tabKey).fields ?? []).find(
    (item: any) => typeof item === 'object' && item.key === key,
  )

  if (!found || typeof found !== 'object')
    throw new Error(`field ${tabKey}.${key} tidak ada`)

  return found as Record<string, any>
}

const CHILD_TABS = ['purposes', 'travels', 'accommodation'] as const

describe('tab Accommodation', () => {
  it('tetap ada, inline, dan menawarkan Add Row', () => {
    const accommodation = tab('accommodation')

    expect(accommodation.type).toBe('resource')
    expect(accommodation.inline).toBe(true)
    expect(accommodation.canCreate).toBe(true)
  })

  it('membaca baris etape yang sama dengan Travel Arrangement', () => {
    expect(tab('accommodation').endpoint).toBe('/api/hr/travel-arrangements/')
    expect(tab('accommodation').endpoint).toBe(tab('travels').endpoint)
    expect(tab('accommodation').foreignKey).toBe('request')
  })

  it('kolomnya kolom kanonik akomodasi, tanpa field duplikat', () => {
    const keys = (tab('accommodation').fields ?? []).map((item: any) => item.key)

    expect(keys).toEqual([
      'direction',
      'sequence',
      'origin',
      'destination',
      'accommodation_type',
      'accommodation_name',
      'accommodation_checkin',
      'accommodation_checkout',
      'accommodation_nights',
      'notes',
    ])
  })

  it('arah dan rute bisa diketik pada baris baru', () => {
    for (const key of ['direction', 'sequence', 'origin', 'destination'])
      expect(field('accommodation', key).disabled, key).toBeFalsy()
  })

  it('Nights dihitung dari tanggal, bukan diketik', () => {
    const nights = field('accommodation', 'accommodation_nights')

    expect(nights.disabled).toBe(true)
    expect(nights.compute).toEqual({
      kind: 'date_diff',
      from: 'accommodation_checkin',
      to: 'accommodation_checkout',
      inclusive: false,
    })
  })

  it('Travel Arrangement tetap ada dan tetap bisa menambah etape', () => {
    expect(tab('travels').canCreate).toBe(true)
    expect(tab('travels').inline).toBe(true)
  })
})

describe('tabel anak terkunci pada dokumen yang tidak bisa disunting', () => {
  for (const key of CHILD_TABS) {
    it(`${key}: membawa readonlyWhen is_editable`, () => {
      expect(tab(key).readonlyWhen).toEqual({
        field: 'is_editable',
        op: 'is_false',
      })
    })

    it(`${key}: terkunci saat is_editable false, terbuka saat true`, () => {
      const rule = tab(key).readonlyWhen

      expect(actionVisible(rule, { is_editable: false })).toBe(true)
      expect(actionVisible(rule, { is_editable: true })).toBe(false)
    })
  }

  it('tab form tidak ikut dikunci', () => {
    expect(tab('general').readonlyWhen ?? null).toBeNull()
    expect(tab('notes').readonlyWhen ?? null).toBeNull()
  })
})

describe('Travel Purpose', () => {
  it('dropdown meminta daftar khusus Travel Request', () => {
    const purpose = field('purposes', 'purpose')

    expect(purpose.lookupParams).toEqual({ document: 'travel_request' })
    expect(purpose.endpoint).toBe(
      '/api/administration/references/hr/lookup/rotation-purposes/',
    )
  })
})

describe('kabel komponen', () => {
  const WORKSPACE = source('../components/TravelRequestsWorkspace.vue')
  const INLINE = source('../shared/workspace-resource/InlineResource.vue')
  const CORE = source(
    '../../../../../framework/components/workspace/resource/MWorkspaceResourceInline.vue',
  )

  it('Workspace meneruskan kunci tab ke tabel inline', () => {
    expect(WORKSPACE).toContain(':readonly="isTabReadonly(tab)"')
    expect(WORKSPACE).toContain('actionVisible(tab.readonlyWhen, props.record)')
  })

  it('InlineResource yang terkunci mematikan tambah, sunting, dan hapus', () => {
    expect(INLINE).toContain(':can-create="props.canCreate !== false && !props.readonly"')
    expect(INLINE).toContain(':can-edit="!props.readonly"')
    expect(INLINE).toContain(':can-delete="!props.readonly"')
  })

  it('Add Row dan hapus memang mengikuti flag-nya', () => {
    expect(CORE).toMatch(/v-if="props\.canCreate"[\s\S]{0,200}@click="addRow"/)
    expect(CORE).toContain('v-if="props.canDelete"')
    expect(CORE).toContain('|| !props.canEdit')
  })

  it('salinan modul sama dengan template generator', () => {
    const template = source(
      '../../../../../scripts/meinova/templates/crud-workspace/shared/workspace-resource/InlineResource.vue',
    )

    expect(INLINE).toBe(template)
  })
})
