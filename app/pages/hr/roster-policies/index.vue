<script setup lang="ts">
import Page from "@/modules/hr/roster-policies/page.vue"

definePageMeta({
  layout: 'default',
  title: 'Roster Policies',
})
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="list" />
    </div>
  </div>
</template>
