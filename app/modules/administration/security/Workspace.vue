<script setup lang="ts">
/*
 | Komponen bernama jamak (UsersTable, RolesTable, …) adalah keluaran
 | generator yang sekarang. Versi tunggalnya (UserTable, RoleTable, …)
 | sisa dari sebelum modul ini diregenerate dan sudah dihapus: berkas
 | pendampingnya ikut berganti nama (`userForm` -> `usersForm`,
 | `userConfig` -> `usersConfig`), jadi komponen lamanya mengimpor
 | ekspor yang tidak ada lagi — dan itu menggagalkan build seluruh
 | aplikasi, bukan cuma halaman ini.
 */
import UserTable from "./users/components/UsersTable.vue"
import RoleTable from "./roles/components/RolesTable.vue"
import PermissionTable from "./permissions/components/PermissionsTable.vue"
import MenuPermissionPanel from "./menu-permissions/components/MenuPermissionPanel.vue"
import UserRolePanel from "./user-roles/components/UserRolePanel.vue"
import RolePermissionPanel from "./role-permissions/components/RolePermissionPanel.vue"
import SessionTable from "./sessions/components/SessionTable.vue"
// import PasswordPolicyTable from "./password-policy/components/PasswordPolicyTable.vue"
// import ApiKeyTable from "./api-keys/components/ApiKeysTable.vue"

const tabs = [
  { value: 'users', label: 'Users', component: UserTable },
  // Dua tab di bawah ini yang membuat RBAC bisa diatur dari layar.
  // Tanpa keduanya, "Users" cuma menampilkan role sebagai teks dan
  // "Roles" tidak punya pemilih permission — jadi satu-satunya cara
  // mengubah hak akses adalah lewat shell.
  { value: 'user-roles', label: 'User Roles', component: UserRolePanel },
  { value: 'roles', label: 'Roles', component: RoleTable },
  { value: 'role-permissions', label: 'Role Permissions', component: RolePermissionPanel },
  { value: 'permissions', label: 'Permissions', component: PermissionTable },
  { value: 'menu-permissions', label: 'Menu Permissions', component: MenuPermissionPanel },
  // Tab "Data Permissions" dibuang di Stage 4I. Ia cuma menampilkan
  // `RoleDataPermission` — konfigurasi lama yang tidak menentukan akses
  // siapa pun sejak WHERE pindah ke kewenangan per penugasan. Layar
  // read-only yang terlihat seperti layar kebijakan lebih berbahaya
  // daripada tidak ada layarnya: orang membacanya sebagai jawaban atas
  // "siapa melihat apa", dan jawabannya salah. Penggantinya tab User
  // Roles -> Kewenangan.
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