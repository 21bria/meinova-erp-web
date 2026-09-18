import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { LOCALE_CODES } from '../config'
import { messages } from '../messages'

/*
| Sisi ERP-lebar dari `workflow-fields.spec.ts`.
|
| Yang dijaga di sini bukan "workflow punya terjemahan", tapi: **setiap
| kunci yang dipancarkan generator, di modul mana pun, bisa
| diselesaikan di setiap bahasa** — lewat katalog modulnya sendiri atau
| lewat kamus bersama `common.fields` / `common.tabs`.
|
| Kuncinya dibaca dari berkas hasil generate, bukan ditulis tangan.
| Jadi meregenerate modul dengan field baru akan menjatuhkan test ini
| sampai katalognya ikut diisi — alih-alih diam-diam menampilkan bahasa
| Inggris kepada pengguna Indonesia, yang tidak menimbulkan error apa
| pun dan karena itu tidak pernah ketahuan.
|
| Yang TIDAK dijaga: mutu terjemahannya. Test tidak bisa tahu "Kode"
| adalah terjemahan yang tepat untuk "Code"; ia cuma tahu kuncinya ada
| isinya.
*/

const MODULES = join(process.cwd(), 'app/modules')

const EMITTED = [
  /resourceLabel\(\s*"([^"]+)"/g,
  /labelKey:\s*"([^"]+)"/g,
  /placeholderKey:\s*"([^"]+)"/g,
]

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)

    if (statSync(full).isDirectory())
      return walk(full)

    return full.endsWith('.ts') || full.endsWith('.vue') ? [full] : []
  })
}

/*
| Dashboard (dan laporan, yang memakai schema dashboard) TIDAK lewat
| jalur ini.
|
| Modul CRUD memancarkan kuncinya ke berkas hasil generate; dashboard
| menulis schema-nya apa adanya sebagai JSON dan `useDashboard`
| menyusun kuncinya saat runtime. Kalau test ini cuma memindai
| `resourceLabel(`, seluruh Reports akan lolos tanpa satu pun kunci
| diperiksa — dan itu justru modul yang labelnya paling banyak.
|
| Jadi kuncinya disusun ulang di sini dengan aturan yang sama seperti
| `useDashboard`: `<namespace>.fields.<widget>`, `.filters.<filter>`,
| `.empty.<widget>`.
*/
const COLUMN_CATALOGS = new Set([
  'reports.hr.period-summary',
])

function dashboardKeys(source: string): string[] {
  const namespace = source.match(/"i18n":\s*\{\s*"namespace":\s*"([^"]+)"/)?.[1]

  if (!namespace || !source.includes('"type": "dashboard"'))
    return []

  const body = source.slice(source.indexOf('= {') + 2, source.lastIndexOf('}') + 1)

  let schema: any

  try {
    schema = JSON.parse(body)
  }
  catch {
    return []
  }

  const keys: string[] = []

  for (const widget of schema.widgets ?? []) {
    if (widget.label)
      keys.push(`${namespace}.fields.${widget.key}`)

    if (widget.empty_text)
      keys.push(`${namespace}.empty.${widget.key}`)

    // Kolom tabel laporan — `useDashboard` melokalkannya juga. Yang
    // diwajibkan baru laporan yang katalog kolomnya sudah diisi; tabel
    // lain tetap jatuh ke label Inggris dari schema (lihat CURRENT-WORK).
    if (widget.type === 'table' && COLUMN_CATALOGS.has(namespace)) {
      for (const column of widget.columns ?? []) {
        if (column.label)
          keys.push(`${namespace}.fields.${column.key}`)
      }
    }
  }

  for (const filter of schema.filters ?? []) {
    if (filter.label)
      keys.push(`${namespace}.filters.${filter.key}`)
  }

  return keys
}

function emittedKeys(): string[] {
  const keys = new Set<string>()

  for (const file of walk(MODULES)) {
    const source = readFileSync(file, 'utf8')

    for (const pattern of EMITTED) {
      for (const match of source.matchAll(pattern))
        keys.add(match[1]!)
    }

    if (file.endsWith('schema.ts')) {
      for (const key of dashboardKeys(source))
        keys.add(key)
    }
  }

  return [...keys].sort()
}

function lookup(bag: Record<string, any>, key: string): unknown {
  return key.split('.').reduce<any>(
    (node, part) => (node == null ? undefined : node[part]),
    bag,
  )
}

/*
| Urutan pencarian ini adalah cerminan `resourceLabel()` di
| `framework/core/utils/i18n.ts`. Kalau salah satunya berubah, yang
| satu lagi harus ikut — dan test inilah yang memberitahu.
*/
function resolves(bag: Record<string, any>, key: string): boolean {
  if (typeof lookup(bag, key) === 'string')
    return true

  if (key.includes('.filters.')) {
    if (typeof lookup(bag, key.replace('.filters.', '.fields.')) === 'string')
      return true
  }

  const shared = key.match(/\.(fields|filters|tabs|empty|placeholder)\.(.+)$/)

  if (shared) {
    const space = shared[1] === 'filters' ? 'fields' : shared[1]

    return typeof lookup(bag, `common.${space}.${shared[2]}`) === 'string'
  }

  return false
}

describe('label modul hasil generator', () => {
  const keys = emittedKeys()

  it('memancarkan kunci dari banyak modul, bukan cuma workflow', () => {
    expect(keys.length).toBeGreaterThan(1000)

    const namespaces = new Set(keys.map(key => key.split('.')[0]))

    expect(namespaces).toContain('hr')
    expect(namespaces).toContain('payroll')
    expect(namespaces).toContain('administration')
    expect(namespaces).toContain('references')
    expect(namespaces).toContain('reports')
    expect(namespaces).toContain('workflow')
  })

  for (const locale of LOCALE_CODES) {
    it(`punya isi untuk setiap kunci — ${locale}`, () => {
      const bag = messages[locale] as Record<string, any>
      const missing = keys.filter(key => !resolves(bag, key))

      expect(missing).toEqual([])
    })
  }
})
