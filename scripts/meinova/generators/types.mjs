function tsType(meta) {
  if (meta.type === "number") return "number"
  if (meta.type === "boolean") return "boolean"
  if (meta.type === "lookup") return "number | null"
  return "string"
}

export function generateRowFields(schema) {
  const fields = schema.fields ?? {}

  const rows = [`  id: number`]

  Object.entries(fields).forEach(([name, meta]) => {
    rows.push(`  ${name}: ${tsType(meta)}`)

    if (meta.type === "lookup") {
      rows.push(`  ${name}_name?: string | null`)
    }
  })

  return rows.join("\n")
}

export function generatePayloadFields(schema) {
  const fields = schema.fields ?? {}

  const rows = [`  id?: number`]

  Object.entries(fields)
    .filter(([, meta]) => meta.read_only !== true)
    .forEach(([name, meta]) => {
      rows.push(`  ${name}: ${tsType(meta)}`)
    })

  return rows.join("\n")
}