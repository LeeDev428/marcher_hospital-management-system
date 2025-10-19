export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side to avoid SSR issues
  if (process.client) {
    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/']
    
    // Check if current route is public
    if (publicRoutes.includes(to.path)) {
      console.log('✅ Public route, skipping auth check')
      return
    }
    
    try {
      console.log('🔍 Auth middleware running for path:', to.path)
      
      // Import auth store
      const { useAuthStore } = await import('~/stores/app/useAuthStore')
      
      let authStore
      try {
        authStore = useAuthStore()
      } catch (error) {
        // Pinia not ready yet, wait a bit
        console.log('⚠️ Pinia not ready, waiting...')
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 100))
        authStore = useAuthStore()
      }
      
      // Quick check first - if user already exists and is hydrated, skip waiting
      if (authStore.isHydrated && authStore.user) {
        console.log('✅ Already authenticated, quick pass')
        // Do role check and let through
        const userRole = authStore.user.role.toLowerCase()
        const staffType = authStore.user.staffCredentials?.staffType
        const currentPath = to.path
        
        // Role-based route protection
        if (currentPath.startsWith('/admin') && userRole !== 'admin') {
          throw createError({ statusCode: 403, statusMessage: 'Access denied. Admin privileges required.' })
        }
        if (currentPath.startsWith('/staff') && !['staff', 'admin'].includes(userRole)) {
          throw createError({ statusCode: 403, statusMessage: 'Access denied. Staff privileges required.' })
        }
        if (currentPath.startsWith('/admissions_staff') && staffType !== 'ADMISSIONS_STAFF') {
          throw createError({ statusCode: 403, statusMessage: 'Access denied. Admissions Staff privileges required.' })
        }
        if (currentPath.startsWith('/billing_staff') && staffType !== 'BILLING_STAFF') {
          throw createError({ statusCode: 403, statusMessage: 'Access denied. Billing Staff privileges required.' })
        }
        if (currentPath.startsWith('/patient') && !['patient', 'admin'].includes(userRole)) {
          throw createError({ statusCode: 403, statusMessage: 'Access denied. Patient privileges required.' })
        }
        
        return // Allow navigation immediately
      }
      
      // If not hydrated yet, wait for it (first page load scenario)
      console.log('⏳ Waiting for hydration...')
      let attempts = 0
      const maxAttempts = 20 // 1 second max wait
      while (!authStore.isHydrated && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 50))
        attempts++
      }
      
      console.log('🔍 Auth middleware - Store hydrated after', attempts * 50, 'ms')
      console.log('🔍 Auth middleware - Store user:', authStore.user)
      
      // Check if user exists in store (pinia-plugin-persistedstate should have loaded it)
      if (!authStore.user) {
        console.log('❌ No user in store, redirecting to login')
        return navigateTo('/login', { replace: true })
      }
      
      // Validate user has required fields
      if (!authStore.user.id || !authStore.user.role) {
        console.log('❌ Invalid user data in store')
        authStore.user = null
        localStorage.removeItem('auth')
        return navigateTo('/login', { replace: true })
      }
      
      console.log('✅ User authenticated:', authStore.user.role)
      
      // Get user role for route protection
      const userRole = authStore.user.role.toLowerCase()
      const staffType = authStore.user.staffCredentials?.staffType
      const currentPath = to.path
      
      console.log('🔍 Role check:', { userRole, staffType, currentPath })
      
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
      
      if (currentPath.startsWith('/admissions_staff') && staffType !== 'ADMISSIONS_STAFF') {
        console.log('❌ Access denied - Admissions Staff required')
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied. Admissions Staff privileges required.'
        })
      }
      
      if (currentPath.startsWith('/billing_staff') && staffType !== 'BILLING_STAFF') {
        console.log('❌ Access denied - Billing Staff required')
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied. Billing Staff privileges required.'
        })
      }
      
      if (currentPath.startsWith('/patient') && !['patient', 'admin'].includes(userRole)) {
        console.log('❌ Access denied - Patient required')
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
      
      return navigateTo('/login', { replace: true })
    }
  }
})