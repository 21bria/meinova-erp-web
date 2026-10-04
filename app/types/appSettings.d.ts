import type { LocaleCode } from '~/i18n/config'

export interface AppSettings {
  sidebar?: {
    collapsible?: 'offcanvas' | 'icon' | 'none'
    side?: 'left' | 'right'
    variant?: 'sidebar' | 'floating' | 'inset'
  }
  theme?: {
    color?: ThemeColor
    type?: ThemeType
  }

  /*
   * Bahasa antarmuka. Kode pendek (`en`, `id`) — tag `Intl` diturunkan
   * darinya di `app/i18n/config.ts`, tidak disimpan di sini.
   *
   * Menumpang cookie `app_settings` yang sudah ada, bukan cookie
   * sendiri: preferensi tampilan pengguna sudah punya satu tempat, dan
   * dua tempat berarti dua kebijakan kedaluwarsa yang lambat laun
   * berbeda.
   *
   * **Bukan zona waktu.** Zona waktu tidak ikut berubah saat bahasa
   * diganti, dan sengaja tidak punya kolom di sini.
   */
  locale?: LocaleCode
}
