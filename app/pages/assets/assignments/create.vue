<script setup lang="ts">
import Page from '~/modules/assets/assignments/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Asset Assignments',
  module: 'assets',
})

useHead({ title: 'Asset Assignments' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="create" />
    </div>
  </div>
</template>
