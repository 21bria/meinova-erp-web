import { describe, expect, it } from 'vitest'

import { moduleMenus } from '~/constants/menus'
import en from '~/i18n/locales/en'
import id from '~/i18n/locales/id'

/*
| Cutover navigasi Stage 6, diuji sebagai data.
|
| Registry menu adalah konstanta biasa, jadi ia bisa diperiksa tanpa
| Nuxt maupun DOM — dan justru di situlah kesalahannya paling mungkin
| tinggal: satu entri yang lupa dicabut tidak menghasilkan error, cuma
| dua pintu ke hal yang sama.
*/

function links(items: any[]): string[] {
  return items.flatMap((item: any) => [
    ...(item.link ? [item.link] : []),
    ...(item.children ? links(item.children) : []),
  ])
}

function allLinks(module: string): string[] {
  return (moduleMenus[module] ?? []).flatMap((group: any) => links(group.items ?? []))
}

/**
 * Rute yang dijangkau modul ini, termasuk lewat kartu hub.
 *
 * Sidebar HR hanya menampilkan **baris hub** sejak layar seksinya jadi
 * kartu (`/hr/attendance-leave` memuat Attendance, Leave, Izin). Menguji
 * `link` saja karena itu akan menyimpulkan Attendance sudah hilang dari
 * HR padahal ia cuma satu tingkat lebih dalam.
 */
function reachable(module: string): string[] {
  return (moduleMenus[module] ?? []).flatMap((group: any) =>
    (group.items ?? []).flatMap((item: any) => [
      ...(item.link ? [item.link] : []),
      ...((item.hubItems ?? []).map((child: any) => child.link)),
    ]),
  )
}

describe('sidebar HR sesudah cutover', () => {
  it('my Profile tidak lagi di menu HR', () => {
    expect(allLinks('hr')).not.toContain('/hr/my-profile')
  })

  it('tidak ada satu pun rute /me di sidebar modul HR', () => {
    // Self Service dijangkau lewat launcher dan menu avatar, bukan
    // lewat sidebar HR — kalau ia muncul di sini, cutover-nya cuma
    // memindahkan kebingungan.
    expect(allLinks('hr').filter(l => l.startsWith('/me'))).toEqual([])
  })

  it('employees tetap ada — permukaan administratif HR tidak dicabut', () => {
    expect(allLinks('hr')).toContain('/hr/employees')
  })

  it('domain bisnis HR tetap di HR', () => {
    /*
     * Diuji lewat **baris hub**-nya, bukan lewat rute layarnya.
     *
     * Sejak Attendance, Leave, Izin, Roster, dan Overtime jadi kartu di
     * dalam halaman hub, sidebar HR hanya memuat pintu hub-nya —
     * `/hr/attendance-leave`, `/hr/roster-travel`, `/hr/visitor`. Rute
     * layarnya hidup di `~/registry/section-hub/*`, bukan di registry
     * menu ini. Menuntut `/hr/attendance` muncul di sini akan merah
     * selamanya tanpa ada yang salah.
     */
    const hr = reachable('hr')

    for (const route of [
      '/hr/attendance-leave',
      '/hr/roster-travel',
      '/hr/visitor',
    ]) {
      expect(hr, `${route} hilang dari HR`).toContain(route)
    }
  })
})

describe('label navigasi', () => {
  it('my Workspace punya terjemahan EN dan ID', () => {
    expect(en.navigation.items.myWorkspace).toBeTruthy()
    expect(id.navigation.items.myWorkspace).toBeTruthy()
    expect(en.navigation.items.myWorkspace).not.toBe(id.navigation.items.myWorkspace)
  })

  it('my Profile dibedakan dari Pengaturan', () => {
    /*
     * Dulu yang dijaga di sini "Akun" vs "My Profile" — dua item yang
     * memang berdampingan di dropdown. Item "Akun" sudah dicabut: ia
     * membuka halaman yang sama persis dengan "Pengaturan"
     * (`nuxt.config.ts` mengalihkan `/settings` ke `/settings/profile`).
     * Yang tersisa berdampingan sekarang Profil Saya dan Pengaturan, dan
     * keduanya yang tidak boleh berbunyi sama.
     *
     * Susunan dropdown-nya sendiri dijaga
     * `app/components/layout/__tests__/user-menu.spec.ts`.
     */
    expect(en.common.labels.settings).toBeTruthy()
    expect(en.common.labels.settings).not.toBe(en.navigation.items.myProfile)
    expect(id.common.labels.settings).not.toBe(id.navigation.items.myProfile)
  })
})
