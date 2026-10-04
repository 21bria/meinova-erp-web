import type { AppSettings } from '~/types/appSettings'

import { createDefu } from 'defu'

import { DEFAULT_LOCALE } from '~/i18n/config'

const customDefu = createDefu((obj, key, value) => {
  if (Array.isArray(value) && value.every((x: any) => typeof x === 'string')) {
    obj[key] = value
    return true
  }
})

const defaultAppSettings: AppSettings = {
  sidebar: {
    collapsible: 'offcanvas',
    side: 'left',
    variant: 'sidebar',
  },
  theme: {
    color: 'default',
    type: 'default',
  },
  // Bahasa antarmuka. Menumpang cookie preferensi yang sudah ada
  // alih-alih cookie sendiri — lihat `types/appSettings.d.ts`.
  locale: DEFAULT_LOCALE,
}

export function useAppSettings() {
  const { appSettings } = useAppConfig()

  const processedConfig = customDefu(appSettings, defaultAppSettings)

  const cookieAppSettings = useCookie<AppSettings>('app_settings', {
    default: () => processedConfig,
  })

  const updateAppSettings = (settings: AppSettings) => {
    cookieAppSettings.value = customDefu(settings, cookieAppSettings.value)
  }

  return {
    updateAppSettings,
    sidebar: computed(() => cookieAppSettings.value.sidebar),
    theme: computed(() => cookieAppSettings.value.theme),
    // Nilai mentah dari cookie. Untuk mengganti bahasa pakai
    // `useLocale()` — di sana UI, cookie, dan akun diperbarui bersama;
    // menulis ke sini saja hanya menggeser cookie-nya.
    locale: computed(() => cookieAppSettings.value.locale),
  }
}
