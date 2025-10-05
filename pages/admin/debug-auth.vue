<template>
  <div class="p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-6">Authentication Debug Page</h1>
      
      <div class="grid gap-6">
        <!-- Store State -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-3">Pinia Auth Store State</h2>
          <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto">{{ JSON.stringify(authStore.user, null, 2) }}</pre>
        </div>
        
        <!-- LocalStorage Data -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-3">LocalStorage Auth Data</h2>
          <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto">{{ localStorageData }}</pre>
        </div>
        
        <!-- Current Route -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-3">Current Route Info</h2>
          <div class="space-y-2">
            <p><strong>Path:</strong> {{ $route.path }}</p>
            <p><strong>Name:</strong> {{ $route.name }}</p>
            <p><strong>Params:</strong> {{ JSON.stringify($route.params) }}</p>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-3">Debug Actions</h2>
          <div class="space-x-4">
            <button @click="refreshData" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Refresh Data
            </button>
            <button @click="clearAuth" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Clear Auth
            </button>
            <button @click="testNavigation" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Test Staff Navigation
            </button>
          </div>
        </div>
        
        <!-- Navigation Test -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-3">Navigation Links</h2>
          <div class="space-y-2">
            <NuxtLink to="/admin/dashboard" class="block text-blue-600 hover:underline">Dashboard</NuxtLink>
            <NuxtLink to="/admin/users" class="block text-blue-600 hover:underline">Users</NuxtLink>
            <NuxtLink to="/admin/staff" class="block text-blue-600 hover:underline">Staff Management</NuxtLink>
            <NuxtLink to="/admin/settings" class="block text-blue-600 hover:underline">Settings</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/app/useAuthStore'

definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const authStore = useAuthStore()
const localStorageData = ref('')

const refreshData = () => {
  if (process.client) {
    try {
      const authData = localStorage.getItem('auth')
      localStorageData.value = authData ? JSON.stringify(JSON.parse(authData), null, 2) : 'No auth data found'
    } catch (error) {
      localStorageData.value = `Error reading localStorage: ${error}`
    }
  }
}

const clearAuth = () => {
  if (process.client) {
    localStorage.removeItem('auth')
    authStore.setUser(null)
    refreshData()
  }
}

const testNavigation = () => {
  console.log('🧪 Testing navigation to /admin/staff')
  console.log('🧪 Current auth state:', authStore.user)
  navigateTo('/admin/staff')
}

onMounted(() => {
  refreshData()
})

useHead({
  title: 'Auth Debug - Admin'
})
</script>