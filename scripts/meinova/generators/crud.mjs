import fs from "node:fs/promises"
import path from "node:path"

import {
  renderTable,
} from "./table.mjs"

import {
  generateFormFields,
} from "./form.mjs"

import {
  generateColumnItems,
} from "./columns.mjs"

import {
  generateCollectionActions,
  generateRecordActions,
} from "./actions.mjs"

import {
  generateFilterItems,
} from "./filters.mjs"

import {
  generateWorkspaceTabs,
  generateWorkspaceDefaultTab,
} from "./workspace.mjs"

import {
  generateOverviewItems,
} from "./overview.mjs"

import {
  collectedKeys,
  i18nImport,
  i18nNamespace,
  resetCollectedKeys,
} from "./i18n.mjs"

import {
  generateRowFields,
  generatePayloadFields,
} from "./types.mjs"

import {
  generateDisplayLabel,
  generateDisplayLabelDelete,
} from "./page.mjs"

import {
  camelCase,
  kebabCase,
  pascalCase,
  snakeCase,
} from "../utils/strings.mjs"

const CRUD_TEMPLATE_FOLDERS = {
  dialog: "crud-dialog",
  page: "crud-page",
  workspace: "crud-workspace",
}

function generateCrudUi(schema) {
  const ui = schema?.ui ?? {}

  return `{
  create: ${ui.create ?? true},
  edit: ${ui.edit ?? true},
  delete: ${ui.delete ?? true},
  bulk_delete: ${ui.bulk_delete ?? false},
  import: ${ui.import ?? false},
  export: ${ui.export ?? false},
}`
}

function replaceNameTokens(
  content,
  names,
) {
  return String(content)
    .replace(/__Name__/g, names.pascal)
    .replace(/__name__/g, names.camel)
    .replace(/__kebab__/g, names.kebab)
    .replace(/__Pascal__/g, names.pascal)
    .replace(/__Camel__/g, names.camel)
    .replace(/__Kebab__/g, names.kebab)
    .replace(/__Snake__/g, names.snake)
}

