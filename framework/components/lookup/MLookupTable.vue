<script setup lang="ts">
import MEmpty from "../feedback/MEmpty.vue"

defineProps<{
  rows?: any[]
}>()

defineEmits<{
  (e: "select", row: any): void
}>()
</script>

<template>
  <div class="rounded-lg border">
    <MEmpty v-if="!rows?.length" :title="$t('common.state.noLookupData')" />

    <button
      v-for="row in rows"
      v-else
      :key="row.id"
      type="button"
      class="flex w-full items-center justify-between border-b px-4 py-3 text-left text-sm hover:bg-muted"
      @click="$emit('select', row)"
    >
      <span>{{ row.name ?? row.label ?? row.title }}</span>
      <span class="text-muted-foreground">{{ row.code }}</span>
    </button>
  </div>
</template>