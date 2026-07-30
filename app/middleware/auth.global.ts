export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const isPublic = Boolean(to.meta.public)

  auth.loadFromStorage()

  if (!auth.isAuthed) {
    if (!isPublic) return navigateTo('/login')
    return
  }

  if (to.path === '/login') {
    return navigateTo('/')
  }
})