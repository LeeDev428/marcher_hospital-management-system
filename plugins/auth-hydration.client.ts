export default defineNuxtPlugin(() => {
  // This plugin ensures proper hydration of auth state
  if (process.client) {
    const nuxtApp = useNuxtApp()
    
    // Wait for hydration before any navigation
    nuxtApp.hook('app:mounted', async () => {
      console.log('🔄 App mounted, checking auth state...')
      
      // Give time for Pinia persistence to restore state
      await nextTick()
      
      try {
        const { useAuthStore } = await import('~/stores/app/useAuthStore')
        const authStore = useAuthStore()
        console.log('🔍 Auth state after hydration:', authStore.user)
        
        // Force a check to ensure state is properly restored
        if (!authStore.user) {
          console.log('⚠️ No user in store after hydration, checking localStorage...')
          const authData = localStorage.getItem('auth')
          if (authData) {
            try {
              const parsedAuth = JSON.parse(authData)
              const user = parsedAuth?.user || parsedAuth
              if (user && user.role) {
                console.log('✅ Restoring user from localStorage:', user.role)
                authStore.setUser(user)
              }
            } catch (error) {
              console.error('❌ Error parsing localStorage auth data:', error)
            }
          }
        }
      } catch (error) {
        console.error('❌ Error checking auth state:', error)
      }
    })
    
    // Also check on route change
    nuxtApp.hook('page:start', () => {
      console.log('🔄 Page navigation started, checking auth state...')
    })
  }
})