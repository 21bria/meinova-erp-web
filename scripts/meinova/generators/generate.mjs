// scripts/meinova/generators/generate.mjs

import { generateCrud } from "./crud.mjs"
import { generateTree } from "./tree.mjs"
import { generateSetting } from "./setting.mjs"
import { generateDashboard } from "./dashboard.mjs"
import { generateImport } from "./import.mjs"
import { fetchSchema, resolveSchemaUrl } from "./schema.mjs"

export async function generateFromApi(modulePath, schemaUrl, options = {}) {
  const resolvedSchemaUrl = resolveSchemaUrl(modulePath, schemaUrl)
  const schema = await fetchSchema(resolvedSchemaUrl)

  console.log(`✔ Schema   : ${resolvedSchemaUrl}`)
  console.log(`✔ Endpoint : ${schema.endpoint}`)

  switch (schema.type) {
    case "crud":
      await generateCrud(modulePath, {
        schema,
        endpoint: schema.endpoint,
        // Namespace terjemahan dari CLI. Schema tetap menang kalau ia
        // menyebutkannya sendiri — lihat `i18nNamespace`.
        i18n: options.i18n ?? null,
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

    case "dashboard":
      // Beda dari tiga tipe di atas: endpoint datanya bukan URL schema,
      // melainkan endpoint tersendiri yang mengembalikan seluruh widget
      // sekaligus. Jadi `schema.endpoint` dipakai apa adanya.
      await generateDashboard(modulePath, {
        schema,
      })
      break

    default:
      throw new Error(`Unsupported schema type: ${schema.type}`)
  }

  /*
   * Fitur import bersifat opsional dan berdiri sendiri dari editor
   * CRUD/tree/setting. Backend menyalakannya lewat key "import"
   * pada schema module.
   */
  const generated = await generateImport(modulePath, {
    schema,
  })

  if (generated)
    console.log(`✔ Import   : ${schema.import.module}`)
}
