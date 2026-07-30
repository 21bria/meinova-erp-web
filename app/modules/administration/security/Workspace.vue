<script setup lang="ts">
import UserTable from "./users/components/UserTable.vue"
import RoleTable from "./roles/components/RoleTable.vue"
import PermissionTable from "./permissions/components/PermissionTable.vue"
import MenuPermissionPanel from "./menu-permissions/components/MenuPermissionPanel.vue"
import DataPermissionPanel from "./data-permission/page.vue"
import SessionTable from "./sessions/components/SessionTable.vue"
// import PasswordPolicyTable from "./password-policy/components/PasswordPolicyTable.vue"
// import ApiKeyTable from "./api-keys/components/ApiKeyTable.vue"

const tabs = [
  { value: 'users', label: 'Users', component: UserTable },
  { value: 'roles', label: 'Roles', component: RoleTable },
  { value: 'permissions', label: 'Permissions', component: PermissionTable },
  { value: 'menu-permissions', label: 'Menu Permissions', component: MenuPermissionPanel },
  { value: 'data-permissions', label: 'Data Permissions', component: DataPermissionPanel },
  { value: 'sessions', label: 'Sessions', component: SessionTable },
  // { value: 'password-policy', label: 'Password Policy', component: PasswordPolicyTable },
  // { value: 'api-keys', label: 'API Keys', component: ApiKeyTable },
]
</script>

<template>
  <main class="mx-auto max-w-screen-2xl px-0 py-0">
    <section class="mb-6 flex flex-col gap-1">
      <h1 class="text-2xl font-normal tracking-tight">
        Security
      </h1>

      <p class="max-w-3xl text-muted-foreground">
        Manage users, roles, permissions, access control, sessions, and security policies.
      </p>
    </section>

    <Tabs default-value="users" class="w-full">
      <div class="mb-6 overflow-x-auto border-b">
        <TabsList class="flex h-auto w-max min-w-full justify-start bg-transparent p-0">
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