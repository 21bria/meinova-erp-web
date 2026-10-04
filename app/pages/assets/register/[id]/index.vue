<script setup lang="ts">
import AssetConditionHistory from '~/modules/assets/register/detail/AssetConditionHistory.vue'
import AssetCustodyHistory from '~/modules/assets/register/detail/AssetCustodyHistory.vue'
import AssetDocuments from '~/modules/assets/register/detail/AssetDocuments.vue'
import AssetOverview from '~/modules/assets/register/detail/AssetOverview.vue'
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
      <Page mode="detail">
        <!--
        | Tab `custom` schema backend. Ditulis di rute, bukan di module:
        | `app/modules/assets/register/` ditimpa setiap regenerate.
        -->
        <template #overview="{ record }">
          <AssetOverview :record="record" />
        </template>

        <template #custody_history="{ record, recordId }">
          <AssetCustodyHistory :record="record" :record-id="recordId" />
        </template>

        <template #condition_history="{ record, recordId }">
          <AssetConditionHistory :record="record" :record-id="recordId" />
        </template>

        <template #documents="{ record, recordId }">
          <AssetDocuments :record="record" :record-id="recordId" />
        </template>
      </Page>
    </div>
  </div>
</template>
