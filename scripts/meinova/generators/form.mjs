function q(value) {
  return JSON.stringify(value)
}

function cleanOptions(options) {
  return Object.fromEntries(
    Object.entries(options).filter(
      ([, value]) =>
        value !== undefined
        && value !== null,
    ),
  )
}

function formatOptions(options) {
  const clean = cleanOptions(options)

  if (!Object.keys(clean).length)
    return ""

  return `, ${JSON.stringify(
    clean,
    null,
    2,
  ).replace(/\n/g, "\n    ")}`
}

export function generateFormFields(schema) {
  const fields = schema.fields ?? {}

  return Object.entries(fields)
    .sort(
      ([, a], [, b]) =>
        (
          a.form?.order
          ?? a.order
          ?? 100
        )
        - (
          b.form?.order
          ?? b.order
          ?? 100
        ),
    )
    .filter(
      ([, meta]) =>
        meta.form !== false
        && meta.read_only !== true,
    )
    .filter(([name, meta]) => {
      if (
        [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
        ].includes(name)
      ) {
        return false
      }

      if (
        [
          "created_by",
          "updated_by",
          "deleted_by",
        ].includes(name)
      ) {
        return false
      }

      if (name === "is_deleted")
        return false

      if (
        meta.type === "lookup"
        && !meta.lookup_endpoint
      ) {
        return false
      }

      return true
    })
    .map(([name, meta]) => {
      const label =
        meta.label
        ?? name
          .replace(/_/g, " ")
          .replace(/-/g, " ")
          .replace(
            /\b\w/g,
            char => char.toUpperCase(),
          )

      const options = {
        required:
          meta.required === true
            ? true
            : undefined,

        placeholder: meta.placeholder,

        // Cascading lookup.
        dependsOn:
          meta.depends_on
          ?? meta.dependsOn
          ?? meta.depends,

        lookupParams:
          meta.lookup_params
          ?? meta.lookupParams,

        rows: meta.rows,
        layout: meta.layout,

        // Workspace tab.
        tab: meta.tab ?? "general",

        // Field order inside tab.
        order:
          meta.form?.order
          ?? meta.order,
      }

      if (
        (
          meta.widget === "textarea"
          || meta.type === "textarea"
        )
        && !options.layout
      ) {
        options.layout = "full"
      }

      const args = formatOptions(options)

      if (meta.type === "lookup") {
        return `  field.lookup(${q(name)}, ${q(label)}, ${q(meta.lookup_endpoint)}${args}),`
      }

      if (meta.type === "boolean") {
        return `  field.switch(${q(name)}, ${q(label)}${args}),`
      }

      if (meta.type === "email") {
        return `  field.email(${q(name)}, ${q(label)}${args}),`
      }

      if (
        meta.type === "textarea"
        || meta.widget === "textarea"
      ) {
        return `  field.textarea(${q(name)}, ${q(label)}${args}),`
      }

      if (meta.type === "number") {
        return `  field.number(${q(name)}, ${q(label)}${args}),`
      }

      if (meta.type === "date") {
        return `  field.date(${q(name)}, ${q(label)}${args}),`
      }

      if (meta.type === "datetime") {
        return `  field.datetime(${q(name)}, ${q(label)}${args}),`
      }

      return `  field.text(${q(name)}, ${q(label)}${args}),`
    })
    .join("\n\n")
}