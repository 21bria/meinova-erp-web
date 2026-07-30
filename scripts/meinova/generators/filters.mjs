function opt(v) {
  return JSON.stringify(v)
}

export function generateFilterItems(schema) {
  const fields = schema.fields ?? {}

  return Object.entries(fields)
    .filter(([, meta]) => meta.filter === true)
    .sort(([, a], [, b]) =>
      Number(a.order ?? 9999) - Number(b.order ?? 9999)
    )
    .map(([name, meta]) => {
      const label = meta.label ?? name

      if (meta.type === "lookup") {
        return `  filter.lookup(${opt(name)}, ${opt(label)}, ${opt(meta.lookup_endpoint)}, {
    placement: ${opt(meta.placement ?? "advanced")},
  }),`
      }

      if (meta.type === "boolean") {
        return `  filter.select(${opt(name)}, ${opt(label)}, [
    { label: "Active", value: "true" },
    { label: "Inactive", value: "false" },
  ], {
    placement: ${opt(meta.placement ?? "quick")},
  }),`
      }

      return `  filter.text(${opt(name)}, ${opt(label)}, {
    placement: ${opt(meta.placement ?? "advanced")},
  }),`
    })
    .join("\n")
}