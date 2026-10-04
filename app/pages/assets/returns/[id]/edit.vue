<script setup lang="ts">
import Page from '~/modules/assets/returns/page.vue'
import AssetMovementSummary from '~/modules/assets/shared/AssetMovementSummary.vue'

definePageMeta({
  layout: 'default',
  title: 'Asset Returns',
  module: 'assets',
})

useHead({ title: 'Asset Returns' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="edit">
        <!-- Tab `custom` "summary" schema backend: siklus, asal → tujuan, persetujuan. -->
        <template #summary="{ record }">
          <AssetMovementSummary kind="returns" :record="record" />
        </template>
      </Page>
    </div>
  </div>
</template>
