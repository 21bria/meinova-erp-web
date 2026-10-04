<script setup lang="ts">
import Page from '~/modules/finance/fiscal-years/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Fiscal Years',
  module: 'finance',
})

useHead({ title: 'Fiscal Years' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page />
    </div>
  </div>
</template>
