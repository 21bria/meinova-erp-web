import type { FormField } from "./types"

export type FormColumns = 1 | 2 | 3 | 4

export type FormConfig = {
  columns?: FormColumns
}

export type FormSchema = FormField[] & {
  columns?: FormColumns
  config?: FormConfig
}

export function createForm(
  fields: FormField[],
  config: FormConfig = {},
): FormSchema {
  const schema = fields.filter(item => item.visible !== false) as FormSchema

  schema.columns = config.columns ?? 2
  schema.config = {
    columns: schema.columns,
  }

  return schema
}