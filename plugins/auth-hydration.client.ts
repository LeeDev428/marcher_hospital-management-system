export default defineNuxtPlugin({
  name: 'auth-hydration',
  enforce: 'post', // Run after Pinia is initialized
  async setup() {
    if (process.client) {
      console.log('🔄 Auth hydration plugin initializing...')
      
      // Wait for Pinia to be fully initialized
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      try {
        const { useAuthStore } = await import('~/stores/app/useAuthStore')
        const authStore = useAuthStore()
        
        // Give pinia-plugin-persistedstate time to restore state
        await new Promise(resolve => setTimeout(resolve, 100))
        
        console.log('🔍 Auth store after hydration:', {
          hasUser: !!authStore.user,
          user: authStore.user
        })
        
        // Mark as hydrated
        authStore.isHydrated = true
        
        if (authStore.user) {
          console.log('✅ Auth store hydrated successfully with user:', authStore.user.role)
        } else {
          console.log('⚠️ No user found in persisted state')
        }
      } catch (error) {
        console.error('❌ Error in auth hydration:', error)
      }
    }
  }
})