export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side to avoid SSR issues
  if (process.client) {
    // Try to access localStorage to check if user is logged in
    try {
      const authData = localStorage.getItem('auth')
      
      if (!authData) {
        return navigateTo('/login')
      }
      
      const parsedAuth = JSON.parse(authData)
      const user = parsedAuth?.user
      
      if (!user) {
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