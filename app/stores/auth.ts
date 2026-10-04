import { defineStore } from 'pinia'

import { useResourceAccess } from '@framework'

type LoginResponse = {
  access: string
  refresh: string
  user?: any
}

type MeResponse = {
  user?: any
  id?: number
  username?: string
  email?: string
  permissions?: string[]
}

const apiUrl = (baseURL: string, path: string) => {
  const base = String(baseURL || '').replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${base}${normalizedPath}`
}

const safeParse = (v: string | null) => {
  if (!v || v === 'undefined' || v === 'null')
    return null

  try {
    return JSON.parse(v)
  }
  catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    access: '' as string,
    refresh: '' as string,
    user: null as any,
    meLoaded: false,
    mePromise: null as Promise<any> | null,
  }),

  getters: {
    isAuthed: state => !!state.access,

    permissions: state => {
      return Array.isArray(state.user?.permissions)
        ? state.user.permissions
        : []
    },
  },

  actions: {
    loadFromStorage() {
      const accessCookie = useCookie<string | null>('access', {
        sameSite: 'lax',
        path: '/',
      })

      const refreshCookie = useCookie<string | null>('refresh', {
        sameSite: 'lax',
        path: '/',
      })

      this.access = accessCookie.value ?? ''
      this.refresh = refreshCookie.value ?? ''

      if (import.meta.client) {
        this.user = safeParse(localStorage.getItem('user'))
        this.meLoaded = !!(this.access && this.user)
      }
    },

    saveToStorage() {
      const accessCookie = useCookie<string | null>('access', { sameSite: 'lax' })
      const refreshCookie = useCookie<string | null>('refresh', { sameSite: 'lax' })

      accessCookie.value = this.access || null
      refreshCookie.value = this.refresh || null

      if (import.meta.server)
        return

      if (this.user == null)
        localStorage.removeItem('user')
      else
        localStorage.setItem('user', JSON.stringify(this.user))
    },

    clear() {
      const accessCookie = useCookie<string | null>('access', { sameSite: 'lax' })
      const refreshCookie = useCookie<string | null>('refresh', { sameSite: 'lax' })

      accessCookie.value = null
      refreshCookie.value = null

      this.access = ''
      this.refresh = ''
      this.user = null
      this.meLoaded = false
      this.mePromise = null

      // Menu yang boleh dilihat disimpan di `useState`, yang bertahan
      // lintas navigasi di sisi klien. Tanpa dikosongkan di sini,
      // pengguna berikutnya yang login di tab yang sama mewarisi
      // pembatasan menu milik pengguna sebelumnya.
      if (import.meta.client) {
        useMenuAccess().reset()

        // Alasan yang sama: isi bel juga di `useState`, jadi tanpa ini
        // pengguna berikutnya melihat notifikasi milik pengguna
        // sebelumnya sampai belnya dimuat ulang.
        useNotifications().reset()

        // Dan izin tulis per resource — yang menentukan tombol Add/Edit
        // muncul atau tidak. Tanpa ini pegawai yang login setelah HR
        // manager di tab yang sama mendapat tombol yang API-nya pasti
        // menolaknya.
        useResourceAccess().reset()
      }

      if (import.meta.client) {
        localStorage.removeItem('user')
        clearNuxtData()
      }
    },

    async login(username: string, password: string) {
      this.clear()

      const config = useRuntimeConfig()
      const baseURL = config.public.apiBaseUrl as string

      try {
        const res = await $fetch<LoginResponse>(
          apiUrl(baseURL, '//api/accounts/auth/login/'),
          {
            method: 'POST',
            body: { username, password },
          },
        )

        this.access = res.access
        this.refresh = res.refresh
        this.user = res.user ?? null
        this.meLoaded = false

        this.saveToStorage()

        await this.fetchMe(true)
      }
      catch (e: any) {
        this.clear()

        const msg
          = e?.data?.detail
          || (Array.isArray(e?.data?.non_field_errors)
            ? e.data.non_field_errors[0]
            : null)
          || 'Username atau password salah'

        throw new Error(msg)
      }
    },

    async fetchMe(force = false) {
      if (!force && this.meLoaded && this.user)
        return this.user

      if (!force && this.mePromise)
        return this.mePromise

      this.mePromise = (async () => {
        const { request } = useApi()

        const res = await request<MeResponse>('/api/accounts/auth/me/', {
          method: 'GET',
        })

        this.user = res.user ?? res
        this.meLoaded = true

        this.saveToStorage()

        return this.user
      })()

      try {
        return await this.mePromise
      }
      finally {
        this.mePromise = null
      }
    },

    async refreshToken() {
      if (!this.refresh) {
        this.clear()
        throw new Error('No refresh token')
      }

      const config = useRuntimeConfig()
      const baseURL = config.public.apiBaseUrl as string

      try {
        const res = await $fetch<{ access: string }>(
          apiUrl(baseURL, '/api/accounts/auth/refresh/'),
          {
            method: 'POST',
            body: { refresh: this.refresh },
          },
        )

        this.access = res.access
        this.saveToStorage()

        return this.access
      }
      catch (e) {
        this.clear()
        throw e
      }
    },

    hasPermission(permission?: string) {
      if (!permission)
        return true

      if (this.user?.is_superuser)
        return true

      return this.permissions.includes(permission)
    },

    async logout() {
      this.clear()
      await navigateTo('/login')
    },
  },
})