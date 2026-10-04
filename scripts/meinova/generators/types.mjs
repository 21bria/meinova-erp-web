function tsType(meta) {
  if (meta.type === "number") return "number"
  if (meta.type === "boolean") return "boolean"

  // Daftar peringatan backend (`widget: "warnings"`, lihat
  // `MFieldWarnings`) — `{kind, message}`, bukan teks.
  if (meta.widget === "warnings")
    return "{ kind: string, message: string }[]"

  // Lookup banyak nilai membawa **daftar** id, bukan satu id. Ditulis
  // `number | null` seperti lookup biasa, tipe payload PATCH-nya
  // berbohong dan tidak ada yang menangkapnya sampai runtime.
  if (meta.type === "lookup") {
    return meta.multiple === true ? "number[]" : "number | null"
  }

  return "string"
}

/**
 * Menulis satu baris field hanya kalau namanya belum pernah ditulis.
 *
 * `id` selalu ditulis lebih dulu secara manual, sementara schema
 * backend juga membawa `id` hasil introspeksi model — tanpa penjagaan
 * ini setiap `types.ts` hasil generate memuat `id` dua kali dan
 * TypeScript menolaknya (TS2300/TS2717). Hal yang sama terjadi pada
 * `<lookup>_name` kalau schema-nya mendeklarasikan field tampilan itu
 * secara eksplisit.
 *
 * Yang menang adalah baris pertama, karena itu yang tipenya paling
 * spesifik (`id: number`, bukan `id: string`).
 */
function pushField(rows, seen, name, line) {
  if (seen.has(name)) return

  seen.add(name)
  rows.push(line)
}

export function generateRowFields(schema) {
  const fields = schema.fields ?? {}

  const rows = []
  const seen = new Set()

  pushField(rows, seen, "id", `  id: number`)

  Object.entries(fields).forEach(([name, meta]) => {
    pushField(rows, seen, name, `  ${name}: ${tsType(meta)}`)

    if (meta.type === "lookup" && meta.multiple !== true) {
      pushField(
        rows,
        seen,
        `${name}_name`,
        `  ${name}_name?: string | null`,
      )
    }
  })

  return rows.join("\n")
}

export function generatePayloadFields(schema) {
  const fields = schema.fields ?? {}

  const rows = []
  const seen = new Set()

  pushField(rows, seen, "id", `  id?: number`)

  Object.entries(fields)
    .filter(([, meta]) => meta.read_only !== true)
    .forEach(([name, meta]) => {
      pushField(rows, seen, name, `  ${name}: ${tsType(meta)}`)
    })

  return rows.join("\n")
}
