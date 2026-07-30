import type {
  SettingConfig,
  SettingSchema,
} from "../../core/types/setting"
import type { BuiltSetting } from "./types"

const DEFAULT_UI = {
  layout: "form" as const,
  show_header: true,
  show_save: true,
  sticky_actions: false,
  max_width: "4xl",
}

export function createSetting(
  config: SettingConfig,
  schema: SettingSchema,
): BuiltSetting {
  const ui = {
    ...DEFAULT_UI,
    ...(schema.ui ?? {}),
  }

  return {
    id: config.id,
    schema,
    endpoint: schema.endpoint,
    defaultValues: {
      ...(config.defaultValues ?? {}),
    },
    title: schema.title ?? config.id,
    description: schema.description,
    layout: ui.layout,
    showHeader: ui.show_header,
    showSave: ui.show_save,
    stickyActions: ui.sticky_actions,
    maxWidth: ui.max_width,
  }
}