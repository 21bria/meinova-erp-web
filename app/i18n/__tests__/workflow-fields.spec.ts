import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import { LOCALE_CODES } from '../config'
import { messages } from '../messages'

/*
| Setiap kunci yang dipancarkan generator harus punya isi di SETIAP
| bahasa.
|
| Kuncinya tidak ditulis tangan di test ini — dibaca langsung dari
| berkas hasil generate di `app/modules/workflow/`. Jadi meregenerate
| modul dengan field baru akan **menjatuhkan test ini** sampai
| katalognya ikut diisi, alih-alih diam-diam menampilkan bahasa Inggris
| kepada pengguna Indonesia.
|
| `resourceLabel` memang punya fallback ke label Inggris, dan itu yang
| membuat regenerate tidak pernah merusak layar. Tapi fallback adalah
| jaring, bukan tujuan — test ini yang memastikan jaringnya jarang
| terpakai.
*/

const MODULES = join(process.cwd(), 'app/modules/workflow')

/*
| Generator memancarkan kunci lewat DUA bentuk, dan keduanya harus
| ikut diperiksa:
|
|   resourceLabel("key", "English")   -> dirakit di dalam fungsi render
|                                        (kolom tabel, tab workspace)
|   labelKey: "key"                   -> dititipkan di konfigurasi
|                                        tingkat module (form, filter),
|                                        diterjemahkan komponen
|
| Memeriksa satu saja membuat test ini hijau sambil separuh layar
| kehilangan terjemahannya.
*/
const EMIT_CALL = /resourceLabel\("([^"]+)", "([^"]*)"\)/g
const EMIT_KEY = /"?labelKey"?:\s*"([^"]+)"/g

function emittedKeys(): Array<{ key: string, fallback: string, file: string }> {
  const out: Array<{ key: string, fallback: string, file: string }> = []

  for (const dir of readdirSync(MODULES, { withFileTypes: true })) {
    if (!dir.isDirectory())
      continue

    for (const name of ['columns.ts', 'form.ts', 'filters.ts', 'workspace.ts']) {
      const path = join(MODULES, dir.name, name)

      let src: string
      try {
        src = readFileSync(path, 'utf8')
      }
      catch {
        continue
      }

      for (const m of src.matchAll(EMIT_CALL))
        out.push({ key: m[1]!, fallback: m[2]!, file: `${dir.name}/${name}` })

      for (const m of src.matchAll(EMIT_KEY))
        out.push({ key: m[1]!, fallback: '', file: `${dir.name}/${name}` })
    }
  }

  return out
}

/** Menirukan urutan pencarian `resourceLabel()`. */
function resolve(locale: string, key: string): string | null {
  const walk = (path: string) => {
    let node: any = messages[locale as keyof typeof messages]

    for (const part of path.split('.')) {
      if (node == null || typeof node !== 'object')
        return null
      node = node[part]
    }

    return typeof node === 'string' ? node : null
  }

  return walk(key)
    ?? (key.includes('.filters.') ? walk(key.replace('.filters.', '.fields.')) : null)
}

const keys = emittedKeys()

describe('label hasil generator Workflow', () => {
  it('generator memang memancarkan kunci, bukan literal', () => {
    // Kalau angka ini nol, seluruh test di bawah lulus dengan hampa.
    expect(keys.length).toBeGreaterThan(50)

    // Dan kedua mekanismenya benar-benar terpakai.
    expect(keys.some(k => k.fallback !== '')).toBe(true)
    expect(keys.some(k => k.fallback === '')).toBe(true)
  })

  it('setiap kunci punya terjemahan di setiap bahasa', () => {
    const holes: string[] = []

    for (const { key, file } of keys) {
      for (const locale of LOCALE_CODES) {
        if (!resolve(locale, key))
          holes.push(`${locale}: ${key} (${file})`)
      }
    }

    expect(holes, holes.slice(0, 10).join('\n')).toEqual([])
  })

  it('Bahasa Indonesia benar-benar berbeda dari Inggris', () => {
    /*
     * Katalog `id` yang cuma menyalin `en` akan lolos test di atas.
     * Beberapa memang sengaja sama ("Status", "Modul" vs "Module"
     * berbeda, tapi "Status" tidak) — jadi yang dituntut mayoritas,
     * bukan seluruhnya.
     */
    const unique = [...new Set(keys.map(k => k.key))]

    const berbeda = unique.filter(
      key => resolve('id', key) !== resolve('en', key),
    )

    expect(berbeda.length / unique.length).toBeGreaterThan(0.6)
  })

  it('field milik grid Step tidak memungut label milik Definition', () => {
    // Jebakan nyata: `name` di grid Approval Step berarti "Step Name",
    // sedangkan `fields.name` milik Definition berarti "Name".
    expect(resolve('en', 'workflow.definitions.steps.fields.name')).toBe('Step Name')
    expect(resolve('en', 'workflow.definitions.fields.name')).toBe('Name')
    expect(resolve('id', 'workflow.definitions.steps.fields.name')).toBe('Nama Tahap')
    expect(resolve('id', 'workflow.definitions.fields.name')).toBe('Nama')
  })

  it('nama field TIDAK ikut diterjemahkan — hanya labelnya', () => {
    /*
     * Argumen pertama `column.*`/`field.*` adalah kunci payload dan
     * harus tetap literal. Kalau ia ikut terbungkus `resourceLabel`,
     * tabelnya membaca kolom yang tidak ada.
     */
    const src = readFileSync(join(MODULES, 'steps/columns.ts'), 'utf8')

    expect(src).toContain('column.text("approver_type_label", resourceLabel(')
    expect(src).not.toMatch(/column\.\w+\(resourceLabel\(/)

    // Bentuk kedua: `labelKey` tidak boleh menggeser argumen pertama.
    const form = readFileSync(join(MODULES, 'steps/form.ts'), 'utf8')

    expect(form).toContain('field.number("sequence", "Step"')
    expect(form).toContain('"labelKey": "workflow.steps.fields.sequence"')
  })
})
