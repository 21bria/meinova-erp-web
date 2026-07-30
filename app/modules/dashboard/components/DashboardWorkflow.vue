<script setup lang="ts">
import { Clock3 } from 'lucide-vue-next'
import type { WorkflowItem } from '../types'

defineProps<{
  items: WorkflowItem[]
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-base">
        <Clock3 class="h-4 w-4" />
        Pending Workflow
      </CardTitle>
    </CardHeader>

    <CardContent class="space-y-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between rounded-lg border p-3"
      >
        <div>
          <p class="text-sm font-medium">{{ item.title }}</p>
          <p class="text-xs text-muted-foreground">
            {{ item.module }} • {{ item.requester }}
          </p>
        </div>

        <Badge variant="secondary">{{ item.status }}</Badge>
      </div>
    </CardContent>
  </Card>
</template>