<script setup lang="ts">
import Page from '~/modules/finance/accounting-periods/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Accounting Periods',
  module: 'finance',
})

useHead({ title: 'Accounting Periods' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page />
    </div>
  </div>
</template>
