<script setup lang="ts">
import Page from '@/modules/hr/business-trips/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Business Trips',
})
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="list" />
    </div>
  </div>
</template>
