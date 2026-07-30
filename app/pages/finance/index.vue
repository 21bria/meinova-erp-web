<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h2 class="text-2xl font-semibold">
        Finance Dashboard
      </h2>
      <p class="text-muted-foreground">
        Finance operations overview.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Cash Balance</CardDescription>
          <CardTitle>Rp 850M</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Accounts Payable</CardDescription>
          <CardTitle>Rp 120M</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Accounts Receivable</CardDescription>
          <CardTitle>Rp 310M</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Pending Journals</CardDescription>
          <CardTitle>12</CardTitle>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>