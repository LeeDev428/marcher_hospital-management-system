<script setup lang="ts">
import { useAuthStore } from '~/stores/app/useAuthStore'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const authStore = useAuthStore()
const testResult = ref('')
const loading = ref(false)

const testAuth = async () => {
  loading.value = true
  testResult.value = 'Testing...'
  
  try {
    const { $trpc } = useNuxtApp()
    
    // Test a simple tRPC call
    const result = await $trpc.staff.getStats.query()
    testResult.value = `✅ Success! Stats: ${JSON.stringify(result, null, 2)}`
  } catch (error) {
    testResult.value = `❌ Error: ${error.message}\n\nFull error: ${JSON.stringify(error, null, 2)}`
    console.error('Test auth error:', error)
  } finally {
    loading.value = false
  }
}

const checkCookies = () => {
  testResult.value = `Cookies: ${document.cookie}`
}

onMounted(() => {
  console.log('Auth store user:', authStore.user)
  console.log('Document cookies:', document.cookie)
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Authentication Test</h1>
    
    <div class="bg-white p-6 rounded-lg shadow mb-6">
      <h2 class="text-lg font-semibold mb-4">User Info</h2>
      <pre class="bg-gray-100 p-4 rounded">{{ JSON.stringify(authStore.user, null, 2) }}</pre>
    </div>
    
    <div class="space-y-4">
      <button 
        @click="testAuth" 
        :disabled="loading"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {{ loading ? 'Testing...' : 'Test tRPC Call' }}
      </button>
      
      <button 
        @click="checkCookies"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
      >
        Check Cookies
      </button>
    </div>
    
    <div v-if="testResult" class="mt-6 bg-gray-100 p-4 rounded">
      <h3 class="font-semibold mb-2">Test Result:</h3>
      <pre class="whitespace-pre-wrap">{{ testResult }}</pre>
    </div>
  </div>
</template>