<script setup lang="ts">
import TaxBracketPage from '~/modules/payroll/tax-brackets/page.vue'

definePageMeta({
  title: 'Tax Brackets',
  module: 'payroll',
})

useHead({
  title: 'Tax Brackets',
})
</script>

<template>
  <TaxBracketPage />
</template>
