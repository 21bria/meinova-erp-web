<script setup lang="ts">
definePageMeta({
  layout: 'workflow',
})
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h2 class="text-2xl font-semibold">
        Workflow Dashboard
      </h2>

      <p class="text-muted-foreground">
        Approval and workflow monitoring overview.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Pending Tasks</CardDescription>
          <CardTitle>9</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Approval Flows</CardDescription>
          <CardTitle>14</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Delegations</CardDescription>
          <CardTitle>3</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Completed Today</CardDescription>
          <CardTitle>27</CardTitle>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>