<script setup lang="ts">
import type { FormField } from "@framework"

import MInputField from "./MInputField.vue"
import MEmailField from "./MEmailField.vue"
import MPasswordField from "./MPasswordField.vue"
import MTextareaField from "./MTextareaField.vue"
import MNumberField from "./MNumberField.vue"
import MSelectField from "./MSelectField.vue"
import MMultiSelectField from "./MMultiSelectField.vue"
import MLookupField from "./MLookupField.vue"
import MSwitchField from "./MSwitchField.vue"
import MCheckboxField from "./MCheckboxField.vue"
import MDateField from "./MDateField.vue"

const props = withDefaults(defineProps<{
  modelValue: Record<string, any>
  schema: FormField[]
  errors?: Record<string, any> | null
  mode?: "create" | "edit"
  disabled?: boolean
}>(), {
  errors: null,
  mode: "create",
  disabled: false,
})

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, any>): void
}>()

function fieldError(key: string) {
  const e = props.errors?.[key]
  return Array.isArray(e) ? e[0] : e ?? null
}

function isRequired(field: FormField) {
  if (field.requiredOnCreate && props.mode === "create") return true
  return field.required === true
}

function gridClass() {
  const columns = (props.schema as any).columns ?? 2

  if (columns === 1)
    return "grid w-full grid-cols-1 gap-4"

  if (columns === 3)
    return "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"

  if (columns === 4)
    return "grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"

  return "grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
}

function fieldColClass(field: FormField) {
  if (field.layout === "full")
    return "min-w-0 sm:col-span-full"

  return "min-w-0"
}

function gridFields() {
  return props.schema.filter(item =>
    item.type !== "textarea"
    && item.layout !== "full"
    && item.type !== "switch"
    && item.type !== "checkbox",
  )
}

function fullWidthFields() {
  return props.schema.filter(item =>
    item.type === "textarea" || item.layout === "full",
  )
}

function footerFields() {
  return props.schema.filter(item =>
    item.type === "switch" || item.type === "checkbox",
  )
}

function dependencyKeys(field: FormField): string[] {
  if (!field.dependsOn)
    return []

  return Array.isArray(field.dependsOn)
    ? field.dependsOn
    : [field.dependsOn]
}

function update(key: string, value: any) {
  const nextValue = {
    ...props.modelValue,
    [key]: value,
  }

  for (const field of props.schema) {
    if (dependencyKeys(field).includes(key)) {
      nextValue[field.key] = null
    }
  }

  emit("update:modelValue", nextValue)
}

function isFieldDisabled(field: FormField) {
  if (props.disabled || field.disabled)
    return true

  const dependencies = dependencyKeys(field)

  if (dependencies.length === 0)
    return false

  return dependencies.some((key) => {
    const parentValue = props.modelValue[key]

    return (
      parentValue === undefined
      || parentValue === null
      || parentValue === ""
    )
  })
}

function resolveLookupDepends(field: FormField) {
  const result: Record<string, any> = {}

  for (const [param, rawValue] of Object.entries(
    field.lookupParams ?? {},
  )) {
    if (
      typeof rawValue === "string"
      && rawValue.startsWith("$")
    ) {
      const parentKey = rawValue.slice(1)
      const parentValue = props.modelValue[parentKey]

      if (
        parentValue !== undefined
        && parentValue !== null
        && parentValue !== ""
      ) {
        result[param] = parentValue
      }

      continue
    }

    result[param] = rawValue
  }

  return result
}
</script>

