import type { LocaleCode } from '~/i18n/config'
import {
  DEFAULT_LOCALE,
  intlLocale,
  LOCALES,
  normalizeLocale,
} from '~/i18n/config'

/*
|--------------------------------------------------------------------------
| Bahasa antarmuka
|--------------------------------------------------------------------------
|
| Satu-satunya jalan mengganti bahasa. Tiga tempat penyimpanannya
| disatukan di sini supaya tidak ada yang bergerak sendiri:
|
|   1. `vue-i18n`  — yang membuat layar berubah seketika
|   2. cookie `app_settings` — supaya pilihan bertahan sebelum login dan
|      terbaca server saat SSR
|   3. `User.language` di backend — supaya pilihan ikut orangnya, bukan
|      ikut browsernya
|
| Urutan kewenangan: **akun menang atas cookie.** Orang yang login di
| komputer rekannya harus mendapat bahasanya sendiri, bukan bahasa
| pemilik komputernya.
*/
export function useLocale() {
  /*
   * Composer diambil dari `nuxtApp`, bukan `useI18n()`.
   *
   * `useI18n()` menuntut ada component instance yang sedang setup —
   * benar untuk komponen, tapi composable ini juga dipanggil dari
   * plugin (`i18n.sync.client.ts`), dan di sana `useI18n()` melempar.
   * `$i18n` adalah composer global yang sama persis, dan ia dibuat
   * per-request jadi SSR tetap aman.
   */
  const i18n = useNuxtApp().$i18n

  const { updateAppSettings } = useAppSettings()

  const locale = computed<LocaleCode>(
    () => normalizeLocale(i18n.locale.value, DEFAULT_LOCALE),
  )

  const locales = LOCALES

  /** Tag BCP-47 untuk `Intl.*`. Bereaksi terhadap pergantian bahasa. */
  const intl = computed(() => intlLocale(locale.value))

  /**
   * Menerapkan bahasa ke UI + cookie, **tanpa** menyentuh backend.
   *
   * Dipakai jalur yang datang **dari** backend (sinkronisasi sesudah
   * login) — kalau jalur itu ikut menulis balik, satu pemuatan halaman
   * jadi satu PATCH yang tidak mengubah apa pun.
   */
  function applyLocale(value: string | null | undefined) {
    const next = normalizeLocale(value, locale.value)

    if (i18n.locale.value !== next)
      i18n.locale.value = next

    updateAppSettings({ locale: next })

    return next
  }

  /**
   * Pilihan pengguna: terapkan sekarang, simpan ke akun di belakang.
   *
   * Simpan-ke-akun sengaja **tidak** ditunggu dan kegagalannya tidak
   * membatalkan perubahan di layar. Bahasa antarmuka bukan data bisnis;
   * jaringan yang putus tidak boleh membuat tombol bahasa terasa rusak.
   * Yang hilang kalau gagal cuma keawetannya lintas perangkat — cookie
   * tetap memegangnya di browser ini.
   */
  async function setLocale(value: LocaleCode) {
    const next = applyLocale(value)

    const auth = useAuthStore()

    if (!auth.isAuthed)
      return next

    try {
      const { request } = useApi()

      const updated = await request<{ language?: string }>(
        '/api/accounts/auth/me/',
        { method: 'PATCH', body: { language: next } },
      )

      // Respons `/me/` berbentuk profil lengkap; disimpan supaya
      // `auth.user.language` tidak tertinggal di nilai lama dan
      // sinkronisasi berikutnya tidak menariknya balik.
      if (updated && typeof updated === 'object') {
        auth.user = { ...(auth.user ?? {}), ...updated }
        auth.saveToStorage()
      }
    }
    catch {
      // Sengaja diam — lihat komentar di atas.
    }

    return next
  }

  /**
   * Menarik bahasa dari akun yang sedang login.
   *
   * Akun lama (dan akun sistem) bisa saja belum punya nilainya; dalam
   * hal itu cookie yang berlaku dan tidak ada yang ditimpa.
   */
  function syncFromAccount() {
    const auth = useAuthStore()

    const fromAccount = auth.user?.language

    if (!fromAccount)
      return locale.value

    return applyLocale(fromAccount)
  }

  return {
    locale,
    locales,
    intl,
    setLocale,
    applyLocale,
    syncFromAccount,
  }
}
