<script setup lang="ts">
import type { BuiltSetting } from "../../builders/setting"

defineProps<{
  config: BuiltSetting
  modelValue: Record<string, unknown>
  loading?: boolean
  saving?: boolean
  errors?: Record<string, string[]>
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: Record<string, unknown>): void
  (e: "save"): void
  (e: "reset"): void
}>()
</script>

<template>
  <div class="space-y-6">

    <!-- Header -->
    <div
      v-if="config.showHeader"
      class="space-y-1"
    >
      <h1 class="text-2xl font-semibold">
        {{ config.title }}
      </h1>

      <p
        v-if="config.description"
        class="text-muted-foreground"
      >
        {{ config.description }}
      </p>
    </div>

    <!-- Sections -->
    <MSettingSection
        v-for="section in config.schema.sections"
        :key="section.title"
        :section="section"
        :fields="config.schema.fields ?? {}"
        :model-value="modelValue"
        :errors="errors"
        @update:model-value="emit('update:modelValue', $event)"
        />

    <!-- Actions -->
    <div
      class="flex justify-end gap-2 border-t pt-6"
      :class="{
        'sticky bottom-0 bg-background py-4': config.stickyActions,
      }"
    >
      <Button
        variant="outline"
        @click="emit('reset')"
      >
        Reset
      </Button>

      <Button
        :loading="saving"
        @click="emit('save')"
      >
        Save Changes
      </Button>
    </div>

  </div>
</template>