import fs from "node:fs/promises"
import path from "node:path"

import {
  camelCase,
  kebabCase,
  pascalCase,
  snakeCase,
} from "../utils/strings.mjs"

/*
 * Key yang benar-benar dipakai renderer. `build_common_schema_meta` di
 * backend selalu ikut mengirim `ui`, `tabs`, `actions`, `permissions`,
 * `workflow`, `layout`, dan `import` — semuanya milik schema CRUD dan
 * tidak berarti untuk dashboard. Dibuang di sini supaya schema.ts hasil
 * generate tidak penuh objek kosong.
 */
const SCHEMA_KEYS = [
  "module",
  "type",
  "title",
  "slug",
  "entity",
  "description",
  "endpoint",
  "columns",
  "filters",
  "widgets",
  "i18n",
]

function pickSchema(schema) {
  const picked = {}

  for (const key of SCHEMA_KEYS) {
    const value = schema?.[key]

    if (value === undefined) continue

    picked[key] = value
  }

  return picked
}

function replaceTokens(content, names, modulePath, schemaJson) {
  return content
    .replace(/__schemaJson__/g, schemaJson)
    .replace(/__Name__/g, names.pascal)
    .replace(/__name__/g, names.camel)
    .replace(/__camelName__/g, names.camel)
    .replace(/__kebab__/g, names.kebab)
    .replace(/__Pascal__/g, names.pascal)
    .replace(/__Camel__/g, names.camel)
    .replace(/__Kebab__/g, names.kebab)
    .replace(/__Snake__/g, names.snake)
    .replace(/__modulePath__/g, modulePath)
}

export async function generateDashboard(name, options = {}) {
  const rawPath = String(name ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "")

  const pathParts = rawPath.split("/").filter(Boolean)
  const entity = pathParts.at(-1)

  if (!entity) {
    throw new Error("Module name required")
  }

  const schema = options.schema ?? null

  if (!schema) {
    throw new Error("Dashboard schema required")
  }

  if (!schema.endpoint) {
    throw new Error(
      `Schema '${rawPath}' tidak punya 'endpoint'. `
      + "Isi key itu di schema backend — tanpa itu halaman dashboard "
      + "tidak tahu ke mana harus mengambil data.",
    )
  }

  const widgets = schema.widgets ?? []

  if (!widgets.length) {
    console.warn(
      `⚠ Schema '${rawPath}' tidak punya widget sama sekali — `
      + "halamannya akan kosong.",
    )
  }

  // Prefix nama module supaya konstanta hasil generate tidak bertabrakan
  // saat dua dashboard di-import di file yang sama (mis. halaman home).
  const identifier = pathParts.join("-")

  const names = {
    pascal: pascalCase(identifier),
    camel: camelCase(identifier),
    kebab: kebabCase(identifier),
    snake: snakeCase(identifier),
  }

  const moduleImportPath = pathParts.join("/")

  const schemaJson = JSON.stringify(pickSchema(schema), null, 2)

  const modulePath = path.join(
    process.cwd(),
    "app",
    "modules",
    ...pathParts,
  )

  const templatePath = path.join(
    process.cwd(),
    "scripts",
    "meinova",
    "templates",
    "dashboard",
  )

  await fs.mkdir(modulePath, { recursive: true })

  const entries = await fs.readdir(templatePath, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isFile()) continue

    const source = await fs.readFile(
      path.join(templatePath, entry.name),
      "utf8",
    )

    const content = replaceTokens(
      source,
      names,
      moduleImportPath,
      schemaJson,
    )

    const outputPath = path.join(modulePath, entry.name)

    await fs.writeFile(outputPath, content, "utf8")

    console.log(`✔ Created ${path.relative(process.cwd(), outputPath)}`)
  }

  console.log(`
    Dashboard generation complete!
    Module   : ${names.pascal}
    Widgets  : ${widgets.length}
    Filters  : ${(schema.filters ?? []).length}
    Endpoint : ${schema.endpoint}
    Path     : app/modules/${moduleImportPath}
  `)
}
