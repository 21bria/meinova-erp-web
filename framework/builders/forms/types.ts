export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "textarea"
  // Editor berformat, dirender `MRichEditor`. Komponennya sudah lama
  // ada dan `field.richtext()` sudah lama ada di builder Python, tapi
  // keduanya tidak pernah tersambung — schema ber-`richtext` jatuh ke
  // input teks satu baris, dan artikel lima paragraf harus diketik di
  // sana.
  | "richtext"
  | "number"
  // Backend mengirim tiga nama ini apa adanya dari builder Python
  // (`field.integer()`, `field.switch()`, `field.decimal()`), jadi
  // union-nya harus memuatnya — kalau tidak, komponen yang bercabang atas
  // `type` dianggap membandingkan nilai yang mustahil dan cabangnya
  // dilaporkan sebagai error walau justru cabang itulah yang terpakai.
  | "integer"
  | "decimal"
  // `field.currency()` juga ada di builder Python dan mengirim nama
  // ini apa adanya. Alasannya sama dengan tiga di atas: tanpa ia di
  // union, cabang `field.type === "currency"` di komponen tabel
  // dianggap perbandingan yang mustahil — enam module workspace,
  // masing-masing satu error, untuk cabang yang justru terpakai.
  | "currency"
  | "boolean"
  | "select"
  | "lookup"
  | "switch"
  | "checkbox"
  | "date"
  | "datetime"
  | "time"
  | "url"
  | "file"
  | "image"
  | "custom"
  // Daftar peringatan backend, hanya tampilan (MFieldWarnings).
  | "warnings"

export type FormFieldOption = {
  label: string
  value: any

  /* Opsi yang tampil tapi tidak bisa dipilih — mis. status yang hanya
   * ditulis sistem. Baris lama yang memakainya tetap terbaca.
   * `MSelectField` sudah merendernya (`SelectItem :disabled`). */
  disabled?: boolean

  /* Syarat tampil opsi, dialek yang sama dengan `visibleWhen` field —
   * dinilai `MFormBuilder` terhadap nilai form (mis. tujuan Transfer Aset
   * mengikuti fase asal). Generator meneruskannya apa adanya dari schema. */
  visible_when?: unknown
  visibleWhen?: unknown
}

export type FormField = {
  key: string
  type: FormFieldType

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

  rows?: number
  layout?: "normal" | "full"

  required?: boolean
  requiredOnCreate?: boolean

  disabled?: boolean
  readonly?: boolean
  hidden?: boolean

  options?: FormFieldOption[]
  multiple?: boolean
  endpoint?: string

  component?: any
  props?: Record<string, any>

  hint?: string
  error?: string

  visible?: boolean

  /**
   * Syarat tampil, dinilai terhadap nilai form yang sedang diisi.
   *
   * Bentuknya `{field, op, value}` digabung lewat `all` / `any` / `not`
   * — JSON kecil yang bisa divalidasi, bukan ekspresi bebas. Sengaja
   * bentuk yang sama dengan `WorkflowStep.condition` di backend supaya
   * satu aturan tidak perlu ditulis dua gaya.
   *
   * `op`: eq (bawaan), ne, in, not_in, is_true, is_false, is_null,
   * is_not_null.
   *
   * Syarat yang tidak bisa dinilai dianggap terpenuhi — field yang
   * hilang gara-gara salah ketik lebih sulit dilacak daripada field
   * yang telanjur tampil.
   */
  visibleWhen?: Record<string, any>

  /**
   * Layar tempat field ini boleh tampil (`create` / `edit`).
   *
   * Kosong berarti semua. Dipakai kolom yang diisi backend — nomor
   * dokumen dan status — supaya tidak muncul sebagai kotak kosong di
   * layar create.
   */
  /**
   * Syarat terkunci, bentuknya sama dengan `visibleWhen`.
   *
   * Untuk kolom yang nilainya diisi sistem sebagian waktu saja —
   * fieldnya tetap tampil, cuma tidak bisa diketik.
   */
  readonlyWhen?: Record<string, any>

  modes?: string[]

  /**
   * Nilai awal di layar **create**.
   *
   * Hanya diisikan kalau kuncinya belum ada di model — form edit
   * membaca nilainya dari API, dan menimpanya dengan default berarti
   * mengubah data yang tidak disentuh siapa pun.
   */
  default?: any

  // --------------------------------------------------
  // Widget
  // --------------------------------------------------

  widget?: string

  // --------------------------------------------------
  // Workspace
  // --------------------------------------------------

  tab?: string
  group?: string
  order?: number

  // --------------------------------------------------
  // Table / Filter
  // --------------------------------------------------

  table?: boolean
  filter?: boolean
  search?: boolean
  sortable?: boolean

// --------------------------------------------------
// Lookup
// --------------------------------------------------

  dependsOn?: string | string[]

  /**
   * Kunci di payload API yang memuat label siap tampil.
   *
   * Dipakai supaya field lookup tidak perlu menunggu daftar opsinya
   * dimuat hanya untuk tahu nama dari nilai yang sudah tersimpan.
   * Kosong = jatuh ke `<key>_label` lalu `<key>_name`.
   */
  displayKey?: string

  lookupParams?: Record<
    string,
    string | number | boolean | null
  >

  autofill?: Record<string, string>
  
  // --------------------------------------------------
  // File / Attachment
  // --------------------------------------------------

  accept?: string | string[]

  maxSizeMb?: number
  max_size_mb?: number

  category?: string
  public?: boolean

  preview?: boolean
  download?: boolean
  replace?: boolean
  delete?: boolean

  uploadEndpoint?: string
  upload_endpoint?: string

  uploadMode?: "separate" | "direct"
  upload_mode?: "separate" | "direct"

  valueMode?: "id" | "object"
  value_mode?: "id" | "object"

  detailField?: string
  detail_field?: string
}