function opt(value) {
  return JSON.stringify(value)
}

export function generateColumnItems(schema) {
  const fields = schema.fields ?? {}

 const excludedFields = new Set([
  "id",
  "created_at",
  "updated_at",
  "is_deleted",
  "deleted_at",
  "created_by",
  "updated_by",
  "deleted_by",
])
  return Object.entries(fields)
    .filter(([name, meta]) => {
      if (excludedFields.has(name))
        return false

      return meta.table !== false
    })
    .map(([name, meta]) => {
      const label = meta.label ?? name

      if (meta.type === "boolean") {
        return `      column.status(${opt(name)}, ${opt(label)}),`
      }

      if (meta.type === "lookup") {
        const displayKey = meta.display_key ?? `${name}_name`

        return `      column.text(${opt(displayKey)}, ${opt(label)}),`
      }

      if (meta.type === "number") {
        return `      column.number(${opt(name)}, ${opt(label)}),`
      }

      return `      column.text(${opt(name)}, ${opt(label)}),`
    })
    .join("\n")
}