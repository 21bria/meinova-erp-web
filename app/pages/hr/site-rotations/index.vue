<script setup lang="ts">
import Page from "@/modules/hr/site-rotations/page.vue"

definePageMeta({
  layout: 'default',
  title: 'Site Rotations',
})
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="list" />
    </div>
  </div>
</template>
