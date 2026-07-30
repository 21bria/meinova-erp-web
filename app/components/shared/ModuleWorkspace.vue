<script setup lang="ts">
import {
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-vue-next'
import type { Component } from 'vue'

type ModuleMenu = {
  title: string
  href?: string
  desc?: string
  icon: Component
  count?: number
}

type ModuleTab = {
  value: string
  label: string
}

const props = withDefaults(defineProps<{
  title: string
  description?: string
  menus: ModuleMenu[]
  tabs?: ModuleTab[]
  defaultTab?: string
}>(), {
  description: '',
  defaultTab: 'list',
  tabs: () => [
    { value: 'overview', label: 'Overview' },
    { value: 'list', label: 'List' },
    { value: 'analytics', label: 'Analytics' },
    { value: 'reports', label: 'Reports' },
  ],
})

const activeMenu = defineModel<string>('activeMenu', {
  required: true,
})

const isSidebarCollapsed = ref(false)
</script>

<template>
  <section>
    <div class="mb-6">
      <h1 class="text-3xl font-semibold tracking-tight">
        {{ title }}
      </h1>

      <p v-if="description" class="mt-2 text-muted-foreground">
        {{ description }}
      </p>
    </div>

    <section class="overflow-hidden rounded-xl border bg-background shadow-sm">
      <div
        class="grid min-h-[680px] transition-all duration-300"
        :class="isSidebarCollapsed ? 'lg:grid-cols-[72px_1fr]' : 'lg:grid-cols-[280px_1fr]'"
      >
        <aside class="border-r bg-muted/20">
          <div class="flex items-center gap-2 border-b p-3">
            <Input
              v-if="!isSidebarCollapsed"
              :placeholder="`Search ${title} menu...`"
              class="h-9"
            />

            <Button
              variant="ghost"
              size="icon"
              class="ml-auto h-9 w-9"
              @click="isSidebarCollapsed = !isSidebarCollapsed"
            >
              <PanelLeftClose v-if="!isSidebarCollapsed" class="h-4 w-4" />
              <PanelLeftOpen v-else class="h-4 w-4" />
            </Button>
          </div>

          <div class="space-y-1 p-3">
            <button
              v-for="item in menus"
              :key="item.title"
              class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-muted"
              :class="[
                activeMenu === item.title ? 'bg-primary text-primary-foreground hover:bg-primary' : '',
                isSidebarCollapsed ? 'justify-center px-0' : '',
              ]"
              :title="isSidebarCollapsed ? item.title : undefined"
              @click="item.href ? navigateTo(item.href) : activeMenu = item.title"
            >
              <component :is="item.icon" class="h-5 w-5 shrink-0" />

              <div v-if="!isSidebarCollapsed" class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-medium">
                    {{ item.title }}
                  </p>

                  <Badge
                    v-if="item.count"
                    :variant="activeMenu === item.title ? 'secondary' : 'outline'"
                  >
                    {{ item.count }}
                  </Badge>
                </div>

                <p
                  v-if="item.desc"
                  class="truncate text-xs"
                  :class="activeMenu === item.title ? 'text-primary-foreground/80' : 'text-muted-foreground'"
                >
                  {{ item.desc }}
                </p>
              </div>
            </button>
          </div>
        </aside>

        <section class="flex min-w-0 flex-col">
          <div class="flex flex-col gap-3 border-b p-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 class="text-xl font-semibold">
                {{ activeMenu }}
              </h2>

              <p class="text-sm text-muted-foreground">
                {{ title }} workspace / {{ activeMenu }}
              </p>
            </div>

            <slot name="header-actions" :active-menu="activeMenu">
              <Button>Add New</Button>
            </slot>
          </div>

          <Tabs :default-value="defaultTab" class="w-full">
            <div class="border-b px-4 pt-4">
              <div class="overflow-x-auto">
                <TabsList class="h-auto w-max min-w-full justify-start bg-transparent p-0">
                  <TabsTrigger
                    v-for="tab in tabs"
                    :key="tab.value"
                    :value="tab.value"
                    class="shrink-0 rounded-none border-b-2 border-transparent px-5 py-3 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                  >
                    {{ tab.label }}
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              class="m-0"
            >
              <slot :name="tab.value" :active-menu="activeMenu">
                <div class="p-4">
                  <div class="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
                    {{ activeMenu }} / {{ tab.label }} coming soon.
                  </div>
                </div>
              </slot>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </section>
  </section>
</template>