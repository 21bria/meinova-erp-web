import { labelKey } from "./i18n.mjs"

function opt(v) {
  return JSON.stringify(v)
}

/*
 * Penyaringan berantai untuk filter tabel.
 *
 * `depends_on` dan `lookup_params` sudah lama ditulis di schema dan
 * sudah lama dipakai `MFormBuilder` — tapi generator ini membuangnya,
 * jadi hanya form-nya yang tersaring. Di toolbar tabel, memilih Company
 * "Karya Wijaya" tetap menyisakan dropdown Branch berisi seluruh
 * tenant: empat baris bernama persis "Default Location" dari empat
 * perusahaan berbeda, tanpa satu pun keterangan yang membedakannya.
 *
 * `MCrudFilters` sudah meneruskan keduanya ke `MLookupField` lengkap
 * dengan `:form-values="local"`, jadi `$company` di sini ter-resolve ke
 * nilai **filter**, bukan nilai form. Yang kurang cuma dua baris ini.
 */
function cascade(meta) {
  const lines = []

  if (meta.depends_on)
    lines.push(`    dependsOn: ${opt(meta.depends_on)},`)

  if (meta.lookup_params)
    lines.push(`    lookupParams: ${opt(meta.lookup_params)},`)

  return lines.length ? `\n${lines.join("\n")}` : ""
}

/*
 * `filter` punya **dua bentuk** di schema, dan generator ini dulu hanya
 * mengenali satu.
 *
 *   "filter": true
 *   "filter": {"group": "quick", "order": 20}
 *
 * Bentuk kedua dipakai seluruh schema organisasi. Karena diperiksa
 * `=== true`, semuanya jatuh — layar Departments tidak punya filter
 * Company, Location, maupun Division **sama sekali**, padahal ketiganya
 * dideklarasikan. Dan gagalnya diam: filter yang tidak pernah muncul
 * tidak bisa dibedakan dari filter yang memang tidak dideklarasikan.
 */
function filterConfig(meta) {
  const declared = meta.filter

  if (!declared)
    return null

  return typeof declared === "object" ? declared : {}
}

function placementOf(meta, fallback) {
  const config = filterConfig(meta) ?? {}

  return config.group ?? meta.placement ?? fallback
}

function orderOf(meta) {
  const config = filterConfig(meta) ?? {}

  return Number(config.order ?? meta.order ?? 9999)
}

export function generateFilterItems(schema, namespace = null) {
  const fields = schema.fields ?? {}

  const skipped = []

  const items = Object.entries(fields)
    .filter(([, meta]) => filterConfig(meta) !== null)
    .sort(([, a], [, b]) => orderOf(a) - orderOf(b))
    .map(([name, meta]) => {
      const config = filterConfig(meta) ?? {}
      const label = meta.label ?? name

      // Label tetap literal Inggris; kuncinya dititipkan sebagai
      // `labelKey` supaya `MCrudFilters` bisa menerjemahkannya saat
      // merender. Lihat catatan di `i18n.mjs` soal kenapa memanggil
      // `resourceLabel()` di module scope tidak berhasil.
      const L = opt(label)
      const LK = labelKey(namespace, "filters", name, label)
      const LKEY = LK ? `\n    labelKey: ${opt(LK)},` : ""

      /*
       * Rentang tanggal — penyaring periode untuk daftar transaksional.
       *
       * Dikenali dari `filter.type`, bukan dari `meta.type`: kolomnya
       * tetap `date` (form-nya memang satu tanggal), yang berbeda cuma
       * cara **menyaringnya**. Menurunkannya dari tipe kolom berarti
       * setiap tanggal di setiap modul mendadak jadi pemilih rentang,
       * termasuk yang memang disaring per tanggal persis.
       *
       * Satu penyaring ini memancarkan **dua** query param, dan nama
       * keduanya datang dari schema (`filter.params`). Lihat
       * `apps.framework.list_period` di backend.
       */
      if (config.type === "dateRange") {
        const params = config.params ?? {}

        const extra = [
          `    placement: ${opt(placementOf(meta, "quick"))},${LKEY}`,
          `    fromKey: ${opt(params.from ?? "date_from")},`,
          `    toKey: ${opt(params.to ?? "date_to")},`,
        ]

        if (config.default)
          extra.push(`    defaultRange: ${opt(config.default)},`)

        if (config.max_days)
          extra.push(`    maxDays: ${opt(config.max_days)},`)

        if (Array.isArray(config.presets) && config.presets.length)
          extra.push(`    presets: ${opt(config.presets)},`)

        if (config.required)
          extra.push(`    required: true,`)

        return `  filter.dateRange(${opt(name)}, ${L}, {
${extra.join("\n")}
  }),`
      }

      if (meta.type === "lookup") {
        /*
         * Lookup tanpa endpoint menghasilkan dropdown yang **selalu
         * kosong** — kotak "Select" yang bisa dibuka, tidak berisi apa
         * pun, dan tidak bisa dipakai. Itu lebih buruk daripada tidak
         * ada: pemakainya menyangka datanya yang belum ada.
         *
         * Dilewati, tapi dicatat di berkas hasilnya — supaya yang
         * kurang terlihat di tempat orang mencarinya, bukan hilang
         * tanpa jejak.
         */
        if (!meta.lookup_endpoint) {
          skipped.push(name)

          return null
        }

        return `  filter.lookup(${opt(name)}, ${L}, ${opt(meta.lookup_endpoint)}, {
    placement: ${opt(placementOf(meta, "advanced"))},${LKEY}${cascade(meta)}
  }),`
      }

      if (meta.type === "boolean") {
        return `  filter.select(${opt(name)}, ${L}, [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: ${opt(placementOf(meta, "quick"))},${LKEY}
  }),`
      }

      /*
       * Field bertipe pilihan yang **membawa daftar pilihannya** jadi
       * dropdown, bukan kotak teks bebas.
       *
       * Sebelumnya keduanya jatuh ke cabang terakhir, jadi filter
       * Status / Source / Approval Status di seluruh modul berupa
       * kotak ketik — dan yang memakainya harus menebak **nilai
       * tersimpannya**, bukan labelnya: mengetik "Manual" tidak
       * mencocokkan apa pun karena yang tersimpan `manual`. Gagalnya
       * diam: hasilnya nol baris, dan itu tidak bisa dibedakan dari
       * data yang memang tidak ada.
       *
       * Yang **tidak** membawa options tetap kotak teks — dropdown
       * kosong lebih buruk daripada kotak ketik, pelajaran yang sama
       * dengan lookup tanpa endpoint di atas.
       */
      if (Array.isArray(meta.options) && meta.options.length) {
        const choices = meta.options
          .map(item => `    { label: ${opt(String(item.label ?? item.value))},`
            + ` value: ${opt(String(item.value))} },`)
          .join("\n")

        return `  filter.select(${opt(name)}, ${L}, [
${choices}
  ], {
    placement: ${opt(placementOf(meta, "quick"))},${LKEY}
  }),`
      }

      return `  filter.text(${opt(name)}, ${L}, {
    placement: ${opt(placementOf(meta, "advanced"))},${LKEY}
  }),`
    })
    .filter(Boolean)

  if (skipped.length) {
    items.push(
      `  // Dilewati (lookup tanpa endpoint, dropdown-nya akan selalu`
      + ` kosong): ${skipped.join(", ")}`,
    )
  }

  return items.join("\n")
}