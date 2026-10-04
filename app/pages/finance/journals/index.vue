<script setup lang="ts">
import Page from '~/modules/finance/journals/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Journals',
  module: 'finance',
})

useHead({ title: 'Journals' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="list" />
    </div>
  </div>
</template>
