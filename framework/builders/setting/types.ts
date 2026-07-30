import type {
  SettingConfig,
  SettingField,
  SettingLayout,
  SettingSchema,
  SettingSection,
  SettingUI,
} from "../../core/types/setting"

export type {
  SettingConfig,
  SettingField,
  SettingLayout,
  SettingSchema,
  SettingSection,
  SettingUI,
}

export type BuiltSetting = {
  id: string

  schema: SettingSchema

  endpoint: string

  defaultValues: Record<string, unknown>

  title: string
  description?: string

  layout: SettingLayout

  showHeader: boolean
  showSave: boolean
  stickyActions: boolean

  maxWidth: string
}