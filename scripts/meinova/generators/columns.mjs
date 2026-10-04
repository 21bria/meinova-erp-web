import { labelExpr } from "./i18n.mjs"

function opt(value) {
  return JSON.stringify(value)
}

/*
 * `namespace` opsional. Tanpa itu keluarannya identik byte per byte
 * dengan sebelum i18n ada — lihat `i18n.mjs`.
 */
export function generateColumnItems(schema, namespace = null) {
  const fields = schema.fields ?? {}

  /*
   * Kolom audit dibuang dari tabel — untuk master data itu benar:
   * "dibuat kapan, oleh siapa" jarang dicari dan mendorong kolom yang
   * berguna keluar layar.
   *
   * Tapi hanya kalau schema-nya TIDAK menyebutnya. Ada resource yang
   * justru berporos pada waktunya: di layar Notification Log,
   * `created_at` adalah kolom terpenting — log tanpa jam tidak bisa
   * dipakai menelusuri apa pun. Membuangnya di sana menghasilkan tabel
   * yang barisnya tidak bisa dibedakan satu sama lain, dan gagalnya
   * diam: kolom yang tidak pernah muncul tidak bisa dibedakan dari
   * kolom yang memang tidak dideklarasikan.
   *
   * Jadi pengecualian ini berlaku untuk field hasil introspeksi saja.
   * `table: true` yang ditulis eksplisit di schema selalu menang —
   * penulisnya memang bermaksud begitu.
   */
  const auditFields = new Set([
    "id",
    "created_at",
    "updated_at",
    "is_deleted",
    "deleted_at",
    "created_by",
    "updated_by",
    "deleted_by",
  ])
  /*
   * Backend memberi `table: true/false` hanya pada field yang
   * dideklarasikan di schema. Field hasil introspeksi model/serializer
   * datang dengan `table: null`.
   *
   * Dulu filternya `!== false`, jadi semua field introspeksi ikut jadi
   * kolom: tabel Employee membengkak jadi 30 kolom, dan setiap lookup
   * muncul dua kali (`company` -> company_name, plus field
   * `company_name` bawaan serializer). Sekarang kolom harus
   * dideklarasikan eksplisit.
   */
  const declared = Object.entries(fields)
    .filter(([name, meta]) => {
      if (meta.table !== true)
        return false

      /*
       * Field audit ikut hanya kalau schema-nya menyebut label sendiri.
       * Introspeksi model tidak pernah memberi `label`, jadi itu
       * penanda yang bisa dipercaya bahwa kolomnya ditulis orang.
       */
      if (auditFields.has(name))
        return Boolean(meta.label)

      return true
    })

  /*
   * Jaring pengaman: module yang schema-nya belum mendeklarasikan
   * field sama sekali tetap dapat tabel, bukan tabel kosong.
   */
  const selected = declared.length
    ? declared
    : Object.entries(fields).filter(
      ([name, meta]) =>
        !excludedFields.has(name)
        && meta.table !== false,
    )

  /*
   * Kunci payload yang ditampilkan kolom ini. Relasi jatuh ke
   * `<field>_name` kalau tidak disebut; sisanya memakai namanya
   * sendiri.
   */
  function columnKey(name, meta) {
    if (meta.display_key)
      return meta.display_key

    return meta.type === "lookup" ? `${name}_name` : name
  }

  const seen = new Set()

  const unique = selected
    .filter(([name, meta]) => {
      const key = columnKey(name, meta)

      if (seen.has(key))
        return false

      seen.add(key)

      return true
    })

  /*
   * `column_after` menempelkan sebuah kolom tepat di sebelah kanan
   * kolom lain, dan itu satu-satunya kenop urutan kolom di sini.
   *
   * Urutan kolom mengikuti urutan dict yang dikirim backend, dan itu
   * bukan urutan yang ditulis siapa pun: `build_ui_schema` merakit
   * field model lebih dulu, lalu menempelkan field turunan serializer
   * di belakangnya. Jadi kolom seperti `employee_number` selalu
   * mendarat paling kanan — di luar layar, di belakang kolom audit —
   * dan yang mencarinya menyimpulkan kolomnya tidak pernah dibuat.
   *
   * Sengaja **bukan** mengurutkan seluruh kolom lewat `order`: angka
   * itu lokal per tab (tiap berkas tab mulai lagi dari 10), jadi
   * mengurutkannya global menyelang-nyelingkan tab — Work Date jatuh
   * ke urutan tujuh dan Manual Adjustment naik ke urutan empat. Sudah
   * dicoba, dan hasilnya lebih buruk daripada keadaan yang diperbaiki.
   *
   * Opt-in: module yang tidak memakainya tidak berubah sama sekali.
   */
  const arranged = unique.slice()

  for (const entry of unique) {
    const [, meta] = entry
    const anchor = meta.column_after

    if (!anchor)
      continue

    const target = arranged.findIndex(([name]) => name === anchor)

    if (target === -1)
      continue

    const current = arranged.indexOf(entry)

    if (current === -1 || current === target + 1)
      continue

    arranged.splice(current, 1)

    arranged.splice(
      arranged.findIndex(([name]) => name === anchor) + 1,
      0,
      entry,
    )
  }

  return arranged
    .map(([name, meta]) => {
      const label = meta.label ?? name

      // Ekspresi label: literal kalau i18n mati, `resourceLabel(...)`
      // kalau hidup. Dipakai di seluruh cabang di bawah.
      const L = labelExpr(namespace, "fields", name, label)

        /*
         * `display_key` diperiksa **sebelum** boolean, dan itu satu-
         * satunya jalan keluar dari "Active/Inactive" tanpa mengubah
         * arti kolom boolean di seluruh module.
         *
         * Boolean dipetakan ke `column.status`, jadi kolom Taxable
         * terbaca "Active" — bukan cuma janggal, tapi salah: "Active"
         * tidak menjawab apakah tunjangan itu menambah dasar pajak.
         * Yang mengubahnya hanya schema yang **sengaja** menyediakan
         * field label; tidak ada satu pun schema existing yang
         * mendeklarasikan `display_key` pada boolean, jadi keluaran
         * module lain tidak bergeser sebaris pun.
         *
         * Perbaikan menyeluruh (`column.boolean` yang sudah ada dan
         * menampilkan Yes/No) tetap jadi utang framework — mengubahnya
         * sekarang menggeser tampilan tiap kolom boolean di semua
         * module sekaligus.
         */
        if (meta.type === "boolean" && meta.display_key) {
          return `      column.text(${opt(meta.display_key)}, ${L}),`
        }

        if (meta.type === "boolean") {
          return `      column.status(${opt(name)}, ${L}),`
        }

        if (meta.type === "lookup") {
          return `      column.text(${opt(columnKey(name, meta))}, ${L}),`
        }

        /*
         * `display_key` dulu hanya dibaca untuk field lookup, jadi kolom
         * select dan text yang punya versi siap-tampil di serializer
         * tetap menampilkan nilai mentahnya: "employment_type_change"
         * di kolom Action Type, "applied" di kolom Status. Sekarang
         * dibaca untuk semua tipe — artinya memang "kunci payload yang
         * ditampilkan", bukan "kunci payload khusus relasi".
         */
        if (meta.display_key) {
          return `      column.text(${opt(meta.display_key)}, ${L}),`
        }

        if (meta.type === "number") {
          return `      column.number(${opt(name)}, ${L}),`
        }

        if (meta.type === "date") {
          return `      column.date(${opt(name)}, ${L}),`
        }

        if (meta.type === "datetime") {
          return `      column.datetime(${opt(name)}, ${L}),`
        }

        return `      column.text(${opt(name)}, ${L}),`
    })
    .join("\n")
}