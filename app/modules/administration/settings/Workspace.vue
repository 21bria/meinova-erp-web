<script setup lang="ts">
import TenantSetting from "./tenant-setting/page.vue"
import SystemSetting from "./system-setting/page.vue"
import PrintSetting from "./print-setting/page.vue"


const tabs = [
  { value: 'tenant-setting', label: 'Tenant Settings', component: TenantSetting },
  { value: 'system-setting', label: 'System Settings', component: SystemSetting },
  { value: 'print-setting', label: 'Print Settings', component: PrintSetting },
]
</script>

<template>
  <main class="mx-auto max-w-screen-2xl px-0 py-0">
    <section class="mb-6 flex flex-col gap-1">
      <h1 class="text-2xl font-normal tracking-tight">
        System
      </h1>

      <p class="max-w-3xl text-muted-foreground">
        Manage tenant, system and print setting.
      </p>
    </section>

    <Tabs default-value="tenant-setting" class="w-full">
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