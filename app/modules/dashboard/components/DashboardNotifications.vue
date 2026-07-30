<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
import type { NotificationItem } from '../types'

defineProps<{
  items: NotificationItem[]
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2 text-base">
        <Bell class="h-4 w-4" />
        Notifications
      </CardTitle>
    </CardHeader>

    <CardContent class="space-y-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="rounded-lg border p-3 text-sm"
        :class="!item.is_read ? 'bg-muted/40' : ''"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-medium">{{ item.title }}</p>
            <p class="mt-1 text-xs text-muted-foreground">{{ item.description }}</p>
          </div>

          <Badge variant="secondary">{{ item.created_at }}</Badge>
        </div>
      </div>
    </CardContent>
  </Card>
</template>