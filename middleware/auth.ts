export default defineNuxtRouteMiddleware((to, from) => {
  const { $router } = useNuxtApp()
  
  // Check if we're on client side
  if (process.client) {
    const authStore = useAuthStore()
    
    // If user is not authenticated, redirect to login
    if (!authStore.isAuthenticated) {
      return navigateTo('/login')
    }
    
    // If user is authenticated but accessing wrong role area
    const userRole = authStore.user?.role?.toLowerCase()
    const currentPath = to.path
    
    // Role-based route protection
    if (currentPath.startsWith('/admin') && userRole !== 'admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. Admin privileges required.'
      })
    }
    
    if (currentPath.startsWith('/staff') && !['staff', 'admin'].includes(userRole)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. Staff privileges required.'
      })
    }
    
    if (currentPath.startsWith('/patient') && !['patient', 'admin'].includes(userRole)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied. Patient privileges required.'
      })
    }
  }
})