<script setup lang="ts">
import Page from "@/modules/hr/roster-adjustments/page.vue"

definePageMeta({
  layout: 'default',
  title: 'Roster Adjustment',
  module: 'hr',
})
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="list" />
    </div>
  </div>
</template>
