import fs from "node:fs/promises"
import path from "node:path"
import {
  camelCase,
  kebabCase,
  pascalCase,
  snakeCase,
} from "../utils/strings.mjs"

function replaceTokens(content, names, modulePath, endpoint, schema) {
  return content
    .replace(/__Name__/g, names.pascal)
    .replace(/__name__/g, names.camel)
    .replace(/__camelName__/g, names.camel)
    .replace(/__id__/g, names.kebab)
    .replace(/__kebab__/g, names.kebab)
    .replace(/__Pascal__/g, names.pascal)
    .replace(/__Camel__/g, names.camel)
    .replace(/__Kebab__/g, names.kebab)
    .replace(/__Snake__/g, names.snake)
    .replace(/__modulePath__/g, modulePath)
    .replace(/__endpoint__/g, endpoint ?? "")
    .replace(/__title__/g, schema?.title ?? names.pascal)
    .replace(/__description__/g, schema?.description ?? "")
}

async function copyTemplateDir(
  sourceDir,
  targetDir,
  names,
  moduleImportPath,
  endpoint,
  schema,
) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name)

    if (entry.isDirectory()) {
      const nextTarget = path.join(targetDir, entry.name)
      await fs.mkdir(nextTarget, { recursive: true })

      await copyTemplateDir(
        sourcePath,
        nextTarget,
        names,
        moduleImportPath,
        endpoint,
        schema,
      )

      continue
    }

    const content = await fs.readFile(sourcePath, "utf8")
    const replacedContent = replaceTokens(
      content,
      names,
      moduleImportPath,
      endpoint,
      schema,
    )

    const outputName = entry.name
      .replace(/__Name__/g, names.pascal)
      .replace(/__name__/g, names.camel)
      .replace(/__kebab__/g, names.kebab)
      .replace(/__Pascal__/g, names.pascal)
      .replace(/__Camel__/g, names.camel)
      .replace(/__Kebab__/g, names.kebab)
      .replace(/__Snake__/g, names.snake)

    const outputPath = path.join(targetDir, outputName)

    await fs.writeFile(outputPath, replacedContent, "utf8")

    console.log(`✔ Created ${path.relative(process.cwd(), outputPath)}`)
  }
}

export async function generateSetting(name, options = {}) {
  const rawPath = String(name ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "")

  const pathParts = rawPath.split("/").filter(Boolean)
  const entity = pathParts.at(-1)

  if (!entity) {
    throw new Error("Module name required")
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
    options.endpoint ??
    schema?.endpoint ??
    `/api/${moduleImportPath}/`

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
    "setting",
  )

  await fs.mkdir(modulePath, { recursive: true })

  await copyTemplateDir(
    templatePath,
    modulePath,
    names,
    moduleImportPath,
    endpoint,
    schema,
  )

  console.log(`
    Setting generation complete!
    Module : ${names.pascal}
    Entity : ${names.camel}
    Path   : app/modules/${moduleImportPath}
  `)
}

export default generateSetting