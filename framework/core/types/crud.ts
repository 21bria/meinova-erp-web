import type { CrudFilters } from "../../builders/filters/types"

export type CrudMode = "create" | "edit"

export type CrudConfig = {
  id?: string
  endpoint: string
  defaultQuery?: Record<string, unknown>
  name?: string
  ui?: Partial<CrudUI>

  /*
   * Skema penyaring milik modul ini.
   *
   * Dioper ke `useCrud` **hanya** supaya permintaan pertama sudah
   * membawa nilai bawaan penyaringnya — terutama rentang tanggal pada
   * daftar transaksional. Tanpa ini, permintaan pertama berangkat
   * tanpa periode dan backend memakai bawaannya sendiri: hasilnya
   * kebetulan benar, tapi layar dan API menurunkan periode yang sama
   * dari dua tempat yang tidak saling mengenal, dan begitu salah
   * satunya berubah yang lain tidak ikut.
   *
   * Opsional: modul yang tidak mengopernya berperilaku persis seperti
   * sebelumnya.
   */
  filters?: CrudFilters
}

export type CrudUI = {
  create: boolean
  edit: boolean
  delete: boolean
  bulk_delete: boolean
  import: boolean
  export: boolean
}

export type ApiListMeta = {
  count: number
  total_pages: number
  page: number
  page_size: number
  next: string | null
  previous: string | null
}

export type ApiList<T> = {
  success: boolean
  message: string
  status_code: number
  data: T[]
  meta: ApiListMeta
}

export type CrudSort = {
  key: string | null
  dir: "asc" | "desc" | null
}

export type CrudNotify = {
  success: (message: string) => void
  error: (message: string) => void
  info?: (message: string) => void
}
/*
|--------------------------------------------------------------------------
| Collection action
|--------------------------------------------------------------------------
|
| Tombol yang berlaku untuk BANYAK baris sekaligus (Post All), menembak
| endpoint `@action(detail=False)` milik viewset. Bedanya dengan
| `RecordAction` bukan sekadar jumlah barisnya — tempat tombolnya yang
| berbeda: yang ini di toolbar tabel, satu-satunya tempat yang tahu
| penyaring yang sedang aktif dan baris mana yang dicentang.
|
| `selection` menghubungkan keduanya:
|
|   optional  ada yang dicentang -> kirim id-nya; tidak ada -> kirim
|             tanpa id, dan BACKEND yang menentukan cakupannya lewat
|             `filter_queryset` (penyaring toolbar + cakupan data ikut)
|   required  harus ada yang dicentang; tombolnya mati kalau tidak
|   none      tidak pernah mengirim id
|
| Dideklarasikan `action.collection()` di sisi backend.
*/
export type CollectionActionSelection = "optional" | "required" | "none"

export type CollectionAction = {
  key: string
  label: string

  icon?: string | null
  variant?: string | null
  endpoint: string
  method?: string | null
  selection?: CollectionActionSelection | string | null
  idsField?: string | null
  payload?: Record<string, any> | null
  confirm?: boolean | { title?: string, description?: string } | null
  permission?: string | null
}
