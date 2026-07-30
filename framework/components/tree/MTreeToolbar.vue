<script setup lang="ts">
import LookupSelect from '@/components/forms/LookupSelect.vue'
import { Input } from '@/components/ui/input'
import type { TreeSchema } from '@framework'

defineProps<{
  schema?: TreeSchema
  loading?: boolean
  saving?: boolean
}>()

const query = defineModel<Record<string, any>>('query', {
  default: () => ({}),
})

defineEmits<{
  load: []
  save: []
}>()
</script>

<template>
  <div class="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4">
    <template
      v-for="(field, key) in schema?.query"
      :key="String(key)"
    >
      <LookupSelect
        v-if="field.type === 'lookup'"
        v-model="query[key]"
        :label="field.label"
        :endpoint="field.endpoint"
        :label-key="field.label_key ?? 'name'"
        :value-key="field.value_key ?? 'id'"
        variant="field"
      />
      <div v-else class="grid gap-1">
        <Input
          v-model="query[key]"
          :type="field.type === 'number' ? 'number' : 'text'"
          :placeholder="field.label"
        />
      </div>
    </template>

    <Button
      variant="outline"
      :disabled="loading"
      @click="$emit('load')"
    >
      Load Tree
    </Button>

    <Button
      :disabled="saving"
      @click="$emit('save')"
    >
      Save
    </Button>
  </div>
</template>