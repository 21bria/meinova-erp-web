<script setup lang="ts">
import AssetMovementSummary from '~/modules/assets/shared/AssetMovementSummary.vue'
import Page from '~/modules/assets/transfers/page.vue'

/*
 * Tujuan `register_route("assets", "asset_transfer", "/assets/transfers/{id}")`
 * di backend — tautan dokumen dari layar workflow mendarat di sini.
 */

definePageMeta({
  layout: 'default',
  title: 'Asset Transfers',
  module: 'assets',
})

useHead({ title: 'Asset Transfers' })
</script>

<template>
  <div class="px-6 py-0">
    <div class="w-full space-y-4">
      <Page mode="detail">
        <!-- Tab `custom` "summary" schema backend: siklus, asal → tujuan, persetujuan. -->
        <template #summary="{ record }">
          <AssetMovementSummary kind="transfers" :record="record" />
        </template>
      </Page>
    </div>
  </div>
</template>
