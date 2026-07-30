<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import PasswordInput from '~/components/PasswordInput.vue'
import { useAuthStore } from '~/stores/auth'
import { useNotify } from "@/composables/useNotify"

const auth = useAuthStore()
const notify = useNotify()
// SimpleJWT default: username + password
const username = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

const route = useRoute()

async function onSubmit(event: Event) {
  event.preventDefault()
  errorMsg.value = ''

  if (!username.value || !password.value) return

  isLoading.value = true

  try {
    await auth.login(username.value, password.value)


    const redirect = typeof route.query.redirect === 'string'
      ? route.query.redirect
      : '/'

    await navigateTo(redirect)
  } catch (e: any) {
    console.log('LOGIN ERROR', e)
    errorMsg.value = e?.message || 'Username atau password salah'
  } finally {
    isLoading.value = false
  }
}
onMounted(() => {
  console.log('apiBaseUrl =', useRuntimeConfig().public.apiBaseUrl)
})
</script>

<template>
  <form class="grid gap-6" @submit="onSubmit">
    <div class="flex flex-col gap-4">
      <Button variant="outline" class="w-full gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-4">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor" />
        </svg>
        Login with Google
      </Button>
    </div>
    <Separator label="Or continue with" />

    <div class="grid gap-2">
      <Label for="username">Username</Label>
      <Input id="username" v-model="username" placeholder="admin" :disabled="isLoading" auto-capitalize="none"
        auto-correct="off" />
    </div>

    <div class="grid gap-2">
      <div class="flex items-center">
        <Label for="password">Password</Label>
        <NuxtLink to="/forgot-password" class="ml-auto inline-block text-sm underline">
          Forgot your password?
        </NuxtLink>
      </div>
      <PasswordInput id="password" v-model="password" :disabled="isLoading" />
    </div>

    <p v-if="errorMsg" class="text-sm text-destructive">
      {{ errorMsg }}
    </p>
    <Button type="submit" class="w-full" :disabled="isLoading || !username || !password">
      <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      Login
    </Button>
  </form>
  <div class="mt-4 text-center text-sm text-muted-foreground">
    Don't have an account?
    <NuxtLink to="/register" class="underline">
      Sign up
    </NuxtLink>
  </div>
</template>

<style scoped></style>
