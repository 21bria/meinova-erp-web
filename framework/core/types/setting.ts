// framework/core/types/setting.ts

/*
|--------------------------------------------------------------------------
| Setting Field
|--------------------------------------------------------------------------
*/

export type SettingLayout = "form" | "tabs" | "cards"

export interface SettingField {
  name: string

  type:
    | "text"
    | "textarea"
    | "number"
    | "email"
    | "password"
    | "url"
    | "tel"
    | "switch"
    | "checkbox"
    | "select"
    | "lookup"
    | "date"
    | "datetime"
    | "time"
    | "color"

  label: string

  placeholder?: string
  description?: string
  help?: string

  required?: boolean
  readonly?: boolean
  disabled?: boolean

  visible?: boolean
  visible_when?: string

  default?: unknown

  options?: {
    label: string
    value: unknown
  }[]

  endpoint?: string
  label_key?: string
  value_key?: string

  col_span?: number
}

/*
|--------------------------------------------------------------------------
| Setting Section
|--------------------------------------------------------------------------
*/

export interface SettingSection {
  title: string

  description?: string

  columns?: 1 | 2 | 3 | 4

  fields: SettingField[]
}

/*
|--------------------------------------------------------------------------
| Setting UI
|--------------------------------------------------------------------------
*/

export interface SettingUI {
  layout?: SettingLayout

  show_header?: boolean
  show_save?: boolean
  sticky_actions?: boolean

  max_width?: string
}

/*
|--------------------------------------------------------------------------
| Setting Schema
|--------------------------------------------------------------------------
*/

export interface SettingSchema {
  title: string
  description?: string
  endpoint: string
  ui?: SettingUI
  sections: SettingSection[]
  fields: Record<string, SettingField>
}

/*
|--------------------------------------------------------------------------
| Setting Config
|--------------------------------------------------------------------------
*/

export interface SettingConfig {
  id: string

  endpoint: string

  defaultValues?: Record<string, unknown>
}