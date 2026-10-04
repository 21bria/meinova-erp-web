import { registerFrameworkI18n } from '@framework'

import { createI18n } from 'vue-i18n'

import {
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  normalizeLocale,
} from '~/i18n/config'
import { messages } from '~/i18n/messages'

/*
|--------------------------------------------------------------------------
| vue-i18n
|--------------------------------------------------------------------------
|
| Dipasang sebagai plugin Nuxt biasa, **bukan** lewat `@nuxtjs/i18n`.
|
| Alasannya satu: module itu ikut mengurus routing — strategi bawaannya
| menyisipkan prefiks bahasa ke setiap rute (`/id/hr/employees`). Aplikasi
| ini punya ratusan rute yang sudah dirujuk menu, `RoleMenuPermission`,
| dan tabel `Menu` di backend; menggesernya berarti menyentuh kontrak yang
| tidak ada hubungannya dengan bahasa. Yang dibutuhkan di sini cuma katalog
| pesan + pemilih per pengguna, dan `vue-i18n` sendiri memberikan itu tanpa
| menyentuh satu pun rute.
|
| Instance-nya dibuat **per request**: dibuat di dalam fungsi plugin, jadi
| di SSR dua pengguna dengan bahasa berbeda tidak saling menimpa.
*/
export default defineNuxtPlugin((nuxtApp) => {
  /*
   * Bahasa awal dibaca dari cookie preferensi yang sudah ada
   * (`app_settings`), bukan cookie baru. Cookie terbaca di server juga,
   * jadi halaman yang dirender SSR sudah keluar dalam bahasa yang benar
   * — tidak ada kedipan Inggris→Indonesia saat hydration.
   *
   * Preferensi milik akun (kolom `User.language`) baru datang sesudah
   * `/auth/me/`, dan itu ditangani `useLocale()` — bukan di sini.
   */
  const settings = useCookie<{ locale?: string } | null>('app_settings')

  const initial = normalizeLocale(settings.value?.locale, DEFAULT_LOCALE)

  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: initial,
    fallbackLocale: FALLBACK_LOCALE,
    messages,

    /*
     * Kunci yang hilang jatuh ke `en` tanpa berisik di produksi. Di dev
     * peringatannya dibiarkan hidup — itu satu-satunya cara kunci yang
     * salah ketik ketahuan sebelum sampai ke layar orang.
     */
    missingWarn: import.meta.dev,
    fallbackWarn: import.meta.dev,

    /*
     * Format tanggal & angka per bahasa, memakai tag BCP-47 dari
     * `config.ts`. Nilai yang tersimpan tidak disentuh — ini murni
     * lapisan tampilan.
     */
    datetimeFormats: {
      en: {
        short: { day: '2-digit', month: 'short', year: 'numeric' },
        long: {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        },
      },
      id: {
        short: { day: '2-digit', month: 'short', year: 'numeric' },
        long: {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        },
      },
    },

    numberFormats: {
      en: {
        decimal: { style: 'decimal', maximumFractionDigits: 2 },
        currency: { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 },
      },
      id: {
        decimal: { style: 'decimal', maximumFractionDigits: 2 },
        currency: { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 },
      },
    },
  })

  nuxtApp.vueApp.use(i18n)

  /*
   * Kode framework yang tidak punya template (definisi kolom, label
   * hasil generator) membaca composer lewat `framework/core/utils/i18n`.
   * Pendaftarannya hanya berlaku di klien — lihat komentar di sana soal
   * kenapa variabel modul tidak boleh dipakai di server.
   */
  registerFrameworkI18n(i18n.global)

  /*
   * Atribut `lang` pada <html> diurus `app.vue`, bukan di sini: berkas
   * itu sudah memanggil `useHead({ htmlAttrs: { lang } })` dan panggilan
   * yang belakangan menang. Dua tempat yang menulis atribut yang sama
   * berarti yang satu diam-diam tidak berpengaruh.
   */

  return {
    provide: {
      i18n: i18n.global,
    },
  }
})
