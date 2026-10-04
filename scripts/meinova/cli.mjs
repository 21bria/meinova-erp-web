#!/usr/bin/env node
import { generateFromApi } from "./generators/generate.mjs"
import { generateCrud } from "./generators/crud.mjs"
import { generateImport } from "./generators/import.mjs"
import { fetchSchema, resolveSchemaUrl } from "./generators/schema.mjs"

const [, , command, name] = process.argv

function getArg(name) {
  const prefix = `--${name}=`
  const found = process.argv.find(arg => arg.startsWith(prefix))
  return found ? found.slice(prefix.length) : null
}

if (!command) {
  console.log(`
Meinova Framework CLI

Usage:
  pnpm meinova make:crud <module> [--i18n=<namespace>]
  pnpm meinova generate <module> [--i18n=<namespace>]
  pnpm meinova generate:import <module>

Examples:
  pnpm meinova make:crud administration/organization/company
  pnpm meinova generate administration/organization/company
  pnpm meinova generate hr/employees --i18n=hr.employees
  pnpm meinova generate:import hr/employees

Catatan --i18n:
  Label kolom/form/filter dipancarkan sebagai resourceLabel("<ns>.fields.<field>", "English")
  alih-alih literal Inggris. Tanpa flag ini keluarannya sama persis
  seperti sebelumnya. Kunci yang belum ada di katalog jatuh ke teks
  Inggris di argumen kedua, jadi modul tetap benar sebelum
  diterjemahkan. Backend juga bisa menyetelnya lewat i18n.namespace
  pada schema, dan nilai dari schema menang atas flag ini.
  `)
  process.exit(0)
}

switch (command) {
  case "make:crud":
    if (!name) {
      console.error("Module name required")
      process.exit(1)
    }

    await generateCrud(name, { i18n: getArg("i18n") })
    break

  case "generate": {
    if (!name) {
      console.error("Module name required")
      process.exit(1)
    }

    const schemaUrl = getArg("schema-url")

    await generateFromApi(name, schemaUrl, { i18n: getArg("i18n") })
    break
  }

  case "generate:import": {
    if (!name) {
      console.error("Module name required")
      process.exit(1)
    }

    const resolvedUrl = resolveSchemaUrl(
      name,
      getArg("schema-url"),
    )

    const schema = await fetchSchema(resolvedUrl)

    const generated = await generateImport(name, { schema })

    if (!generated) {
      console.error(
        `Module "${name}" tidak mengaktifkan fitur import. `
        + `Tambahkan key "import" pada schema backend-nya.`,
      )

      process.exit(1)
    }

    break
  }

  default:
    console.error(`Unknown command: ${command}`)
}