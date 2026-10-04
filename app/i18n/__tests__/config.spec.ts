import { describe, expect, it } from 'vitest'

import {
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  intlLocale,
  isLocaleCode,
  LOCALE_CODES,
  localeDescriptor,
  LOCALES,
  normalizeLocale,
} from '../config'

/*
| Yang diuji: kontrak pemilihan bahasa, bukan tampilannya.
|
| Tiap kelompok punya pasangan negatifnya. Test yang cuma membuktikan
| "id menghasilkan id" akan tetap hijau pada implementasi yang menerima
| apa pun — termasuk nilai rusak dari cookie yang bisa disunting orang.
*/

describe('daftar bahasa', () => {
  it('berisi en dan id', () => {
    expect(LOCALE_CODES).toContain('en')
    expect(LOCALE_CODES).toContain('id')
  })

  it('bawaannya en, supaya akun yang sudah ada tidak berubah', () => {
    expect(DEFAULT_LOCALE).toBe('en')
  })

  it('fallback-nya en, supaya kunci yang belum diterjemahkan punya isi', () => {
    expect(FALLBACK_LOCALE).toBe('en')
  })

  it('tiap bahasa punya tag Intl dan nama yang bisa dibaca', () => {
    for (const item of LOCALES) {
      expect(item.intl).toBeTruthy()
      expect(item.label).toBeTruthy()
    }
  })

  it('kodenya tidak ada yang kembar', () => {
    expect(new Set(LOCALE_CODES).size).toBe(LOCALE_CODES.length)
  })
})

describe('isLocaleCode', () => {
  it('menerima kode yang terdaftar', () => {
    expect(isLocaleCode('en')).toBe(true)
    expect(isLocaleCode('id')).toBe(true)
  })

  it('menolak yang lain — termasuk yang tampak masuk akal', () => {
    expect(isLocaleCode('fr')).toBe(false)
    expect(isLocaleCode('id-ID')).toBe(false)
    expect(isLocaleCode('EN')).toBe(false)
    expect(isLocaleCode('')).toBe(false)
    expect(isLocaleCode(null)).toBe(false)
    expect(isLocaleCode(undefined)).toBe(false)
    expect(isLocaleCode(42)).toBe(false)
  })
})

describe('normalizeLocale', () => {
  it('meneruskan kode yang sah', () => {
    expect(normalizeLocale('en')).toBe('en')
    expect(normalizeLocale('id')).toBe('id')
  })

  it('menerima bentuk BCP-47 yang datang dari navigator.language', () => {
    expect(normalizeLocale('id-ID')).toBe('id')
    expect(normalizeLocale('en-US')).toBe('en')
    expect(normalizeLocale('en_GB')).toBe('en')
    expect(normalizeLocale('ID-id')).toBe('id')
  })

  it('jatuh ke bawaan untuk yang kosong atau tidak dikenal', () => {
    expect(normalizeLocale(null)).toBe('en')
    expect(normalizeLocale(undefined)).toBe('en')
    expect(normalizeLocale('')).toBe('en')
    expect(normalizeLocale('fr')).toBe('en')
    expect(normalizeLocale('klingon')).toBe('en')
  })

  it('menghormati fallback yang diminta pemanggil', () => {
    // Dipakai `useLocale.applyLocale`: nilai rusak tidak boleh
    // melempar orangnya kembali ke Inggris, ia tetap di bahasanya.
    expect(normalizeLocale('fr', 'id')).toBe('id')
    expect(normalizeLocale(null, 'id')).toBe('id')
  })
})

describe('intlLocale', () => {
  it('memberi tag BCP-47, bukan kode pendeknya', () => {
    expect(intlLocale('id')).toBe('id-ID')
    expect(intlLocale('en')).toBe('en')
  })

  it('tidak pernah meneruskan nilai rusak ke Intl', () => {
    /*
     * `new Intl.NumberFormat("klingon")` melempar RangeError. Satu
     * nilai rusak di cookie tidak boleh menjatuhkan halamannya.
     */
    const tag = intlLocale('klingon')

    expect(() => new Intl.NumberFormat(tag)).not.toThrow()
    expect(tag).toBe('en')
  })

  it('tag tiap bahasa memang diterima Intl', () => {
    for (const item of LOCALES)
      expect(() => new Intl.DateTimeFormat(item.intl)).not.toThrow()
  })
})

describe('localeDescriptor', () => {
  it('mengembalikan entri bahasanya', () => {
    expect(localeDescriptor('id').label).toBe('Bahasa Indonesia')
  })

  it('jatuh ke bawaan alih-alih undefined', () => {
    // @ts-expect-error — sengaja: yang diuji perilakunya saat dilanggar
    expect(localeDescriptor('fr').code).toBe('en')
  })
})
