import { computed, onMounted, ref } from "vue"

import { useApi } from "@/composables/useApi"
import { useNotify } from "@/composables/useNotify"

import { createSetting } from "../../builders/setting/createSetting"

import type {
  SettingConfig,
  SettingSchema,
} from "../types/setting"

function cloneValues(
  value: Record<string, unknown>,
): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value))
}

export function useSetting(config: SettingConfig) {
  const { request } = useApi()
  const notify = useNotify()

  const schema = ref<SettingSchema | null>(null)

  const values = ref<Record<string, unknown>>({
    ...(config.defaultValues ?? {}),
  })

  const initialValues = ref<Record<string, unknown>>({})
  const errors = ref<Record<string, string[]>>({})

  const loading = ref(false)
  const saving = ref(false)

  const setting = computed(() => {
    if (!schema.value)
      return null

    return createSetting(config, schema.value)
  })

  async function loadSchema() {
    schema.value = await request<SettingSchema>(
      config.endpoint,
      {
        method: "GET",
      },
    )
  }

  async function loadValues() {
    if (!schema.value?.endpoint)
      return

    const response = await request<Record<string, unknown>>(
      schema.value.endpoint,
      {
        method: "GET",
      },
    )

    values.value = {
      ...(config.defaultValues ?? {}),
      ...(response ?? {}),
    }

    initialValues.value = cloneValues(values.value)
  }

  async function load() {
    loading.value = true
    errors.value = {}

    try {
      await loadSchema()
      await loadValues()
    }
    catch (error: any) {
      notify.error(
        error?.data?.detail
        || error?.message
        || "Failed to load settings",
      )
    }
    finally {
      loading.value = false
    }
  }

  async function save(
    payload: Record<string, unknown> = values.value,
  ) {
    if (!schema.value?.endpoint)
      return

    saving.value = true
    errors.value = {}

    try {
      const response = await request<Record<string, unknown>>(
        schema.value.endpoint,
        {
          method: "PATCH",
          body: payload,
        },
      )
      values.value = {
        ...values.value,
        ...(response ?? {}),
      }
      initialValues.value = cloneValues(values.value)
      notify.success("Settings saved")
    }
    catch (error: any) {
      const responseErrors = error?.data ?? {}
      errors.value = Object.fromEntries(
        Object.entries(responseErrors).map(([key, value]) => [
          key,
          Array.isArray(value)? value.map(String):[String(value)],
        ]),

      )
      notify.error(
        error?.data?.detail
        || error?.message
        || "Please check the highlighted fields",
      )
      throw error
    }
    finally {
      saving.value = false
    }
  }

  function reset() {
    values.value = cloneValues(initialValues.value)
    errors.value = {}
  }

  onMounted(load)

  return {
    schema,
    setting,
    values,
    data: values,
    errors,
    loading,
    saving,

    load,
    save,
    reset,
  }
}