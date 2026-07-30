#!/usr/bin/env node
import { generateFromApi } from "./generators/generate.mjs"
import { generateCrud } from "./generators/crud.mjs"

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
  pnpm meinova make:crud <module>
  pnpm meinova generate <module>

Examples:
  pnpm meinova make:crud administration/organization/company
  pnpm meinova generate administration/organization/company
  `)
  process.exit(0)
}

switch (command) {
  case "make:crud":
    if (!name) {
      console.error("Module name required")
      process.exit(1)
    }

    await generateCrud(name)
    break

  case "generate": {
    if (!name) {
      console.error("Module name required")
      process.exit(1)
    }

    const schemaUrl = getArg("schema-url")

    await generateFromApi(name, schemaUrl)
    break
  }

  default:
    console.error(`Unknown command: ${command}`)
}