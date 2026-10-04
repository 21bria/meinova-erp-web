import { afterEach, describe, expect, it } from 'vitest'

/*
| Stage 2B — angka mengikuti bahasa aktif.
|
| Yang dijaga: **tanda bacanya** yang berubah, bukan nilainya. Tiap
| assertion di sini berpasangan dengan satu yang membuktikan angka yang
| sama dibaca kembali utuh — karena kegagalan yang sebenarnya berbahaya
| di kolom uang bukan "titiknya salah", tapi "angkanya berubah".
*/

function fakeComposer(locale: 'en' | 'id') {
  return {
    locale: { value: locale },
    t: (key: string) => key,
    te: () => false,
  }
}

function withLocale(locale: 'en' | 'id') {
  ;(globalThis as any).useNuxtApp = () => ({ $i18n: fakeComposer(locale) })
}

afterEach(() => {
  delete (globalThis as any).useNuxtApp
})

async function load() {
  return import('@framework/core/utils/i18n')
}

describe('formatLocaleNumber', () => {
  it('en -> 1,234.56', async () => {
    withLocale('en')
    const { formatLocaleNumber } = await load()

    expect(formatLocaleNumber(1234.56)).toBe('1,234.56')
  })

  it('id -> 1.234,56', async () => {
    withLocale('id')
    const { formatLocaleNumber } = await load()

    expect(formatLocaleNumber(1234.56)).toBe('1.234,56')
  })

  it('bilangan besar memakai pemisah ribuan bahasanya', async () => {
    withLocale('en')
    let mod = await load()
    expect(mod.formatLocaleNumber(1234567)).toBe('1,234,567')

    withLocale('id')
    mod = await load()
    expect(mod.formatLocaleNumber(1234567)).toBe('1.234.567')
  })

  it('nilainya tidak dibulatkan oleh formatter', async () => {
    withLocale('id')
    const { formatLocaleNumber } = await load()

    // Tanpa opsi, `Intl` memakai maksimum 3 desimal; yang penting di
    // sini angkanya tidak dipangkas jadi bilangan bulat diam-diam.
    expect(formatLocaleNumber(1234.5, { maximumFractionDigits: 2 })).toBe('1.234,5')
    expect(formatLocaleNumber(0.25, { maximumFractionDigits: 2 })).toBe('0,25')
  })

  it('di luar konteks Nuxt tetap menghasilkan angka yang sah', async () => {
    const { formatLocaleNumber } = await load()

    expect(() => formatLocaleNumber(1234.5)).not.toThrow()
    expect(formatLocaleNumber(1234.5)).toBe('1,234.5')
  })
})

describe('localeSeparators + round-trip kolom uang', () => {
  /*
   * Meniru pasangan display/parse `MCurrencyField`.
   *
   * Sebelum tahap ini pasangannya rusak untuk `id`: tampilannya
   * `1.234.567`, dan parser lamanya (`replace(/[^\d.-]/g, "")`)
   * mengembalikan `Number("1.234.567")` = **NaN**.
   */
  function parseWith(sep: { group: string, decimal: string }, raw: string) {
    const normalized = raw
      .split(sep.group)
      .join('')
      .split(sep.decimal)
      .join('.')
      .replace(/[^\d.-]/g, '')

    if (!normalized || normalized === '-' || normalized === '.')
      return null

    const parsed = Number(normalized)

    return Number.isNaN(parsed) ? null : parsed
  }

  it('pemisah diturunkan dari Intl, bukan tabel tulis tangan', async () => {
    withLocale('en')
    let mod = await load()
    expect(mod.localeSeparators()).toEqual({ group: ',', decimal: '.' })

    withLocale('id')
    mod = await load()
    expect(mod.localeSeparators()).toEqual({ group: '.', decimal: ',' })
  })

  for (const locale of ['en', 'id'] as const) {
    it(`${locale}: angka yang ditampilkan bisa dibaca kembali utuh`, async () => {
      withLocale(locale)
      const { formatLocaleNumber, localeSeparators } = await load()

      const sep = localeSeparators()

      for (const value of [0, 1, 1234, 1234567, 1234.56, 999999999]) {
        const shown = formatLocaleNumber(value, { maximumFractionDigits: 2 })

        expect(parseWith(sep, shown), `${locale} ${value} -> ${shown}`)
          .toBe(value)
      }
    })
  }

  it('masukan kosong menjadi null, bukan NaN', async () => {
    withLocale('id')
    const { localeSeparators } = await load()

    const sep = localeSeparators()

    expect(parseWith(sep, '')).toBeNull()
    expect(parseWith(sep, '-')).toBeNull()
    expect(parseWith(sep, 'abc')).toBeNull()
  })
})
