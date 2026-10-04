// export * from "./types"
// export * from "./table"
// export * from "./columns"
// export * from "./filters"
// export * from "./form"

// // Workspace only
// export * from "./composables/useEmployeesList"
// export * from "./composables/useEmployeesDetail"
// export * from "./composables/useEmployeesWorkspace"

export * from "./types"
export * from "./table"
export * from "./columns"
export * from "./filters"
export * from "./form"
export * from "./workspace"

export * from "./composables/useEmployeesWorkspace"

export { default as EmployeesTable } from "./components/EmployeesTable.vue"
export { default as EmployeesHeader } from "./components/EmployeesHeader.vue"
export { default as EmployeesOverview } from "./components/EmployeesOverview.vue"
export { default as EmployeesTabs } from "./components/EmployeesTabs.vue"
export { default as EmployeesWorkspace } from "./components/EmployeesWorkspace.vue"
export { default as EmployeesForm } from "./components/forms/EmployeesForm.vue"
