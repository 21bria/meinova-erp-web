/*
 * Record action dari `schema.actions`.
 *
 * Kunci `actions` sudah lama diisi backend — Cuti, Roster, dan Employee
 * Action semuanya mendeklarasikan Submit/Approve/Reject lengkap dengan
 * endpoint, syarat tampil, dan isian yang diminta lebih dulu. Generator
 * tidak pernah membacanya, jadi tombolnya tidak pernah muncul walau
 * endpoint-nya jalan. Ini yang menutupnya.
 *
 * Yang diambil hanya action yang punya `endpoint`. Itu pembeda yang
 * tepat: `save`, `delete`, `export`, dan `import` dijalankan halaman
 * lewat jalur CRUD bawaannya sendiri dan sudah punya tombol di
 * template — mengulangnya di sini menghasilkan dua tombol Save yang
 * salah satunya menembak URL yang tidak ada.
 */

function q(value) {
  return JSON.stringify(value)
}

function clean(object) {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined && value !== null,
    ),
  )
}

/*
 * Form penuh resource lain (`create_resource`).
 *
 * Field-nya diteruskan **mentah** — dict `{nama: config}` cuma diratakan
 * jadi daftar. Pemetaan snake_case → camelCase-nya dikerjakan
 * `normalizeResourceFields` saat dialognya dibuka, helper yang sama
 * dengan yang dipakai tab resource; menyalinnya ke sini berarti dua
 * pemetaan yang harus dijaga tetap sama, dan yang tertinggal gagal
 * tanpa suara (dropdown tanpa sumber data, `visible_when` diabaikan).
 */
function normalizeForm(form) {
  if (!form || typeof form !== "object")
    return undefined

  const fields = Array.isArray(form.fields)
    ? form.fields
    : (
        form.fields && typeof form.fields === "object"
          ? Object.entries(form.fields).map(
            ([key, config]) => ({ key, ...config }),
          )
          : []
      )

  return clean({
    fields,
    parentField: form.parent_field ?? form.parentField,
    title: form.title,
    columns: form.columns,
    width: form.width,
  })
}

/*
 * `namespace` menyalakan kunci terjemahan per tombol: `i18nKey` =
 * `<namespace>.actions.<key>`. Label Inggris dari schema tetap ikut, jadi
 * kunci yang belum ditulis di katalog menampilkan teks yang sama persis
 * dengan sebelum kunci ini ada. Tanpa namespace keluarannya identik
 * dengan keluaran lama.
 */
export function generateRecordActions(schema, namespace = null) {
  const actions = Array.isArray(schema?.actions)
    ? schema.actions
    : []

  /*
   * Collection action dikecualikan **eksplisit**, bukan lewat "yang
   * endpoint-nya tidak memuat {id}". Keduanya sama-sama punya
   * `endpoint`, jadi tanpa penyaring ini tombol Post All ikut dirender
   * sebagai tombol per baris — menembak URL tanpa id, dibalas 404, dan
   * tidak ada yang menyangka tombolnya sedang salah tempat.
   */
  const records = actions.filter(
    item => item
      && typeof item.endpoint === "string"
      && item.endpoint
      && item.scope !== "collection",
  )

  if (!records.length)
    return "[]"

  const rows = records.map((item) => {
    const mapped = clean({
      key: item.key,
      label: item.label ?? item.key,
      i18nKey: namespace && item.key ? `${namespace}.actions.${item.key}` : undefined,
      icon: item.icon,
      variant: item.variant,
      placement: item.placement ?? "secondary",
      modes: Array.isArray(item.modes) ? item.modes : undefined,
      endpoint: item.endpoint,
      method: item.method ?? "post",
      payload: item.payload,
      fields: item.fields,
      form: normalizeForm(item.form),
      confirm: item.confirm,
      refresh: item.refresh !== false,
      // Dua dialek syarat tampil dipakai bersamaan di schema yang sudah
      // ada; komponennya menerima keduanya, jadi diteruskan apa adanya.
      visibleWhen: item.visible_when ?? item.visibleWhen,
      permission: item.permission,
    })

    return `  ${JSON.stringify(mapped, null, 2).replace(/\n/g, "\n  ")},`
  })

  return `[\n${rows.join("\n\n")}\n]`
}


/*
 * Collection action dari `schema.actions` — yang ber-`scope:
 * "collection"`.
 *
 * Tombolnya duduk di toolbar tabel, bukan di dalam baris: hanya di sana
 * yang tahu penyaring yang sedang aktif dan baris mana yang dicentang.
 * `selection` yang menghubungkan keduanya — lihat `action.collection()`
 * di sisi backend.
 */
export function generateCollectionActions(schema) {
  const actions = Array.isArray(schema?.actions)
    ? schema.actions
    : []

  const items = actions.filter(
    item => item
      && item.scope === "collection"
      && typeof item.endpoint === "string"
      && item.endpoint,
  )

  if (!items.length)
    return "[]"

  const rows = items.map((item) => {
    const mapped = clean({
      key: item.key,
      label: item.label ?? item.key,
      icon: item.icon,
      variant: item.variant,
      endpoint: item.endpoint,
      method: item.method ?? "post",
      // Bawaannya "optional" disamakan dengan sisi Python. Nilai yang
      // tidak dikenal diteruskan apa adanya supaya komponennya yang
      // memutuskan — menerjemahkannya di sini berarti dua daftar nilai
      // yang harus dijaga tetap sama.
      selection: item.selection ?? "optional",
      idsField: item.ids_field ?? item.idsField ?? "ids",
      payload: item.payload,
      confirm: item.confirm,
      permission: item.permission,
    })

    return `  ${JSON.stringify(mapped, null, 2).replace(/\n/g, "\n  ")},`
  })

  return `[\n${rows.join("\n\n")}\n]`
}
