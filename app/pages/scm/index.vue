<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="space-y-6 p-6">
    <div>
      <h2 class="text-2xl font-semibold">
        SCM Dashboard
      </h2>
      <p class="text-muted-foreground">
        Supply chain operations overview.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Open PR</CardDescription>
          <CardTitle>18</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Open PO</CardDescription>
          <CardTitle>7</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Vendors</CardDescription>
          <CardTitle>42</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardDescription>Low Stock Items</CardDescription>
          <CardTitle>9</CardTitle>
        </CardHeader>
      </Card>
    </div>
  </div>
</template>