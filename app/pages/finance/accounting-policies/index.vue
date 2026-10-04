<script setup lang="ts">
import Page from '~/modules/finance/accounting-policies/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Accounting Policies',
  module: 'finance',
})

useHead({ title: 'Accounting Policies' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="list" />
    </div>
  </div>
</template>
