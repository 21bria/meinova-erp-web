<script setup lang="ts">
import { computed, ref, type Component } from "vue"

import Countries from "./countries/page.vue"
import Provinces from "./provinces/page.vue"
import Cities from "./cities/page.vue"

type ReferenceItem = {
  value: string
  label: string
  component: Component
}

const items: ReferenceItem[] = [
  { value: "country", label: "Country", component: Countries },
  { value: "province", label: "Province", component: Provinces },
  { value: "city", label: "City", component: Cities },
]

const activeTab = ref(items[0]?.value ?? "")

const currentItem = computed<ReferenceItem | null>(() => {
  return items.find(i => i.value === activeTab.value)
    ?? items[0]
    ?? null
})
</script>

<template>
    <main class="mx-auto max-w-screen-2xl px-0 py-0">
        <section class="mb-6 flex flex-col gap-1">
            <h1 class="text-2xl font-normal tracking-tight">
                Geography Management
            </h1>

            <p class="max-w-3xl text-muted-foreground">
                Manage geographical reference data used throughout the system.
            </p>
        </section>

        <section class="min-w-0">
            <Tabs v-model="activeTab" class="w-full">
                <div class="mb-6 overflow-x-auto border-b">
                    <TabsList class="inline-flex h-auto w-fit justify-start bg-transparent p-0">
                        <TabsTrigger
                            v-for="tab in items"
                            :key="tab.value"
                            :value="tab.value"
                            class="shrink-0 rounded-none border-b-2 border-transparent px-5 py-3 text-sm font-medium whitespace-nowrap text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                        >
                            {{ tab.label }}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <component
                    v-if="currentItem"
                    :is="currentItem.component"
                />
            </Tabs>
        </section>
    </main>
</template>