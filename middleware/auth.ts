export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side to avoid SSR issues
  if (process.client) {
    try {
      // Try using auth store first
      const { useAuthStore } = await import('~/stores/app/useAuthStore')
      const authStore = useAuthStore()
      
      // If store has user data, use it
      if (authStore.user && authStore.user.role) {
        const userRole = authStore.user.role.toLowerCase()
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
        
        return // User is authenticated and has correct role
      }
      
      // Fallback to localStorage if store is empty
      const authData = localStorage.getItem('auth')
      
      if (!authData) {
        return navigateTo('/login')
      }
      
      const parsedAuth = JSON.parse(authData)
      
      // Handle both direct user object and nested structure
      const user = parsedAuth?.user || parsedAuth
      
      if (!user || !user.role) {
        return navigateTo('/login')
      }
      
      // If user is authenticated but accessing wrong role area
      const userRole = user.role?.toLowerCase()
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
    } catch (error) {
      console.error('Auth middleware error:', error)
      return navigateTo('/login')
    }
  }
})