<script setup lang="ts">
import Page from '~/modules/assets/register/page.vue'

definePageMeta({
  layout: 'default',
  title: 'Asset Register',
  module: 'assets',
})

useHead({ title: 'Asset Register' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="create" />
    </div>
  </div>
</template>
