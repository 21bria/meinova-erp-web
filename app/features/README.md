# Master Hub

Reusable feature for displaying categorized master-data modules.

## Responsibilities

- Search master modules
- Filter by category
- Sort categories and items
- Display empty state
- Navigate to generated CRUD pages
- Support disabled and external items

## Usage

```vue
<script setup lang="ts">
import { MasterHub } from '~/features/master-hub'

import {
  payrollMasterCategories,
  payrollMasterItems,
} from '~/registry/master-hub/payroll'
</script>

<template>
  <MasterHub
    title="Payroll Master Hub"
    description="Browse and manage all payroll master data."
    search-placeholder="Search payroll masters"
    :categories="payrollMasterCategories"
    :items="payrollMasterItems"
  />
</template>