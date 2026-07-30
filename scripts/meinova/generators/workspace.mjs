function humanize(value) {
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, char => char.toUpperCase())
}

function normalizeTab(tab, index) {
  if (!tab || typeof tab !== "object")
    return null

  const key = tab.key ?? tab.name ?? tab.id

  if (!key)
    return null

  return {
    key: String(key),

    label:
      tab.label
      ?? humanize(key),

    type:
      tab.type
      ?? "form",

    fields:
      Array.isArray(tab.fields)
        ? tab.fields
        : null,

    modes:
      Array.isArray(tab.modes)
        ? tab.modes
        : null,

    endpoint:
      tab.endpoint ?? null,

    module:
      tab.module ?? null,

    foreignKey:
      tab.foreign_key
      ?? tab.foreignKey
      ?? null,

    component:
      tab.component ?? null,

    icon:
      tab.icon ?? null,

    readonly:
      Boolean(tab.readonly),

    disabled:
      Boolean(tab.disabled),

    requiresRecord:
      Boolean(
        tab.requires_record
        ?? tab.requiresRecord,
      ),

    showOnCreate:
      tab.show_on_create
      ?? tab.showOnCreate
      ?? true,

    order:
      Number.isFinite(Number(tab.order))
        ? Number(tab.order)
        : (index + 1) * 10,
  }
}

export function getWorkspaceTabs(schema) {
  const source = schema?.tabs

  if (!Array.isArray(source))
    return []

  return source
    .map(normalizeTab)
    .filter(Boolean)
    .sort(
      (a, b) =>
        (a.order ?? 9999)
        - (b.order ?? 9999),
    )
}

export function generateWorkspaceTabs(schema) {
  return JSON.stringify(
    getWorkspaceTabs(schema),
    null,
    2,
  )
}

export function generateWorkspaceDefaultTab(schema) {
  const tabs = getWorkspaceTabs(schema)

  const configured =
    schema?.ui?.default_tab
    ?? schema?.ui?.defaultTab

  if (
    configured
    && tabs.some(tab => tab.key === configured)
  ) {
    return JSON.stringify(configured)
  }

  return JSON.stringify(
    tabs.find(tab => !tab.disabled)?.key
    ?? "",
  )
}