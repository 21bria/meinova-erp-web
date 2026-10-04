<script setup lang="ts">
import Page from '~/modules/assets/assignments/page.vue'
import AssetMovementSummary from '~/modules/assets/shared/AssetMovementSummary.vue'

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
      <Page mode="edit">
        <!-- Tab `custom` "summary" schema backend: siklus, asal → tujuan, persetujuan. -->
        <template #summary="{ record }">
          <AssetMovementSummary kind="assignments" :record="record" />
        </template>
      </Page>
    </div>
  </div>
</template>
