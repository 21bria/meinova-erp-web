// framework/core/utils/setting.ts

import type {
  SettingField,
  SettingSchema,
  SettingSection,
} from "../types/setting"

/*
|--------------------------------------------------------------------------
| Get All Fields
|--------------------------------------------------------------------------
*/

export function getSettingFields(
  schema: SettingSchema,
): SettingField[] {
  return schema.sections.flatMap(section => section.fields)
}

/*
|--------------------------------------------------------------------------
| Find Field
|--------------------------------------------------------------------------
*/

export function findSettingField(
  schema: SettingSchema,
  name: string,
): SettingField | undefined {
  return getSettingFields(schema).find(field => field.name === name)
}

/*
|--------------------------------------------------------------------------
| Get Section
|--------------------------------------------------------------------------
*/

export function findSettingSection(
  schema: SettingSchema,
  title: string,
): SettingSection | undefined {
  return schema.sections.find(section => section.title === title)
}

/*
|--------------------------------------------------------------------------
| Build Default Values
|--------------------------------------------------------------------------
*/

export function buildSettingDefaults(
  schema: SettingSchema,
): Record<string, any> {
  const values: Record<string, any> = {}

  for (const field of getSettingFields(schema)) {
    values[field.name] = field.default ?? null
  }

  return values
}

/*
|--------------------------------------------------------------------------
| Merge Values
|--------------------------------------------------------------------------
*/

export function mergeSettingValues(
  schema: SettingSchema,
  values?: Record<string, any>,
): Record<string, any> {
  return {
    ...buildSettingDefaults(schema),
    ...(values ?? {}),
  }
}

/*
|--------------------------------------------------------------------------
| Visible Fields
|--------------------------------------------------------------------------
*/

export function getVisibleFields(
  schema: SettingSchema,
): SettingField[] {
  return getSettingFields(schema).filter(field => field.visible !== false)
}