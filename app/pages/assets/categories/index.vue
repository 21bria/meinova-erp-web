<script setup lang="ts">
import Page from '~/modules/assets/categories/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Asset Categories',
  module: 'assets',
})

useHead({ title: 'Asset Categories' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page />
    </div>
  </div>
</template>
