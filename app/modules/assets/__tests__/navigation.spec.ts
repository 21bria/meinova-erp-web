import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { moduleMenus } from '~/constants/menus'
import en from '~/i18n/locales/en'
import id from '~/i18n/locales/id'

/*
| Asset Management (ASSET-6) — menu dan rute, diuji sebagai data.
|
| Tiga hal yang gagal tanpa suara kalau tidak dijaga di sini:
|
| 1. item menu yang menunjuk halaman yang tidak ada (rute kosong tidak
|    berbunyi sebagai error — lihat komentar menu Finance);
| 2. rute dokumen yang didaftarkan backend lewat `register_route`
|    (`/assets/<x>/{id}`) tanpa halaman `[id]` — tautan dari layar
|    workflow mendarat di 404;
| 3. menu untuk fitur yang belum ada (Entitlement, Fixed Asset,
|    Depreciation).
*/

const PAGES = join(process.cwd(), 'app/pages')

function links(): string[] {
  return (moduleMenus.assets ?? []).flatMap((group: any) =>
    (group.items ?? []).map((item: any) => item.link as string),
  )
}

function pageFor(route: string): string | null {
  const base = join(PAGES, route)

  for (const candidate of [`${base}.vue`, join(base, 'index.vue')]) {
    if (existsSync(candidate))
      return candidate
  }

  return null
}

function lookup(bag: Record<string, any>, key: string): unknown {
  return key.split('.').reduce<any>((node, part) => (node == null ? undefined : node[part]), bag)
}

describe('menu Asset Management', () => {
  it('ada dan memuat layar operasional + kategori', () => {
    expect(links()).toEqual([
      '/assets/register',
      '/assets/assignments',
      '/assets/transfers',
      '/assets/returns',
      '/assets/categories',
    ])
  })

  it('setiap item menu punya halaman', () => {
    for (const link of links())
      expect(pageFor(link), `${link} tanpa halaman`).not.toBeNull()
  })

  it('tidak menjanjikan fitur yang belum ada', () => {
    const text = JSON.stringify(moduleMenus.assets).toLowerCase()

    for (const word of ['entitlement', 'fixed-asset', 'fixed asset', 'depreciation', 'accounting'])
      expect(text).not.toContain(word)
  })

  it('judul menu dan grup terjemah di kedua bahasa', () => {
    const keys = (moduleMenus.assets ?? []).flatMap((group: any) => [
      group.headingKey,
      ...(group.items ?? []).map((item: any) => item.titleKey),
    ])

    for (const key of [...keys, 'navigation.modules.assets']) {
      expect(typeof lookup(en as any, key), `${key} (en)`).toBe('string')
      expect(typeof lookup(id as any, key), `${key} (id)`).toBe('string')
    }
  })
})

describe('rute dokumen aset', () => {
  // Pola yang sama dengan `register_route` di
  // `apps/assets/workflow_handlers.py` (backend).
  const WORKFLOW_ROUTES = ['assignments', 'returns', 'transfers']

  it('setiap rute workflow punya halaman detail', () => {
    for (const kind of WORKFLOW_ROUTES) {
      expect(existsSync(join(PAGES, 'assets', kind, '[id]', 'index.vue')), kind).toBe(true)
      expect(existsSync(join(PAGES, 'assets', kind, '[id]', 'edit.vue')), kind).toBe(true)
      expect(existsSync(join(PAGES, 'assets', kind, 'create.vue')), kind).toBe(true)
    }
  })

  it('halaman detail mengisi tab custom dari schema backend', () => {
    for (const kind of WORKFLOW_ROUTES) {
      const source = readFileSync(join(PAGES, 'assets', kind, '[id]', 'index.vue'), 'utf8')

      expect(source).toContain('#summary=')
      expect(source).toContain(`kind="${kind}"`)
    }

    const register = readFileSync(join(PAGES, 'assets', 'register', '[id]', 'index.vue'), 'utf8')

    for (const slot of ['#overview=', '#custody_history=', '#condition_history=', '#documents='])
      expect(register).toContain(slot)
  })

  it('akar modul tidak mendarat di 404', () => {
    expect(readFileSync(join(PAGES, 'assets', 'index.vue'), 'utf8')).toContain('redirect: \'/assets/register\'')
  })
})
