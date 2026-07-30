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
) {
  const tableContent = schema
    ? renderTable(names.camel, schema)
    : ""

  const formFields = schema
    ? generateFormFields(schema)
    : ""

  const columnItems = schema
    ? generateColumnItems(schema)
    : ""

  const filterItems = schema
    ? generateFilterItems(schema)
    : ""

  const workspaceTabs = schema
    ? generateWorkspaceTabs(schema)
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
  )

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