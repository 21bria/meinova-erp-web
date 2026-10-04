export type FilterPlacement =
  | "quick"
  | "advanced"

export type FilterType =
  | "text"
  | "select"
  | "lookup"
  | "date"
  | "dateRange"
  | "number"
  | "numberRange"
  | "switch"
  | "boolean"
  | "custom"

export interface FilterOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export interface CrudFilter {
  key: string
  type: FilterType

  label?: string

  /*
   * Kunci terjemahan untuk `label`, mis. `workflow.steps.fields.name`.
   *
   * **Opsional dan berdampingan dengan `label`**, bukan menggantikannya.
   * `label` tetap teks Inggris dari schema backend dan dipakai sebagai
   * fallback, jadi konfigurasi tanpa kunci ini berperilaku persis
   * seperti sebelum i18n ada.
   *
   * Diresolusi **saat render** oleh komponen, bukan saat objek ini
   * dirakit: `createForm`/`createFilters` adalah `const` tingkat module
   * yang dihitung sekali saat chunk dimuat, dan pada saat itu instance
   * i18n belum tentu terpasang.
   */
  labelKey?: string
  placeholder?: string

  endpoint?: string
  multiple?: boolean
  options?: FilterOption[]

  component?: any
  props?: Record<string, any>

  defaultValue?: any
  visible?: boolean
  width?: string

  placement?: FilterPlacement

  /*
   * Cascading lookup.
   *
   * `null` ikut diterima karena itu yang **benar-benar dihasilkan**
   * generator untuk field tanpa induk (`"dependsOn": null`), dan
   * memaksa pemanggilnya menghilangkan kuncinya berarti keluaran
   * generator sendiri tidak lolos tipenya.
   */
  dependsOn?: string | string[] | null

  lookupParams?: Record<
    string,
    string | number | boolean | null
  > | null

  /*
   * Penyaring rentang tanggal (`type: "dateRange"`).
   *
   * Satu penyaring, **dua** query param — `date_from` dan `date_to` —
   * jadi kuncinya tidak bisa diturunkan dari `key` seperti penyaring
   * lain. Namanya datang dari schema backend (`filter.params`) dan
   * bukan ditebak di sini: yang membacanya `apps.framework.list_period`,
   * dan dua sisi yang mengeja parameter yang sama sendiri-sendiri cepat
   * atau lambat berbeda — dan bedanya muncul sebagai daftar yang diam-
   * diam mengabaikan periode pilihan orang.
   */
  fromKey?: string
  toKey?: string

  /*
   * Rentang bawaan saat layar dibuka, sebagai **kode** (`current_month`)
   * dan bukan sepasang tanggal.
   *
   * Tanggalnya dihitung saat dipakai, bukan saat modul dimuat:
   * `createFilters({...})` adalah `const` tingkat module yang dihitung
   * sekali saat chunk-nya masuk, jadi "hari ini" yang ditulis di sana
   * akan basi pada sesi yang menyeberang tengah malam — dan basinya
   * diam, karena daftarnya tetap terisi, cuma periodenya yang tertinggal
   * satu hari.
   */
  defaultRange?: string | null

  /*
   * Batas panjang rentang, mengikuti kebijakan backend. Dipakai untuk
   * menahan pilihan **sebelum** dikirim; yang menolak tetap API, karena
   * frontend tidak pernah jadi batas.
   */
  maxDays?: number | null

  /* Preset cepat: `today`, `last_7_days`, `this_month`, `last_month`. */
  presets?: string[] | null

  /*
   * Penyaring yang tidak boleh dikosongkan. Untuk rentang tanggal
   * artinya tombol Reset mengembalikannya ke bawaan, bukan ke kosong —
   * daftar transaksional tanpa periode berarti seluruh sejarah, dan itu
   * justru keadaan yang dihindari layar ini.
   */
  required?: boolean
}

export interface CrudFilters {
  search?: {
    enabled?: boolean
    placeholder?: string

    /*
     * Kunci terjemahan untuk `placeholder`, dipancarkan generator.
     * Berdampingan dengan `placeholder`, yang tetap teks Inggris dan
     * jadi fallback-nya.
     */
    placeholderKey?: string
  }

  advanced?: boolean

  items: CrudFilter[]
}