<script setup lang="ts">
import { useAuthStore } from "~/stores/app"

const authStore = useAuthStore()

const getUserInitials = () => {
  if (!authStore.user) return 'P'
  const firstName = authStore.user.firstName || ''
  const lastName = authStore.user.lastName || ''
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Navigation Header -->
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
           
                 <img src="/img/logo/marcher-logo.png" alt="Marcher Logo" class="w-6 h-6" />
           
              <span class="ml-3 text-xl font-semibold text-gray-800">Marcher</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="hidden md:flex space-x-8">
            <NuxtLink 
              to="/patient" 
              class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
              :class="$route.path === '/patient' ? 'text-teal-700 bg-teal-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <Icon name="lucide:home" class="w-4 h-4 mr-2" />
              Dashboard
            </NuxtLink>
            
            <NuxtLink 
              to="/patient/appointments" 
              class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
              :class="$route.path.startsWith('/patient/appointments') ? 'text-teal-700 bg-teal-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <Icon name="lucide:calendar" class="w-4 h-4 mr-2" />
              Appointments
            </NuxtLink>
            
            <NuxtLink 
              to="/patient/medical-records" 
              class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
              :class="$route.path.startsWith('/patient/medical-records') ? 'text-teal-700 bg-teal-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <Icon name="lucide:file-text" class="w-4 h-4 mr-2" />
              Medical Records
            </NuxtLink>
            
            <NuxtLink 
              to="/patient/billing" 
              class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
              :class="$route.path.startsWith('/patient/billing') ? 'text-teal-700 bg-teal-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <Icon name="lucide:credit-card" class="w-4 h-4 mr-2" />
              Billing
            </NuxtLink>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Date Display -->
            <div class="hidden lg:block text-right">
              <p class="text-sm text-gray-600">Today</p>
              <p class="text-sm font-medium text-gray-900">{{ new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</p>
            </div>
            
            <!-- Notifications -->
            <button class="p-2 text-gray-400 hover:text-gray-600 relative">
              <Icon name="lucide:bell" class="w-5 h-5" />
              <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <!-- User Profile & Logout -->
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-white">{{ getUserInitials() }}</span>
                </div>
                <div class="hidden sm:block text-right">
                  <p class="text-sm font-medium text-gray-800">{{ authStore.fullName }}</p>
                  <p class="text-xs text-gray-500">Patient</p>
                </div>
              </div>
              
              <!-- Logout Button -->
              <button 
                @click="handleLogout"
                class="flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Icon name="lucide:log-out" class="w-4 h-4 mr-1" />
                <span class="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation (if needed) -->
      <div class="md:hidden border-t border-gray-200">
        <div class="px-2 py-3 space-y-1">
          <NuxtLink 
            to="/patient" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="$route.path === '/patient' ? 'text-teal-700 bg-teal-50' : 'text-gray-600'"
          >
            <Icon name="lucide:home" class="w-4 h-4 mr-2" />
            Dashboard
          </NuxtLink>
          
          <NuxtLink 
            to="/patient/appointments" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="$route.path.startsWith('/patient/appointments') ? 'text-teal-700 bg-teal-50' : 'text-gray-600'"
          >
            <Icon name="lucide:calendar" class="w-4 h-4 mr-2" />
            Appointments
          </NuxtLink>
          
          <NuxtLink 
            to="/patient/medical-records" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="$route.path.startsWith('/patient/medical-records') ? 'text-teal-700 bg-teal-50' : 'text-gray-600'"
          >
            <Icon name="lucide:file-text" class="w-4 h-4 mr-2" />
            Medical Records
          </NuxtLink>
          
          <NuxtLink 
            to="/patient/billing" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-md"
            :class="$route.path.startsWith('/patient/billing') ? 'text-teal-700 bg-teal-50' : 'text-gray-600'"
          >
            <Icon name="lucide:credit-card" class="w-4 h-4 mr-2" />
            Billing
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>