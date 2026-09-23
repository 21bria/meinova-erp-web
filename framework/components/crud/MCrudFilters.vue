<script setup lang="ts">
import { ref, watch } from "vue"
import { Button } from "@/components/ui/button"
import {
  MDateField,
  MInputField,
  MLookupField,
  MSelectField,
  MSwitchField,
} from "@framework"
import type { CrudFilter } from "@framework"

type FilterValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined
  | string[]
  | number[]

const props = withDefaults(defineProps<{
  schema?: CrudFilter[]
  modelValue?: Record<string, FilterValue>
  variant?: "inline" | "panel"
}>(), {
  schema: () => [],
  modelValue: () => ({}),
  variant: "panel",
})

const emit = defineEmits<{
  (
    e: "update:modelValue",
    value: Record<string, FilterValue>,
  ): void
  (
    e: "apply",
    value: Record<string, FilterValue>,
  ): void
  (e: "reset"): void
}>()

const local = ref<Record<string, FilterValue>>({})

watch(
  () => props.modelValue,
  (value) => {
    local.value = {
      ...(value ?? {}),
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

function isFieldDisabled(
  item: CrudFilter,
): boolean {
  if (!item.dependsOn)
    return false

  const parentValue =
    local.value[item.dependsOn]

  return (
    parentValue === undefined
    || parentValue === null
    || parentValue === ""
  )
}

function resetDependentFilters(
  parentKey: string,
  values: Record<string, FilterValue>,
) {
  for (const item of props.schema) {
    if (item.dependsOn !== parentKey)
      continue

    values[item.key] = null

    resetDependentFilters(
      item.key,
      values,
    )
  }
}

function update(
  key: string,
  value: FilterValue,
) {
  const next: Record<string, FilterValue> = {
    ...local.value,
    [key]: value,
  }

  if (local.value[key] !== value) {
    resetDependentFilters(
      key,
      next,
    )
  }

  local.value = next

  emit("update:modelValue", next)

  if (props.variant === "inline") {
    emit("apply", next)
  }
}

function apply() {
  emit(
    "apply",
    {
      ...local.value,
    },
  )
}

function reset() {
  local.value = {}

  emit(
    "update:modelValue",
    {},
  )

  emit("reset")
}
</script>

<template>
  <div :class="variant === 'inline' ? 'flex flex-wrap items-center gap-2' : 'space-y-5'">
    <template v-for="item in schema" :key="item.key">
      <MInputField
        v-if="item.type === 'text'"
        :model-value="local[item.key] as string | number | null | undefined"
        :label="variant === 'panel' ? item.label : undefined"
        :placeholder="item.placeholder ?? item.label"
        @update:model-value="(v: string) => update(item.key, v)"
      />

      <MSelectField
        v-else-if="item.type === 'select'"
        :model-value="local[item.key] as string | number | null | undefined"
        :label="variant === 'panel' ? item.label : undefined"
        :placeholder="item.placeholder ?? item.label"
        :options="item.options ?? []"
        @update:model-value="(v: string | number | null) => update(item.key, v)"
      />

     <MLookupField
        v-else-if="item.type === 'lookup'"
        :model-value="local[item.key]"
        :label="variant === 'panel' ? item.label : undefined"
        :endpoint="item.endpoint ?? ''"
        :placeholder="item.placeholder ?? item.label"
        :disabled="isFieldDisabled(item)"
        :depends-on="item.dependsOn"
        :lookup-params="item.lookupParams"
        :form-values="local"
        @update:model-value="(v: FilterValue) => update(item.key, v)"
      />

      <MDateField
        v-else-if="item.type === 'date'"
        :model-value="local[item.key] as string | null | undefined"
        :label="variant === 'panel' ? item.label : undefined"
        :placeholder="item.placeholder ?? item.label"
        @update:model-value="(v: string | null) => update(item.key, v)"
      />

      <MSwitchField
        v-else-if="item.type === 'boolean' || item.type === 'switch'"
        :model-value="Boolean(local[item.key])"
        :label="item.label"
        @update:model-value="(v: boolean) => update(item.key, v)"
      />

      <component
        :is="item.component"
        v-else-if="item.type === 'custom' && item.component"
        v-model="local[item.key]"
        v-bind="item.props ?? {}"
      />
    </template>

    <div v-if="variant === 'panel'" class="flex justify-end gap-2 border-t pt-4">
      <Button variant="outline" type="button" @click="reset">
        Reset
      </Button>

      <Button type="button" @click="apply">
        Apply
      </Button>
    </div>
  </div>
</template>