import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import en from '~/i18n/locales/en'
import id from '~/i18n/locales/id'

import { travelRequestsWorkspaceTabs } from '../workspace'

/*
| TR-CLEANUP-2 — Hapus di tab Accommodation tidak destruktif, teks bantu
| EN/ID. Vitest tanpa DOM: kontrak config, katalog, dan kabel komponen
| dibaca sebagai sumber.
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

function get(tree: any, path: string): unknown {
  return path.split('.').reduce((node, key) => node?.[key], tree)
}

const HINT_KEY = 'hr.travel-requests.tabHints.accommodation'

describe('Hapus di tab Accommodation', () => {
  it('baris tersimpan tidak bisa dihapus dari tab ini', () => {
    expect(tab('accommodation').canDelete).toBe(false)
  })

  it('Add Row tetap ada', () => {
    expect(tab('accommodation').canCreate).toBe(true)
  })

  it('tab Travel Arrangement tetap bisa menghapus etape', () => {
    expect(tab('travels').canDelete).not.toBe(false)
    expect(tab('purposes').canDelete).not.toBe(false)
  })

  it('komponen inline: draft tetap bisa dibuang, baris tersimpan tidak', () => {
    const core = source(
      '../../../../../framework/components/workspace/resource/MWorkspaceResourceInline.vue',
    )

    expect(core).toContain('v-if="row.__draft || props.canDeleteSaved"')
    expect(core).toMatch(/if \(!props\.canDeleteSaved\)\s+return\s+emit\("delete"/)
  })

  it('kabelnya sampai dari tab ke komponen inline', () => {
    const workspace = source('../components/TravelRequestsWorkspace.vue')
    const inline = source('../shared/workspace-resource/InlineResource.vue')

    expect(workspace).toContain(':can-delete="tab.canDelete !== false"')
    expect(inline).toContain(':can-delete-saved="props.canDelete !== false"')
  })
})

describe('teks bantu tab Accommodation', () => {
  it('schema membawa teks dan kunci terjemahannya', () => {
    expect(tab('accommodation').descriptionKey).toBe(HINT_KEY)
    expect(tab('accommodation').description).toContain('Travel Arrangement')
  })

  it('EN dan ID tersedia, sama dengan fallback Inggris dari schema', () => {
    const enText = get(en, HINT_KEY)
    const idText = get(id, HINT_KEY)

    expect(enText).toBe(tab('accommodation').description)
    expect(typeof idText).toBe('string')
    expect(idText).not.toBe(enText)
  })

  for (const [lang, catalog] of [['en', en], ['id', id]] as const) {
    it(`${lang}: menyebut empat hal yang perlu diketahui pengguna`, () => {
      const text = String(get(catalog, HINT_KEY))

      expect(text).toContain('Travel Arrangement')
      expect(text.length).toBeLessThan(260)
      // Tanpa istilah model/implementasi.
      expect(text).not.toMatch(/TravelArrangement|leg_id|is_deleted|API/)
    })
  }

  it('Workspace menerjemahkan teks bantu saat render', () => {
    const workspace = source('../components/TravelRequestsWorkspace.vue')

    expect(workspace).toContain(':description="tabDescription(tab)"')
    expect(workspace).toContain('resourceLabel(tab.descriptionKey, tab.description)')
  })

  it('tab lain tidak mendapat teks bantu', () => {
    for (const key of ['general', 'purposes', 'travels', 'notes'])
      expect(tab(key).description, key).toBeUndefined()
  })
})
