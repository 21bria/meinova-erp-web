<script setup lang="ts">
import Page from '~/modules/assets/assignments/page.vue'
import AssetMovementSummary from '~/modules/assets/shared/AssetMovementSummary.vue'

/*
 * Tujuan `register_route("assets", "asset_assignment", "/assets/assignments/{id}")`
 * di backend — tautan dokumen dari layar workflow mendarat di sini.
 */

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
      <Page mode="detail">
        <!-- Tab `custom` "summary" schema backend: siklus, asal → tujuan, persetujuan. -->
        <template #summary="{ record }">
          <AssetMovementSummary kind="assignments" :record="record" />
        </template>
      </Page>
    </div>
  </div>
</template>
