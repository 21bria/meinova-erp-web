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
        ...(
          field
          && typeof field === "object"
            ? field
            : {}
        ),
        name:
          field?.name
          ?? field?.key
          ?? field?.field,
        __index: index,
      }))
      .filter(field => field.name)
  }

  if (
    !fields
    || typeof fields !== "object"
  ) {
    return []
  }

  return Object.entries(fields)
    .map(([name, config], index) => ({
      name,
      ...(
        config
        && typeof config === "object"
          ? config
          : {}
      ),
      __index: index,
    }))
}

function humanize(value) {
  return String(value ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(
      /\b\w/g,
      char => char.toUpperCase(),
    )
}

function isOverviewField(field) {
  if (!field?.name)
    return false

  if (SYSTEM_FIELDS.has(field.name))
    return false

  return (
    field.overview === true
    || field.placement === "overview"
  )
}

function resolveOrder(field) {
  const raw =
    field.overview_order
    ?? field.overviewOrder
    ?? field.order
    ?? field.__index

  const value = Number(raw)

  return Number.isFinite(value)
    ? value
    : field.__index
}

function getOverviewFields(schema) {
  return getFields(schema)
    .filter(isOverviewField)
    .sort(
      (a, b) =>
        resolveOrder(a)
        - resolveOrder(b),
    )
}

export function generateOverviewItems(schema) {
  const fields = getOverviewFields(schema)

  if (fields.length === 0)
    return "[]"

  const items = fields.map((field) => {
    const label =
      field.overview_label
      ?? field.overviewLabel
      ?? field.label
      ?? humanize(field.name)

    const fallback =
      field.overview_fallback
      ?? field.overviewFallback
      ?? "-"

    const format =
      field.overview_format
      ?? field.overviewFormat
      ?? field.format
      ?? null

    /*
     * Kunci payload yang dibaca kartu Overview — sama aturannya dengan
     * kolom tabel. Tanpa ini field lookup memperlihatkan **pk mentah**
     * ("14") dan field select memperlihatkan nilai internalnya
     * ("employment_type_change"), karena keduanya memang bukan yang
     * dikirim serializer untuk dibaca orang.
     */
    const key =
      field.display_key
      ?? field.displayKey
      ?? (field.type === "lookup" ? `${field.name}_name` : field.name)

    const lines = [
      `    key: ${JSON.stringify(key)},`,
      `    label: ${JSON.stringify(label)},`,
      `    fallback: ${JSON.stringify(fallback)},`,
    ]

    if (format) {
      lines.push(
        `    format: ${JSON.stringify(format)},`,
      )
    }

    return `  {
${lines.join("\n")}
  }`
  })

  return `[
${items.join(",\n")}
]`
}