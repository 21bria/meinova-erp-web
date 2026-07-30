<script setup lang="ts">
import { MasterHub } from '~/features/master-hub'

import {
  payrollMasterCategories,
  payrollMasterItems,
} from '~/registry/master-hub/payroll'

definePageMeta({
  title: 'Payroll Masters',
  module: 'payroll',
})

useHead({
  title: 'Payroll Masters',
})
</script>

<template>
  <div class="p-4 md:p-6">
    <MasterHub
      title="Payroll Master Hub"
      description="Browse and manage all payroll master data."
      search-placeholder="Search payroll masters"
      :categories="payrollMasterCategories"
      :items="payrollMasterItems"
    />
  </div>
</template>