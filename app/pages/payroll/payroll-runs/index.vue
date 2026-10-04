<script setup lang="ts">
import Page from '~/modules/payroll/payroll-runs/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Payroll Run',
  module: 'payroll',
})

useHead({
  title: 'Payroll Run',
})
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="list" />
    </div>
  </div>
</template>
