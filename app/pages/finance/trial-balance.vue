<script setup lang="ts">
import TrialBalance from '~/modules/finance/reports/TrialBalance.vue'

definePageMeta({
  layout: 'default',
  title: 'Trial Balance',
  module: 'finance',
})

useHead({ title: 'Trial Balance' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <TrialBalance />
    </div>
  </div>
</template>
