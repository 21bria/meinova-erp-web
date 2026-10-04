<script setup lang="ts">
import AccountLedger from '~/modules/finance/reports/AccountLedger.vue'

definePageMeta({
  layout: 'default',
  title: 'Account Ledger',
  module: 'finance',
})

useHead({ title: 'Account Ledger' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <AccountLedger />
    </div>
  </div>
</template>