<template>
  <div :class="gridClass()">
    <!-- <template v-for="item in gridFields()" :key="item.key">
      <div :class="fieldColClass(item)"> -->
    <template v-for="item in gridFields()" :key="item.key">
      <div
        :class="fieldColClass(item)"
        :data-field-key="item.key"
      >  
        <slot
          :name="`field-${item.key}`"
          :field="item"
          :model="modelValue"
          :error="fieldError(item.key)"
          :update="(v: any) => update(item.key, v)"
        >
          <component
            :is="item.component"
            v-if="item.type === 'custom' && item.component"
            v-bind="item.props ?? {}"
            :model-value="modelValue[item.key]"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v: any) => update(item.key, v)"
          />

          <MInputField
            v-else-if="item.type === 'text'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />

          <MEmailField
            v-else-if="item.type === 'email'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />

          <MPasswordField
            v-else-if="item.type === 'password'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />

          <MNumberField
            v-else-if="item.type === 'number'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />

         <MSelectField
            v-else-if="
              item.type === 'select'
              && !item.multiple
            "
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :options="item.options ?? []"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MMultiSelectField
            v-else-if="
              item.type === 'select'
              && item.multiple
            "
            :model-value="
              Array.isArray(modelValue[item.key])
                ? modelValue[item.key]
                : []
            "
            :label="item.label"
            :placeholder="item.placeholder"
            :options="item.options ?? []"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="
              update(item.key, $event)
            "
          />

          <MLookupField
            v-else-if="item.type === 'lookup'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :endpoint="item.endpoint ?? ''"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="isFieldDisabled(item)"
            :error="fieldError(item.key)"
            :depends="resolveLookupDepends(item)"
            @update:model-value="update(item.key, $event)"
          />
          
          <MDateField
            v-else-if="item.type === 'date'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />
        </slot>
      </div>
    </template>
  </div>

  <div class="mt-4 space-y-4">
    <!-- <template v-for="item in fullWidthFields()" :key="item.key">
      <div :class="fieldColClass(item)"> -->
    <template v-for="item in fullWidthFields()" :key="item.key">
      <div
        :class="fieldColClass(item)"
        :data-field-key="item.key"
      >    
        <slot
          :name="`field-${item.key}`"
          :field="item"
          :model="modelValue"
          :error="fieldError(item.key)"
          :update="(v: any) => update(item.key, v)"
        >
          <component
            :is="item.component"
            v-if="item.type === 'custom' && item.component"
            v-bind="item.props ?? {}"
            :model-value="modelValue[item.key]"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v: any) => update(item.key, v)"
          />

          <MTextareaField
            v-else-if="item.type === 'textarea'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :rows="(item as any).rows"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />

          <MInputField
            v-else-if="item.type === 'text'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />

          <MEmailField
            v-else-if="item.type === 'email'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />

          <MPasswordField
            v-else-if="item.type === 'password'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />

          <MNumberField
            v-else-if="item.type === 'number'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />

          <MSelectField
            v-else-if="item.type === 'select'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :options="item.options ?? []"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />

         <MLookupField
            v-else-if="item.type === 'lookup'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :endpoint="item.endpoint ?? ''"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="isFieldDisabled(item)"
            :error="fieldError(item.key)"
            :depends="resolveLookupDepends(item)"
            @update:model-value="update(item.key, $event)"
          />
          
          <MDateField
            v-else-if="item.type === 'date'"
            :model-value="modelValue[item.key]"
            :label="item.label"
            :placeholder="item.placeholder"
            :required="isRequired(item)"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />
        </slot>
      </div>
    </template>
  </div>

  <div class="mt-4 space-y-3">
    <!-- <template v-for="item in footerFields()" :key="item.key">
      <div :class="fieldColClass(item)"> -->
      <template v-for="item in footerFields()" :key="item.key">
        <div
          :class="fieldColClass(item)"
          :data-field-key="item.key"
        >
        <slot
          :name="`field-${item.key}`"
          :field="item"
          :model="modelValue"
          :error="fieldError(item.key)"
          :update="(v: any) => update(item.key, v)"
        >
          <component
            :is="item.component"
            v-if="item.type === 'custom' && item.component"
            v-bind="item.props ?? {}"
            :model-value="modelValue[item.key]"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v: any) => update(item.key, v)"
          />

          <MSwitchField
            v-else-if="item.type === 'switch'"
            :model-value="Boolean(modelValue[item.key])"
            :label="item.label"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />

          <MCheckboxField
            v-else-if="item.type === 'checkbox'"
            :model-value="Boolean(modelValue[item.key])"
            :label="item.label"
            :disabled="disabled || item.disabled"
            :error="fieldError(item.key)"
            @update:model-value="(v) => update(item.key, v)"
          />
        </slot>
      </div>
    </template>
  </div>
</template>