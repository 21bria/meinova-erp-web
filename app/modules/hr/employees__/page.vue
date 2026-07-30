<script setup lang="ts">
import { ref } from "vue"

import EmployeesForm from "./components/EmployeesForm.vue"
import EmployeesHeader from "./components/EmployeesHeader.vue"
import EmployeesOverview from "./components/EmployeesOverview.vue"
import EmployeesTable from "./components/EmployeesTable.vue"
import EmployeesTabs from "./components/EmployeesTabs.vue"

import type {
  EmployeesPayload,
  EmployeesRow,
} from "./types"

type WorkspaceMode =
  | "list"
  | "create"
  | "edit"
  | "detail"

const mode = ref<WorkspaceMode>("list")
const selectedEmployee = ref<EmployeesRow | null>(null)
const submitting = ref(false)
const errors = ref<Record<string, any> | null>(null)

function openCreate() {
  selectedEmployee.value = null
  errors.value = null
  mode.value = "create"
}

function openEdit(row: EmployeesRow) {
  selectedEmployee.value = row
  errors.value = null
  mode.value = "edit"
}

function openDetail(row: EmployeesRow) {
  selectedEmployee.value = row
  mode.value = "detail"
}

function closeEditor() {
  selectedEmployee.value = null
  errors.value = null
  mode.value = "list"
}

async function handleSubmit(
  payload: EmployeesPayload,
) {
  submitting.value = true
  errors.value = null

  try {
    if (mode.value === "create") {
      // await employeeService.create(payload)
    }

    if (
      mode.value === "edit"
      && selectedEmployee.value?.id != null
    ) {
      // await employeeService.update(
      //   selectedEmployee.value.id,
      //   payload,
      // )
    }

    closeEditor()
  }
  catch (error: any) {
    errors.value =
      error?.data
      ?? error?.response?._data
      ?? {
        non_field_errors: [
          "Failed to save employee.",
        ],
      }
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- LIST -->
    <EmployeesTable
      v-if="mode === 'list'"
      @create="openCreate"
      @edit="openEdit"
      @select="openDetail"
    />

    <!-- WORKSPACE: CREATE / DETAIL / EDIT -->
    <template v-else>
      <EmployeesHeader
        :record="selectedEmployee"
        :mode="mode"
        @back="closeEditor"
        @edit="
          selectedEmployee
            ? openEdit(selectedEmployee)
            : undefined
        "
      />

      <EmployeesOverview
        v-if="mode !== 'create' && selectedEmployee"
        :record="selectedEmployee"
      />

      <EmployeesTabs
        :record="selectedEmployee"
        :mode="mode"
      />

      <EmployeesForm
        v-if="mode === 'create' || mode === 'edit'"
        :mode="mode"
        :initial="selectedEmployee"
        :loading="submitting"
        :errors="errors"
        @cancel="closeEditor"
        @submit="handleSubmit"
      />
    </template>
  </div>
</template>