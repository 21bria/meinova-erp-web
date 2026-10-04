import { describe, expect, it } from 'vitest'

import { DEFAULT_LOCALE, FALLBACK_LOCALE, LOCALE_CODES } from '../config'
import { messages } from '../messages'

/*
| Bentuk katalog, bukan isinya.
|
| Tidak ada satu pun test di sini yang menuntut sebuah kunci berbunyi
| "Simpan" — kata-katanya milik penerjemah dan akan berubah. Yang
| dijaga: setiap kunci punya isi di bahasa fallback, tidak ada kunci
| yatim, dan kode stabil tetap kode stabil.
*/

function flatten(obj: any, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}

  for (const [key, value] of Object.entries(obj ?? {})) {
    const path = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === 'object')
      Object.assign(out, flatten(value, path))
    else
      out[path] = String(value)
  }

  return out
}

const flat = new Map<string, Record<string, string>>(
  LOCALE_CODES.map(code => [code, flatten(messages[code])]),
)

/*
| Pengakses yang melempar kalau katalognya tidak ada.
|
| Bukan kerapian TypeScript: `flat[code]` yang mungkin `undefined`
| membuat tiap assertion di bawah diam-diam berjalan atas `undefined`,
| dan `Object.keys(undefined ?? {})` yang kosong lolos sebagai "tidak
| ada kunci yatim". Test yang hijau karena datanya hilang lebih buruk
| daripada test yang merah.
*/
function catalog(code: string): Record<string, string> {
  const found = flat.get(code)

  if (!found)
    throw new Error(`katalog "${code}" tidak ada`)

  return found
}

describe('katalog pesan', () => {
  it('ada satu katalog per bahasa yang terdaftar', () => {
    for (const code of LOCALE_CODES)
      expect(messages[code], `katalog ${code} hilang`).toBeTruthy()
  })

  it('bahasa fallback punya isi', () => {
    expect(Object.keys(catalog(FALLBACK_LOCALE)).length).toBeGreaterThan(50)
  })

  it('tidak ada kunci yatim — semua punya padanan di bahasa fallback', () => {
    /*
     * Kunci yang HANYA ada di `id` tidak punya fallback: pengguna
     * berbahasa Inggris akan melihat kuncinya mentah di layar. Itu
     * kegagalan yang paling sunyi dari seluruh berkas ini.
     */
    for (const code of LOCALE_CODES) {
      if (code === FALLBACK_LOCALE)
        continue

      const yatim = Object.keys(catalog(code))
        .filter(key => !(key in catalog(FALLBACK_LOCALE)))

      expect(yatim, `kunci tanpa fallback di "${code}"`).toEqual([])
    }
  })

  it('tidak ada nilai kosong', () => {
    for (const code of LOCALE_CODES) {
      const kosong = Object.entries(catalog(code))
        .filter(([, value]) => !value.trim())
        .map(([key]) => key)

      expect(kosong, `nilai kosong di "${code}"`).toEqual([])
    }
  })

  it('bahasa non-fallback tidak boleh sekadar menyalin bahasa Inggris', () => {
    /*
     * Bukan menuntut 100% terjemahan — sebagian istilah memang
     * dipertahankan ("Roster", "BPJS", "Shift"). Yang dijaga: katalog
     * `id` bukan salinan `en` yang namanya saja diganti.
     */
    for (const code of LOCALE_CODES) {
      if (code === FALLBACK_LOCALE)
        continue

      const shared = Object.keys(catalog(code))
        .filter(key => key in catalog(FALLBACK_LOCALE))

      const berbeda = shared
        .filter(key => catalog(code)[key] !== catalog(FALLBACK_LOCALE)[key])

      expect(berbeda.length / shared.length).toBeGreaterThan(0.6)
    }
  })
})

describe('kunci milik framework yang dipakai kode', () => {
  /*
   * Kunci-kunci ini dirujuk langsung oleh komponen framework dan
   * `column.ts`. Kalau salah satunya hilang atau berpindah, layarnya
   * tetap benar (ada fallback teks Inggris) — tapi terjemahannya diam-
   * diam mati. Daftar ini yang membuat itu jadi test merah.
   */
  const wajib = [
    'common.actions.save',
    'common.actions.saving',
    'common.actions.cancel',
    'common.actions.edit',
    'common.actions.delete',
    'common.actions.create',
    'common.actions.import',
    'common.actions.export',
    'common.actions.reset',
    'common.actions.refresh',
    'common.actions.actions',
    'common.actions.confirm',
    'common.actions.advancedFilter',
    'common.actions.deleteSelected',
    'common.actions.downloadTemplate',
    'common.labels.status',
    'common.labels.language',
    'common.state.loading',
    'common.state.noData',
    'common.status.active',
    'common.status.inactive',
    'common.status.approved',
    'common.status.rejected',
    'common.status.pending',
    'common.status.draft',
    'common.status.posted',

    /*
     * Application Launcher beranda. Ketiganya dirujuk langsung
     * `ApplicationLauncherItem.vue`, dan dua di antaranya adalah
     * satu-satunya keterangan kenapa sebuah ubin mati — kalau kuncinya
     * hilang, ubin kelabu itu berhenti bisa dijelaskan sama sekali.
     */
    'home.launcher.title',
    'home.launcher.noAccess',
    'home.launcher.unavailable',
    'home.appStatus.coming_soon',
  ]

  for (const key of wajib) {
    it(`"${key}" ada di semua bahasa`, () => {
      for (const code of LOCALE_CODES)
        expect(catalog(code)[key], `${key} hilang di ${code}`).toBeTruthy()
    })
  }
})

describe('kode stabil tetap kode stabil', () => {
  /*
   * Kunci status ditulis huruf kecil dari kode API (`APPROVED` ->
   * `approved`). Itu kontrak `statusLabel()`. Kunci berhuruf besar di
   * sini berarti pencariannya meleset dan seluruh status jatuh ke
   * label bahasa Inggris tanpa ada yang tahu.
   */
  it('kunci status semuanya huruf kecil', () => {
    for (const code of LOCALE_CODES) {
      const statuses = Object.keys(catalog(code))
        .filter(key => key.startsWith('common.status.'))
        .map(key => key.replace('common.status.', ''))

      expect(statuses.length).toBeGreaterThan(0)

      for (const s of statuses)
        expect(s, `${s} harus huruf kecil`).toBe(s.toLowerCase())
    }
  })

  it('terjemahan status TIDAK dipakai sebagai nilai — hanya sebagai label', () => {
    /*
     * Penjagaan atas aturan yang paling mudah dilanggar tanpa sadar:
     * label boleh berbunyi apa saja, tapi kuncinya harus tetap kode
     * Inggris yang dikirim API. Kalau suatu saat ada yang menamai
     * kuncinya `common.status.disetujui`, `statusLabel("APPROVED")`
     * berhenti menemukan apa pun.
     */
    expect(catalog(DEFAULT_LOCALE)['common.status.approved']).toBeTruthy()
    expect(catalog('id')['common.status.approved']).toBe('Disetujui')
    expect(catalog('id')['common.status.disetujui']).toBeUndefined()
  })
})
