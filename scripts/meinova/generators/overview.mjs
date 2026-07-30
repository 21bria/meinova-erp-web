const SYSTEM_FIELDS = new Set([
  "id",
  "created_at",
  "updated_at",
  "created_by",
  "updated_by",
  "deleted_at",
  "deleted_by",
  "is_deleted",
])

function getFields(schema) {
  const fields = schema?.fields ?? {}

  if (Array.isArray(fields)) {
    return fields
      .map((field, index) => ({
        ...field,
        name:
          field.name
          ?? field.key
          ?? field.field,
        __index: index,
      }))
      .filter(field => field.name)
  }

  return Object.entries(fields)
    .map(([name, config], index) => ({
      name,
      ...(config ?? {}),
      __index: index,
    }))
}

function humanize(value) {
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase())
}

function isOverviewField(field) {
  if (!field?.name)
    return false

  if (SYSTEM_FIELDS.has(field.name))
    return false

  /*
   * Overview harus eksplisit.
   *
   * overview: true
   * placement: "overview"
   */
  return (
    field.overview === true
    || field.placement === "overview"
  )
}

function getOverviewFields(schema) {
  const fields = getFields(schema)

  return fields
    .filter(isOverviewField)
    .sort((a, b) => {
      const orderA =
        a.overview_order
        ?? a.overviewOrder
        ?? a.order
        ?? a.__index

      const orderB =
        b.overview_order
        ?? b.overviewOrder
        ?? b.order
        ?? b.__index

      return orderA - orderB
    })
}

export function generateOverviewItems(schema) {
  const fields = getOverviewFields(schema)

  if (fields.length === 0)
    return "[]"

  const items = fields.map((field) => {
    const label =
      field.label
      ?? humanize(field.name)

    return `  {
    key: ${JSON.stringify(field.name)},
    label: ${JSON.stringify(label)},
  }`
  })

  return `[
${items.join(",\n")}
]`
}