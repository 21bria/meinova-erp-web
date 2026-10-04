export interface MasterHubCategory {
  key: string
  label: string
  order?: number
  icon?: string
}

export interface MasterHubItem {
  key: string
  title: string
  description?: string
  icon: string
  link: string
  category: string

  order?: number
  badge?: string | number
  permission?: string

  disabled?: boolean
  external?: boolean
  keywords?: string[]
}

export interface MasterHubProps {
  title: string
  description?: string

  items: MasterHubItem[]
  categories?: MasterHubCategory[]

  searchPlaceholder?: string
  allCategoryLabel?: string

  /*
   * Sebutan isi hub di baris hitungan kaki ("Showing 5 …").
   *
   * Ada karena komponen ini bukan lagi khusus master: hub seksi
   * (Attendance & Leave, Roster & Travel, Visitor) memuat **layar**,
   * dan "Showing 5 master modules" di sana salah menyebut isinya.
   * Bawaannya tetap master, jadi seluruh hub yang sudah ada tidak
   * berubah satu kata pun.
   */
  itemNoun?: string
  itemNounPlural?: string

  emptyTitle?: string
  emptyDescription?: string

  initialCategory?: string
}