function replaceTokens(
  content,
  names,
  modulePath,
  endpoint,
  schema,
  namespace = null,
) {
  const tableContent = schema
    ? renderTable(names.camel, schema)
    : ""

  const formFields = schema
    ? generateFormFields(schema, namespace)
    : ""

  const columnItems = schema
    ? generateColumnItems(schema, namespace)
    : ""

  const recordActions = schema
    ? generateRecordActions(schema, namespace)
    : "[]"

  const collectionActions = schema
    ? generateCollectionActions(schema)
    : "[]"

  const filterItems = schema
    ? generateFilterItems(schema, namespace)
    : ""

  const workspaceTabs = schema
    ? generateWorkspaceTabs(schema, namespace)
    : "[]"

  const workspaceDefaultTab = schema
    ? generateWorkspaceDefaultTab(schema)
    : '""'

  const overviewItems = schema
    ? generateOverviewItems(schema)
    : "[]"

  const rowFields = schema
    ? generateRowFields(schema)
    : ""

  const payloadFields = schema
    ? generatePayloadFields(schema)
    : ""

  const displayLabel = schema
    ? generateDisplayLabel(schema)
    : "row.name ?? row.code ?? String(row.id)"

  const displayLabelDelete = schema
    ? generateDisplayLabelDelete(schema)
    : "del.selected.value?.name ?? del.selected.value?.code ?? del.selected.value?.id"

  return replaceNameTokens(
    content,
    names,
  )
    .replace(
      /__modulePath__/g,
      modulePath,
    )
    .replace(
      /__endpoint__/g,
      endpoint ?? "",
    )
    .replace(
      /__CRUD_UI__/g,
      generateCrudUi(schema),
    )
    // Kunci judul resource (`<namespace>.title`), kosong tanpa namespace.
    .replace(
      /__TITLE_KEY__/g,
      namespace ? `${namespace}.title` : "",
    )
    .replace(
      /__TABLE_CONTENT__/g,
      tableContent,
    )
    .replace(
      /__FORM_FIELDS__/g,
      formFields,
    )
    .replace(
      /__COLUMN_ITEMS__/g,
      columnItems,
    )
    .replace(
      /__RECORD_ACTIONS__/g,
      recordActions,
    )
    .replace(
      /__COLLECTION_ACTIONS__/g,
      collectionActions,
    )
    .replace(
      /__FILTER_ITEMS__/g,
      filterItems,
    )
    .replace(
      /__WORKSPACE_TABS__/g,
      workspaceTabs,
    )
    .replace(
      /__WORKSPACE_DEFAULT_TAB__/g,
      workspaceDefaultTab,
    )
    .replace(
      /__OVERVIEW_ITEMS__/g,
      overviewItems,
    )
    .replace(
      /__ROW_FIELDS__/g,
      rowFields,
    )
    .replace(
      /__PAYLOAD_FIELDS__/g,
      payloadFields,
    )
    .replace(
      /__DISPLAY_LABEL__/g,
      displayLabel,
    )
    .replace(
      /__DISPLAY_LABEL_DELETE__/g,
      displayLabelDelete,
    )
    /*
     * Import `resourceLabel` hanya dipasang kalau memang dipakai.
     * Tanpa namespace token ini jadi string kosong, dan baris
     * import-nya kembali persis seperti keluaran lama.
     */
    /*
     * Import hanya dipasang kalau berkasnya benar-benar memanggil
     * `resourceLabel(`.
     *
     * Sejak label form/filter berpindah ke `labelKey` (diresolusi saat
     * render), dua berkas itu tidak lagi memanggilnya — dan import yang
     * tidak terpakai di 90-an modul hasil generate adalah derau yang
     * muncul di tiap review.
     */
    /*
     * Placeholder kotak cari.
     *
     * Teks Inggrisnya tetap ditulis apa adanya — itu yang dipakai kalau
     * kuncinya belum ada di katalog. Yang ditambahkan cuma kuncinya,
     * supaya "Search company..." tidak jadi satu-satunya teks Inggris
     * yang tersisa di layar yang seluruh label lainnya sudah berganti.
     */
    .replace(
      /__SEARCH_PLACEHOLDER_KEY__/g,
      namespace ? `\n    placeholderKey: "${namespace}.placeholder.search",` : "",
    )
    .replace(
      /__I18N_IMPORT__/g,
      (_match, _offset, whole) =>
        namespace && /resourceLabel\(/.test(whole) ? ", resourceLabel" : "",
    )
    /*
     * `workspace.ts` tidak punya baris import dari "@framework" sama
     * sekali — isinya cuma tipe. Jadi import-nya disisipkan utuh, bukan
     * ditempelkan ke daftar yang sudah ada seperti __I18N_IMPORT__.
     */
    .replace(
      /__I18N_WORKSPACE_IMPORT__\n?/g,
      (_match, _offset, whole) =>
        namespace && /resourceLabel\(/.test(whole)
          ? '\nimport { resourceLabel } from "@framework"\n'
          : "",
    )
}

async function pathExists(
  targetPath,
) {
  try {
    await fs.access(targetPath)
    return true
  }
  catch {
    return false
  }
}

async function copyTemplateDir(
  sourceDir,
  targetDir,
  names,
  moduleImportPath,
  endpoint,
  schema,
  namespace = null,
) {
  const entries = await fs.readdir(
    sourceDir,
    {
      withFileTypes: true,
    },
  )

  for (const entry of entries) {
    const sourcePath = path.join(
      sourceDir,
      entry.name,
    )

    /*
     * Token juga diterapkan pada nama folder dan file.
     *
     * Contoh:
     *
     * __Name__Header.vue
     * menjadi:
     * EmployeesHeader.vue
     *
     * use__Name__Workspace.ts
     * menjadi:
     * useEmployeesWorkspace.ts
     */
    const outputName = replaceNameTokens(
      entry.name,
      names,
    )

    const outputPath = path.join(
      targetDir,
      outputName,
    )

    if (entry.isDirectory()) {
      await fs.mkdir(
        outputPath,
        {
          recursive: true,
        },
      )

      await copyTemplateDir(
        sourcePath,
        outputPath,
        names,
        moduleImportPath,
        endpoint,
        schema,
        namespace,
      )

      continue
    }

    if (!entry.isFile()) {
      continue
    }

    const content = await fs.readFile(
      sourcePath,
      "utf8",
    )

    const replacedContent = replaceTokens(
      content,
      names,
      moduleImportPath,
      endpoint,
      schema,
      namespace,
    )

    await fs.writeFile(
      outputPath,
      replacedContent,
      "utf8",
    )

    console.log(
      `✔ Created ${path.relative(
        process.cwd(),
        outputPath,
      )}`,
    )
  }
}


export async function generateCrud(
  name,
  options = {},
) {
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

  const moduleImportPath = pathParts.join("/")

  const schema = options.schema ?? null

  /*
   * Namespace terjemahan modul ini, atau `null`.
   *
   * `null` = perilaku lama persis: label dipancarkan sebagai literal
   * Inggris. Menyalakannya adalah keputusan sadar per modul — lihat
   * `i18n.mjs`.
   */
  const namespace = i18nNamespace(schema, options)

  resetCollectedKeys()

  const endpoint =
    options.endpoint
    ?? schema?.endpoint
    ?? `/api/${moduleImportPath}/`

  const editor =
    options.editor
    ?? schema?.ui?.editor
    ?? "dialog"

  const templateFolder =
    CRUD_TEMPLATE_FOLDERS[editor]

  if (!templateFolder) {
    const availableEditors = Object.keys(
      CRUD_TEMPLATE_FOLDERS,
    ).join(", ")

    throw new Error(
      `Unsupported CRUD editor "${editor}". `
      + `Available editors: ${availableEditors}`,
    )
  }

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
    templateFolder,
  )

  const templateExists = await pathExists(
    templatePath,
  )

  /*
   * Template yang tidak punya `actions.ts` akan MEMBUANG action yang
   * dideklarasikan schema, tanpa satu pun pesan — dan endpoint tanpa
   * tombol tidak bisa dibedakan dari fitur yang tidak ada. Hari ini
   * `crud-page` yang belum punya; peringatan ini yang membuat
   * kelalaiannya terlihat di tempat orang mencarinya, bukan enam bulan
   * kemudian saat ada yang bertanya kenapa tombolnya tidak muncul.
   */
  const declaredActions = Array.isArray(schema?.actions)
    ? schema.actions.filter(item => item?.endpoint)
    : []

  if (declaredActions.length) {
    const hasActionsFile = await pathExists(
      path.join(templatePath, "actions.ts"),
    )

    if (!hasActionsFile) {
      console.warn(
        `  ! ${declaredActions.length} action dideklarasikan schema tapi `
        + `template "${templateFolder}" tidak punya actions.ts — `
        + `tombolnya TIDAK akan dirender: `
        + declaredActions.map(item => item.key).join(", "),
      )
    }
  }

  if (!templateExists) {
    throw new Error(
      `CRUD template not found: ${path.relative(
        process.cwd(),
        templatePath,
      )}`,
    )
  }

  await fs.mkdir(
    modulePath,
    {
      recursive: true,
    },
  )

  await copyTemplateDir(
    templatePath,
    modulePath,
    names,
    moduleImportPath,
    endpoint,
    schema,
    namespace,
  )

  /*
   * Kunci yang baru dipancarkan dicetak supaya bisa langsung disalin ke
   * `app/i18n/locales/<bahasa>/<namespace>.ts`.
   *
   * Generator sengaja **tidak** menulis berkas katalognya sendiri:
   * berkas itu berisi terjemahan yang ditulis orang, dan generator yang
   * ikut menyentuhnya akan menimpa pekerjaan mereka pada regenerate
   * berikutnya. Yang dicetak di sini juga tidak wajib diisi — kunci
   * yang belum ada jatuh ke teks Inggris yang sudah tertanam di
   * argumen kedua `resourceLabel`.
   */
  const keys = collectedKeys()

  if (keys.length) {
    console.log(`
    Kunci terjemahan (${keys.length}) — namespace "${namespace}":
`)

    for (const item of keys)
      console.log(`      ${item.key} = ${JSON.stringify(item.label)}`)

    console.log("")
  }

  console.log(`
    CRUD generation complete!

    Module   : ${names.pascal}
    Entity   : ${names.camel}
    Editor   : ${editor}
    Template : ${templateFolder}
    Endpoint : ${endpoint}
    Path     : app/modules/${moduleImportPath}
    `)
}