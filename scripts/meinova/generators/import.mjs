import fs from "node:fs/promises"
import path from "node:path"

import {
  camelCase,
  kebabCase,
  pascalCase,
  snakeCase,
} from "../utils/strings.mjs"


const TEMPLATE_FOLDER = "import"

/*
 * Backend mengirim konfigurasi import dalam snake_case
 * (lihat apps/framework/builders/importer.py).
 * Frontend memakai ImportSchema yang camelCase,
 * jadi pemetaan nama dilakukan di sini.
 */
const SCHEMA_KEY_MAP = {
  title: "title",
  description: "description",

  completed_title: "completedTitle",
  completed_description: "completedDescription",

  back_label: "backLabel",
  import_another_label: "importAnotherLabel",

  profile_endpoint: "profileEndpoint",
  profile_label: "profileLabel",

  file_label: "fileLabel",
  file_accept: "fileAccept",

  preview_endpoint: "previewEndpoint",
  confirm_endpoint: "confirmEndpoint",

  template_endpoint: "templateEndpoint",
  template_label: "templateLabel",

  job_endpoint: "jobEndpoint",
  error_report_endpoint: "errorReportEndpoint",

  poll_interval_ms: "pollIntervalMs",
  poll_timeout_ms: "pollTimeoutMs",

  max_file_size_mb: "maxFileSizeMb",
}

const OPTION_KEY_MAP = {
  skip_invalid: "skipInvalid",
  skip_duplicates: "skipDuplicates",
  stop_on_error: "stopOnError",
  dry_run: "dryRun",
  overwrite: "overwrite",
}

function quote(value) {
  return JSON.stringify(String(value ?? ""))
}

function indent(text, spaces) {
  const pad = " ".repeat(spaces)

  return String(text)
    .split("\n")
    .map(line => (line ? pad + line : line))
    .join("\n")
}

function renderPreviewColumns(columns) {
  if (!Array.isArray(columns) || !columns.length)
    return "[]"

  const items = columns.map((column) => {
    const lines = [
      `key: ${quote(column.key)},`,
      `label: ${quote(column.label)},`,
    ]

    if (column.align)
      lines.push(`align: ${quote(column.align)},`)

    if (column.width !== undefined && column.width !== null) {
      lines.push(
        typeof column.width === "number"
          ? `width: ${column.width},`
          : `width: ${quote(column.width)},`,
      )
    }

    return `  {\n${indent(lines.join("\n"), 4)}\n  },`
  })

  return `[\n${items.join("\n")}\n]`
}

function renderOptions(options) {
  const entries = Object.entries(options ?? {})
    .filter(([key]) => OPTION_KEY_MAP[key])
    .map(([key, value]) => `  ${OPTION_KEY_MAP[key]}: ${Boolean(value)},`)

  if (!entries.length)
    return null

  return `{\n${entries.join("\n")}\n}`
}

export function renderImportSchema(importConfig) {
  const lines = []

  for (const [sourceKey, targetKey] of Object.entries(SCHEMA_KEY_MAP)) {
    const value = importConfig?.[sourceKey]

    if (value === undefined || value === null || value === "")
      continue

    lines.push(
      typeof value === "number"
        ? `  ${targetKey}: ${value},`
        : `  ${targetKey}: ${quote(value)},`,
    )
  }

  const previewColumns = renderPreviewColumns(
    importConfig?.preview_columns,
  )

  if (previewColumns !== "[]")
    lines.push(`  previewColumns: ${indent(previewColumns, 2).trimStart()},`)

  const options = renderOptions(importConfig?.options)

  if (options)
    lines.push(`  options: ${indent(options, 2).trimStart()},`)

  return `{\n${lines.join("\n")}\n}`
}

function replaceTokens(content, names, importConfig) {
  return String(content)
    .replace(/__Name__/g, names.pascal)
    .replace(/__name__/g, names.camel)
    .replace(/__kebab__/g, names.kebab)
    .replace(/__Pascal__/g, names.pascal)
    .replace(/__Camel__/g, names.camel)
    .replace(/__Kebab__/g, names.kebab)
    .replace(/__Snake__/g, names.snake)
    .replace(/__IMPORT_SCHEMA__/g, renderImportSchema(importConfig))
    .replace(
      /__BACK_ROUTE__/g,
      quote(importConfig?.back_route ?? "/"),
    )
    .replace(
      /__IMPORT_MODULE__/g,
      String(importConfig?.module ?? ""),
    )
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath)
    return true
  }
  catch {
    return false
  }
}

export async function generateImport(name, options = {}) {
  const importConfig = options.importConfig
    ?? options.schema?.import
    ?? null

  /*
   * Module tanpa fitur import mengirim `"import": {}` — objek kosong
   * itu truthy, jadi dulu setiap module ikut dibuatkan folder
   * `import/` berisi schema kosong. Sekarang import harus dinyalakan
   * eksplisit oleh backend.
   */
  if (
    !importConfig
    || importConfig.enabled !== true
    || !importConfig.module
  ) {
    return false
  }

  const rawPath = String(name ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "")

  const pathParts = rawPath
    .split("/")
    .map(part => part.trim())
    .filter(Boolean)

  const entity = pathParts.at(-1)

  if (!entity) {
    throw new Error(
      "Module name required. Example: hr/employees",
    )
  }

  const names = {
    pascal: pascalCase(entity),
    camel: camelCase(entity),
    kebab: kebabCase(entity),
    snake: snakeCase(entity),
  }

  const templatePath = path.join(
    process.cwd(),
    "scripts",
    "meinova",
    "templates",
    TEMPLATE_FOLDER,
  )

  if (!(await pathExists(templatePath))) {
    throw new Error(
      `Import template not found: ${path.relative(
        process.cwd(),
        templatePath,
      )}`,
    )
  }

  const targetDir = path.join(
    process.cwd(),
    "app",
    "modules",
    ...pathParts,
    "import",
  )

  await fs.mkdir(targetDir, { recursive: true })

  const entries = await fs.readdir(templatePath, {
    withFileTypes: true,
  })

  for (const entry of entries) {
    if (!entry.isFile())
      continue

    const content = await fs.readFile(
      path.join(templatePath, entry.name),
      "utf8",
    )

    const outputPath = path.join(
      targetDir,
      entry.name.replace(/__Name__/g, names.pascal),
    )

    await fs.writeFile(
      outputPath,
      replaceTokens(content, names, importConfig),
      "utf8",
    )

    console.log(
      `✔ Created ${path.relative(process.cwd(), outputPath)}`,
    )
  }

  return true
}
