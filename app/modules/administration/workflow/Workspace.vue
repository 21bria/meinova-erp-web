<script setup lang="ts">
import WorkflowDefinition from "./definitions/page.vue"
import WorkflowStep from "./steps/page.vue"
import WorkflowInstance from "./instances/page.vue"
import WorkflowApproval from "./approvals/page.vue"
import WorkflowDelegation from "./delegations/page.vue"

const tabs = [
  {
    value: "workflow-definition",
    label: "Definitions",
    component: WorkflowDefinition,
  },
  {
    value: "workflow-step",
    label: "Steps",
    component: WorkflowStep,
  },
  {
    value: "workflow-instance",
    label: "Instances",
    component: WorkflowInstance,
  },
  {
    value: "workflow-approval",
    label: "Approvals",
    component: WorkflowApproval,
  },
  {
    value: "workflow-delegation",
    label: "Delegations",
    component: WorkflowDelegation,
  },
]
</script>

<template>
  <main class="mx-auto max-w-screen-2xl px-0 py-0">
    <section class="mb-6 flex flex-col gap-1">
      <h1 class="text-2xl font-normal tracking-tight">
        Workflow
      </h1>

      <p class="max-w-3xl text-muted-foreground">
        Manage approval workflows, steps, executions, approvals, and delegations.
      </p>
    </section>

    <Tabs default-value="workflow-definition" class="w-full">
      <div class="mb-6 overflow-x-auto border-b">
        <TabsList class="inline-flex h-auto w-auto justify-start bg-transparent p-0">
          <TabsTrigger
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            class="shrink-0 rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            {{ tab.label }}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
      >
        <component :is="tab.component" />
      </TabsContent>
    </Tabs>
  </main>
</template>