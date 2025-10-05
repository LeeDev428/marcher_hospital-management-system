export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side to avoid SSR issues
  if (process.client) {
    try {
      console.log('🔍 Auth middleware running for path:', to.path)
      console.log('🔍 Coming from path:', from?.path)
      
      // Try using auth store first
      const { useAuthStore } = await import('~/stores/app/useAuthStore')
      const authStore = useAuthStore()
      
      console.log('🔍 Auth middleware - Store user:', authStore.user)
      console.log('🔍 Auth middleware - Store state:', !!authStore.$state)
      
      // If store has user data, use it
      if (authStore.user && authStore.user.role) {
        const userRole = authStore.user.role.toLowerCase()
        const currentPath = to.path
        
        console.log('✅ User authenticated with role:', userRole)
        
        // Role-based route protection
        if (currentPath.startsWith('/admin') && userRole !== 'admin') {
          console.log('❌ Access denied - Admin required')
          throw createError({
            statusCode: 403,
            statusMessage: 'Access denied. Admin privileges required.'
          })
        }
        
        if (currentPath.startsWith('/staff') && !['staff', 'admin'].includes(userRole)) {
          console.log('❌ Access denied - Staff required')
          throw createError({
            statusCode: 403,
            statusMessage: 'Access denied. Staff privileges required.'
          })
        }
        
        if (currentPath.startsWith('/patient') && !['patient', 'admin'].includes(userRole)) {
          console.log('❌ Access denied - Patient required')
          throw createError({
            statusCode: 403,
            statusMessage: 'Access denied. Patient privileges required.'
          })
        }
        
        return // User is authenticated and has correct role
      }
      
      console.log('⚠️ No user in store, checking localStorage...')
      
      // Check localStorage directly
      const authData = localStorage.getItem('auth')
      console.log('🔍 localStorage auth data exists:', !!authData)
      
      if (!authData) {
        console.log('❌ No auth data found, redirecting to login')
        return navigateTo('/login')
      }
      
      let parsedAuth
      try {
        parsedAuth = JSON.parse(authData)
        console.log('🔍 Parsed auth data:', Object.keys(parsedAuth))
      } catch (parseError) {
        console.error('❌ Failed to parse auth data:', parseError)
        localStorage.removeItem('auth')
        return navigateTo('/login')
      }
      
      // Handle both direct user object and nested structure
      const user = parsedAuth?.user || parsedAuth
      
      if (!user || !user.role) {
        console.log('❌ Invalid auth data structure:', { hasUser: !!user, hasRole: !!(user?.role) })
        localStorage.removeItem('auth')
        return navigateTo('/login')
      }
      
      console.log('✅ User found in localStorage:', user.role)
      
      // Restore user to store
      try {
        authStore.setUser(user)
        console.log('✅ User restored to store')
      } catch (storeError) {
        console.error('❌ Failed to restore user to store:', storeError)
      }
      
      // Wait a bit for state to settle
      await new Promise(resolve => setTimeout(resolve, 10))
      
      // If user is authenticated but accessing wrong role area
      const userRole = user.role?.toLowerCase()
      const currentPath = to.path
      
      console.log('🔍 Final role check:', { userRole, currentPath })
      
      // Role-based route protection
      if (currentPath.startsWith('/admin') && userRole !== 'admin') {
        console.log('❌ Role check failed - Admin required')
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied. Admin privileges required.'
        })
      }
      
      if (currentPath.startsWith('/staff') && !['staff', 'admin'].includes(userRole)) {
        console.log('❌ Role check failed - Staff required')
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied. Staff privileges required.'
        })
      }
      
      if (currentPath.startsWith('/patient') && !['patient', 'admin'].includes(userRole)) {
        console.log('❌ Role check failed - Patient required')
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied. Patient privileges required.'
        })
      }
      
      console.log('✅ Auth middleware passed successfully')
    } catch (error: any) {
      console.error('❌ Auth middleware error:', error)
      
      // Don't redirect if it's just a role-based error
      if (error?.statusCode === 403) {
        throw error
      }
      
      return navigateTo('/login')
    }
  }
})