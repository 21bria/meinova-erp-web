<script setup lang="ts">
import Page from '~/modules/assets/returns/page.vue'
import AssetMovementSummary from '~/modules/assets/shared/AssetMovementSummary.vue'

/*
 * Tujuan `register_route("assets", "asset_return", "/assets/returns/{id}")`
 * di backend — tautan dokumen dari layar workflow mendarat di sini.
 */

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
      <Page mode="detail">
        <!-- Tab `custom` "summary" schema backend: siklus, asal → tujuan, persetujuan. -->
        <template #summary="{ record }">
          <AssetMovementSummary kind="returns" :record="record" />
        </template>
      </Page>
    </div>
  </div>
</template>
