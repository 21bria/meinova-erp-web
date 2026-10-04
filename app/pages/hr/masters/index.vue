<script setup lang="ts">
import { MasterHub } from '~/features/master-hub'

import {
  hrMasterCategories,
  hrMasterItems,
} from '~/registry/master-hub/hr'

definePageMeta({
  title: 'HR Masters',
  module: 'hr',
})

useHead({
  title: 'HR Masters',
})
</script>

<template>
  <div class="p-4 md:p-6">
    <MasterHub
      title="HR Master Hub"
      description="Kelola seluruh master dan kebijakan HR."
      search-placeholder="Cari master HR"
      :categories="hrMasterCategories"
      :items="hrMasterItems"
    />
  </div>
</template>
