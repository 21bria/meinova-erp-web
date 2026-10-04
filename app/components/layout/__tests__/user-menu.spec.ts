import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import en from '~/i18n/locales/en'
import id from '~/i18n/locales/id'

/*
| Dropdown user, diuji sebagai **sumber**.
|
| Repo ini menjalankan vitest di lingkungan `node` tanpa DOM, jadi SFC-nya
| tidak bisa dirender di sini. Yang tetap bisa dijaga — dan justru ini
| yang paling mungkin kembali diam-diam — adalah isinya: item bawaan
| template yang sudah dicabut tidak boleh muncul lagi lewat satu salin-
| tempel, dan satu pintu ke Pengaturan tidak boleh diam-diam jadi dua.
|
| Perilakunya (menu benar-benar terbuka, tautan benar-benar berpindah,
| logout benar-benar membersihkan sesi) diuji UAT browser —
| `scripts/uat/self-service.mjs`.
*/

const SOURCE = readFileSync(
  fileURLToPath(new URL('../SidebarNavFooter.vue', import.meta.url)),
  'utf8',
)

/** Hanya bagian `<template>`; komentar penjelas di atasnya ikut terbaca. */
const TEMPLATE = SOURCE.slice(SOURCE.indexOf('<template>'))

/** `to="..."` pada tiap item menu, urut seperti di layar. */
const TARGETS: string[] = [...TEMPLATE.matchAll(/to="([^"]+)"/g)]
  .map(match => match[1])
  .filter((target): target is string => Boolean(target))

describe('item bawaan template sudah dicabut', () => {
  it('tidak ada "Upgrade to Pro"', () => {
    /*
     * Item ini datang dari starter `nuxt-shadcn-dashboard`: tanpa rute,
     * tanpa handler, dan berbahasa Inggris keras di menu yang seluruhnya
     * diterjemahkan. Meinova ERP tidak punya konsep langganan, jadi tidak
     * ada halaman yang bisa dituju sekalipun seseorang menekannya.
     */
    expect(SOURCE).not.toContain('Upgrade to Pro')
    expect(SOURCE).not.toContain('i-lucide-sparkles')
  })

  it('tidak ada tautan repository developer', () => {
    // Menu akun pegawai bukan tempat menautkan repo. Repo-nya sendiri
    // tidak disentuh — yang dicabut cuma navigasinya dari layar produksi.
    expect(SOURCE).not.toContain('github.com')
    expect(SOURCE).not.toContain('i-lucide-github')
  })

  it('tidak ada item notifikasi yang tidak menuju ke mana pun', () => {
    /*
     * Item lamanya tidak punya `to` maupun handler — menekannya cuma
     * menutup menu. Notifikasi yang **nyata** sudah punya rumahnya
     * sendiri di header (`LayoutNotificationBell`, lengkap dengan
     * penghitung belum terbaca dan tandai-terbaca), jadi yang dicabut di
     * sini bukan kemampuannya, cuma pintu mati di sebelahnya.
     */
    expect(TEMPLATE).not.toContain('i-lucide-bell')
    expect(TEMPLATE).not.toContain('common.labels.notifications')
  })
})

describe('tujuan yang dipertahankan', () => {
  it('dua tujuan personal pegawai ada dan paling atas', () => {
    expect(TARGETS.slice(0, 2)).toEqual(['/me', '/me/profile'])
  })

  it('satu pintu ke Pengaturan, bukan dua', () => {
    /*
     * `nuxt.config.ts` mengalihkan `/settings` ke `/settings/profile`,
     * jadi "Akun" dan "Pengaturan" yang lama membuka halaman yang **sama
     * persis**. Test ini yang membuat penambahan kembarannya jadi merah.
     */
    const settings = TARGETS.filter(target => target.startsWith('/settings'))

    expect(settings).toEqual(['/settings'])
  })

  it('tidak ada tujuan yang muncul dua kali', () => {
    expect(TARGETS).toEqual([...new Set(TARGETS)])
  })

  it('setiap tujuan adalah rute internal', () => {
    for (const target of TARGETS)
      expect(target, target).toMatch(/^\//)
  })
})

describe('urutan kelompok', () => {
  it('bahasa dan tema berdampingan sebagai preferensi', () => {
    const language = TEMPLATE.indexOf('LayoutLanguageSwitcher')
    const theme = TEMPLATE.indexOf('showModalTheme = true')

    expect(language).toBeGreaterThan(-1)
    expect(theme).toBeGreaterThan(language)
  })

  it('keluar adalah item terakhir', () => {
    const logout = TEMPLATE.indexOf('handleLogout')
    const theme = TEMPLATE.indexOf('showModalTheme = true')

    expect(logout).toBeGreaterThan(theme)

    // Dan dipisah garis dari kelompok preferensi di atasnya.
    const before = TEMPLATE.slice(0, logout)

    expect(before.lastIndexOf('<DropdownMenuSeparator />'))
      .toBeGreaterThan(theme)
  })
})

describe('label yang dipakai menu ini', () => {
  const KEYS = [
    ['navigation.items.myWorkspace', (c: any) => c.navigation.items.myWorkspace],
    ['navigation.items.myProfile', (c: any) => c.navigation.items.myProfile],
    ['common.labels.settings', (c: any) => c.common.labels.settings],
    ['common.labels.theme', (c: any) => c.common.labels.theme],
    ['common.labels.logout', (c: any) => c.common.labels.logout],
  ] as const

  for (const [name, read] of KEYS) {
    it(`"${name}" ada di kedua bahasa`, () => {
      expect(read(en), `${name} hilang di en`).toBeTruthy()
      expect(read(id), `${name} hilang di id`).toBeTruthy()
    })
  }

  it('ruang Kerja Saya dan Profil Saya tidak berbunyi sama', () => {
    // Dua item bernama sama persis di satu menu membuat orang menekan
    // yang salah lalu menyimpulkan salah satunya rusak.
    expect(en.navigation.items.myWorkspace).not.toBe(en.navigation.items.myProfile)
    expect(id.navigation.items.myWorkspace).not.toBe(id.navigation.items.myProfile)
  })
})
