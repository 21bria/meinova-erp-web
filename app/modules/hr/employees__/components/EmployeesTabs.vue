<script setup lang="ts">
import { ref } from "vue"

import type { EmployeesRow } from "../types"

type WorkspaceMode =
  | "create"
  | "edit"
  | "detail"

defineProps<{
  mode: WorkspaceMode
  record?: EmployeesRow | null
}>()

const activeTab = ref("general")
</script>

<template>
  <div class="rounded-lg border bg-background">
    <div class="flex items-center gap-1 border-b px-4">
      <button type="button" class="border-b-2 px-4 py-3 text-sm font-medium" :class="activeTab === 'general'
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground'
        " @click="activeTab = 'general'">
        General
      </button>

      <button type="button" class="border-b-2 px-4 py-3 text-sm font-medium" :class="activeTab === 'organization'
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground'
        " @click="activeTab = 'organization'">
        Organization
      </button>

      <button type="button" class="border-b-2 px-4 py-3 text-sm font-medium" :class="activeTab === 'employment'
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground'
        " @click="activeTab = 'employment'">
        Employment
      </button>

      <button type="button" class="border-b-2 px-4 py-3 text-sm font-medium" :class="activeTab === 'payroll'
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground'
        " @click="activeTab = 'payroll'">
        Payroll
      </button>
    </div>
  </div>
</template>