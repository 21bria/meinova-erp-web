<script setup lang="ts">
import Page from '~/modules/finance/accounting-dimensions/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Accounting Dimensions',
  module: 'finance',
})

useHead({ title: 'Accounting Dimensions' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page />
    </div>
  </div>
</template>
