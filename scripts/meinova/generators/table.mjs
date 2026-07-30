export function renderTable(name, schema) {
  const endpoint = schema.endpoint ?? ""

  return `export const ${name}Config = {
  id: "${name}",
  endpoint: "${endpoint}",
  defaultQuery: {},
}\n`
}