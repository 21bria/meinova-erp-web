// scripts/meinova/generators/generate.mjs

import { generateCrud } from "./crud.mjs"
import { generateTree } from "./tree.mjs"
import { generateSetting } from "./setting.mjs"
import { fetchSchema, resolveSchemaUrl } from "./schema.mjs"

export async function generateFromApi(modulePath, schemaUrl) {
  const resolvedSchemaUrl = resolveSchemaUrl(modulePath, schemaUrl)
  const schema = await fetchSchema(resolvedSchemaUrl)

  console.log(`✔ Schema   : ${resolvedSchemaUrl}`)
  console.log(`✔ Endpoint : ${schema.endpoint}`)

  switch (schema.type) {
    case "crud":
      await generateCrud(modulePath, {
        schema,
        endpoint: schema.endpoint,
      })
      break

    case "tree": {
      const endpoint = new URL(resolvedSchemaUrl).pathname
      await generateTree(modulePath, {
        schema,
        endpoint,
      })
      break
    }

    case "setting": {
      const endpoint = new URL(resolvedSchemaUrl).pathname
      await generateSetting(modulePath, {
        schema,
        endpoint,
      })
      break
    }

    default:
      throw new Error(`Unsupported schema type: ${schema.type}`)
  }
}
