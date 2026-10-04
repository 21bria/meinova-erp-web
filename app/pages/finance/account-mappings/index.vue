<script setup lang="ts">
import Page from '~/modules/finance/account-mappings/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Account Mapping',
  module: 'finance',
})

useHead({ title: 'Account Mapping' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page />
    </div>
  </div>
</template>
