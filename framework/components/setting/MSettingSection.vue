<script setup lang="ts">
import { computed } from "vue"

import type {
  SettingField,
  SettingSection,
} from "../../core/types/setting"
import { createForm } from "../../builders/forms"
import type { FormField } from "../../builders/forms"

const props = defineProps<{
  section: SettingSection
  fields: Record<string, SettingField>
  modelValue: Record<string, unknown>
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{
  (
    event: "update:modelValue",
    value: Record<string, unknown>,
  ): void
}>()

const model = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
})

function resolveFormFieldType(
  type: SettingField["type"],
): FormField["type"] {
  switch (type) {
    case "url":
    case "tel":
    case "color":
    case "time":
      return "text"

    case "datetime":
      return "date"

    default:
      return type
  }
}

const sectionFields = computed<SettingField[]>(() => {
  return props.section.fields
    .map((item) => {
      if (typeof item === "string")
        return props.fields[item]

      return item
    })
    .filter((item): item is SettingField => Boolean(item))
})

const formSchema = computed(() => {
  const fields: FormField[] = sectionFields.value.map(field => ({
    ...field,
    key: field.name,
    type: resolveFormFieldType(field.type),
  }))

  return createForm(fields, {
    columns: props.section.columns ?? 2,
  })
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-base">
        {{ section.title }}
      </CardTitle>

      <CardDescription v-if="section.description">
        {{ section.description }}
      </CardDescription>
    </CardHeader>

    <CardContent>
      <MFormBuilder
        v-model="model"
        :schema="formSchema"
        :errors="errors"
      />
    </CardContent>
  </Card>
</template>