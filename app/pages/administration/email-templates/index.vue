<script setup lang="ts">
import Page from "@/modules/administration/email-templates/page.vue"

definePageMeta({
  layout: 'default',
  title: 'Email Templates',
  module: 'administration',
})
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="list" />
    </div>
  </div>
</template>
