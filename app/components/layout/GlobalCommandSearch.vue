<script setup lang="ts">
import { Search } from 'lucide-vue-next'

const open = ref(false)
const keyword = ref('')

const menus = [
  { title: 'Employee Master', href: '/hr/employees', module: 'HR' },
  { title: 'Payroll Run', href: '/payroll/runs', module: 'Payroll' },
  { title: 'Purchase Request', href: '/scm/purchase-requests', module: 'SCM' },
  { title: 'Journal Entry', href: '/finance/journals', module: 'Finance' },
  { title: 'Monthly Report', href: '/reports/monthly', module: 'Reports' },
]

const results = computed(() =>
  menus.filter(item =>
    item.title.toLowerCase().includes(keyword.value.toLowerCase())
    || item.module.toLowerCase().includes(keyword.value.toLowerCase()),
  ),
)

function goTo(href: string) {
  open.value = false
  keyword.value = ''
  navigateTo(href)
}

onMounted(() => {
  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      open.value = true
    }
  })
})
</script>

<template>
  <div>
    <button
      type="button"
      class="hidden w-full max-w-xl items-center gap-2 rounded-full border bg-muted/40 px-4 py-2 text-sm text-muted-foreground md:flex"
      @click="open = true"
    >
      <Search class="h-4 w-4" />
      <span>Search anything...</span>
      <kbd class="ml-auto rounded border bg-background px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
    </button>

    <Dialog v-model:open="open">
      <DialogContent class="p-0 sm:max-w-xl">
        <div class="flex items-center border-b px-4">
          <Search class="h-4 w-4 text-muted-foreground" />
          <input
            v-model="keyword"
            autofocus
            placeholder="Search menu..."
            class="h-12 flex-1 bg-transparent px-3 text-sm outline-none"
          >
        </div>

        <div class="max-h-[360px] overflow-y-auto p-2">
          <button
            v-for="item in results"
            :key="item.href"
            type="button"
            class="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-sm hover:bg-muted"
            @click="goTo(item.href)"
          >
            <span>{{ item.title }}</span>
            <span class="text-xs text-muted-foreground">{{ item.module }}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>