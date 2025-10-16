export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on client side
  if (process.client) {
    try {
      console.log('🔍 Staff type middleware running for path:', to.path)
      
      const { useAuthStore } = await import('~/stores/app/useAuthStore')
      const authStore = useAuthStore()
      
      // Check if user is authenticated
      if (!authStore.user || !authStore.user.role) {
        console.log('❌ No authenticated user')
        return navigateTo('/login')
      }

      // Only check for staff role
      if (authStore.user.role.toLowerCase() !== 'staff') {
        console.log('❌ User is not staff')
        return // Let other middleware handle role checks
      }

      // Check if staff has credentials
      if (!authStore.user.staffCredentials) {
        console.log('⚠️ Staff user has no staffCredentials')
        throw createError({
          statusCode: 403,
          statusMessage: 'Staff credentials not found. Please contact administrator.'
        })
      }

      const staffType = authStore.user.staffCredentials.staffType
      console.log('✅ Staff type:', staffType)

      // Define restricted routes (only for STAFF type)
      const pharmacyRoutes = ['/staff/pharmacy', '/staff/billing']
      const isRestrictedRoute = pharmacyRoutes.some(route => to.path.startsWith(route))

      if (isRestrictedRoute) {
        // Only STAFF type can access pharmacy and billing
        if (staffType !== 'STAFF') {
          console.log(`❌ Access denied - ${staffType} cannot access ${to.path}`)
          throw createError({
            statusCode: 403,
            statusMessage: `Access denied. This page is only accessible to administrative staff. Your role: ${staffType}`
          })
        }
        console.log('✅ Access granted - STAFF type user')
      }

      return // Allow access
      
    } catch (error) {
      console.error('Staff type middleware error:', error)
      throw error
    }
  }
})
