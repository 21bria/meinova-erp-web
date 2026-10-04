<script setup lang="ts">
import Page from '~/modules/payroll/payroll-run-employees/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Payroll Review',
  module: 'payroll',
})

useHead({
  title: 'Payroll Review',
})
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="list" />
    </div>
  </div>
</template>
