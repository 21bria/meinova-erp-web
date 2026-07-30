export function generateDisplayLabel(schema) {
  const fields = schema.fields ?? {}

  if (fields.name) return `row.name ?? row.code ?? String(row.id)`
  if (fields.full_name) return `row.full_name ?? row.code ?? String(row.id)`
  if (fields.code) return `row.code ?? String(row.id)`

  return `String(row.id)`
}

export function generateDisplayLabelDelete(schema) {
  const fields = schema.fields ?? {}

  if (fields.name) return `del.selected.value?.name ?? del.selected.value?.code ?? del.selected.value?.id`
  if (fields.full_name) return `del.selected.value?.full_name ?? del.selected.value?.code ?? del.selected.value?.id`
  if (fields.code) return `del.selected.value?.code ?? del.selected.value?.id`

  return `del.selected.value?.id`
}