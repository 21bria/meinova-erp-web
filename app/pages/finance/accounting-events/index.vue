<script setup lang="ts">
import Page from '~/modules/finance/accounting-events/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Accounting Events',
  module: 'finance',
})

useHead({ title: 'Accounting Events' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="list" />
    </div>
  </div>
</template>
