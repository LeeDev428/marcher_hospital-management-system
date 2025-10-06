<script setup lang="ts">
import { useAuthStore } from "~/stores/app"

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const getUserInitials = () => {
  if (!authStore.user) return 'U'
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
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
      <!-- Logo -->
      <div class="flex items-center px-6 py-4 border-b border-gray-200">
        <div class="flex items-center">
            <img src="/img/logo/marcher-logo.png" alt="Marcher Logo" class="w-6 h-6" />
          <span class="ml-3 text-xl font-semibold text-gray-800">Marcher</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="mt-6 px-3">
        <div class="space-y-1">
          <NuxtLink 
            to="/staff/dashboard" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path === '/staff/dashboard' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:layout-dashboard" class="w-5 h-5 mr-3" />
            Dashboard
          </NuxtLink>
          
          <NuxtLink 
            to="/staff/patients" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/staff/patients') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:users" class="w-5 h-5 mr-3" />
            Patients
          </NuxtLink>
          
          <NuxtLink 
            to="/staff/appointments" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/staff/appointments') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:calendar" class="w-5 h-5 mr-3" />
            Appointments
          </NuxtLink>
          
          <NuxtLink 
            to="/staff/schedule" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/staff/schedule') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:clock" class="w-5 h-5 mr-3" />
            Schedule
          </NuxtLink>
          
          <NuxtLink 
            to="/staff/billing" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/staff/billing') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:credit-card" class="w-5 h-5 mr-3" />
            Billing
          </NuxtLink>
          
          <NuxtLink 
            to="/staff/reports" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/staff/reports') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:file-text" class="w-5 h-5 mr-3" />
            Reports
            </NuxtLink>
            
             <NuxtLink 
            to="/staff/medical-services" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/staff/medical-services') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
            >
            <Icon name="lucide:stethoscope" class="w-5 h-5 mr-3" />
            Services
            </NuxtLink>

          <NuxtLink 
            to="/staff/staff" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/staff/staff') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:user-check" class="w-5 h-5 mr-3" />
            Staff
          </NuxtLink>
          
          <NuxtLink 
            to="/staff/pharmacy" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/staff/pharmacy') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:pill" class="w-5 h-5 mr-3" />
            Pharmacy
          </NuxtLink>
          
          <NuxtLink 
            to="/staff/facilities" 
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg"
            :class="$route.path.startsWith('/staff/facilities') ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'"
          >
            <Icon name="lucide:building-2" class="w-5 h-5 mr-3" />
            Facilities
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Top Header -->
      <header class="bg-white border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-semibold text-gray-800">Staff Dashboard</h1>
            <p class="text-sm text-gray-600">Welcome back, {{ authStore.fullName }}</p>
          </div>
          
          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="p-2 text-gray-400 hover:text-gray-600 relative">
              <Icon name="lucide:bell" class="w-5 h-5" />
              <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <!-- User Profile & Logout -->
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span class="text-sm font-medium text-white">{{ getUserInitials() }}</span>
                </div>
                <div class="text-right">
                  <p class="text-sm font-medium text-gray-800">{{ authStore.fullName }}</p>
                  <p class="text-xs text-gray-500">Staff Member</p>
                </div>
              </div>
              
              <!-- Logout Button -->
              <button 
                @click="handleLogout"
                class="flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Icon name="lucide:log-out" class="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
