/*
| Menyelaraskan bahasa UI dengan bahasa milik akun.
|
| Ditaruh di plugin, bukan di `layouts/default.vue`: profil pengguna
| dimuat oleh beberapa jalur (login, `fetchMe` saat layout mount,
| refresh token) dan layout hanyalah salah satunya. Satu watcher di
| sini menangkap ketiganya.
|
| `.client` karena tidak ada gunanya di server — profil baru ada
| sesudah token dibaca di browser.
|
| Arahnya **satu jalur saja**: akun → UI. Jalur sebaliknya (UI → akun)
| hanya terjadi saat orangnya menekan pemilih bahasa, lewat
| `useLocale().setLocale()`. Kalau watcher ini ikut menulis balik,
| keduanya akan saling memicu.
*/
export default defineNuxtPlugin(() => {
  const auth = useAuthStore()

  watch(
    () => auth.user?.language,
    (value) => {
      if (!value)
        return

      const nuxtApp = useNuxtApp()

      nuxtApp.runWithContext(() => {
        useLocale().syncFromAccount()
      })
    },
    { immediate: true },
  )
})
