export interface NavHubItem {
  link: string
  permission?: string
}

export interface NavLink {
  title: string

  /*
   * Kunci terjemahan judul, mis. `navigation.items.employees`.
   *
   * **Opsional dan berdampingan dengan `title`**, bukan menggantikannya.
   * `title` tetap teks Inggris yang dipakai sebagai fallback, sebagai
   * tooltip, dan sebagai kunci `v-for` — jadi item yang belum
   * diterjemahkan berperilaku persis seperti sebelum i18n ada.
   */
  titleKey?: string
  icon?: string
  link?: string
  permission?: string
  external?: boolean
  new?: boolean
  badge?: string | number

  /*
   * Layar yang dimuat item ini kalau ia sebuah hub/workspace.
   *
   * Rute hub sendiri (`/payroll/bpjs`) belum tentu terdaftar di tabel
   * `Menu` backend, dan rute yang tidak dikenal dianggap **boleh**
   * (lihat `useMenuAccess`). Tanpa daftar ini, mengubah tujuh item BPJS
   * jadi satu item hub berarti role yang seluruh menu BPJS-nya dicabut
   * justru mendapat item baru yang membuka hub kosong — hak aksesnya
   * tidak bocor, tapi menunya berbohong.
   *
   * Diisi dari registry hub-nya, bukan ditulis ulang, supaya keduanya
   * tidak bisa berbeda.
   */
  hubItems?: NavHubItem[]
}

export interface NavSectionTitle {
  heading: string
  headingKey?: string
}

export interface NavGroup {
  title: string
  titleKey?: string
  icon?: string
  children: NavLink[]
  permission?: string
  badge?: string | number
}

export interface NavMenu {
  heading: string
  headingKey?: string
  items: NavMenuItems
}

export declare type NavMenuItems = (NavLink | NavGroup | NavSectionTitle)[]
